import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import { features, server } from '@/lib/config';
import { 
  sanitizeString, 
  validateHostname, 
  validatePort, 
  validateServerType, 
  validateAlias,
  sanitizeMongoQuery 
} from '@/lib/validation';

// GET: Fetch all favorites for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Check if favorites feature is enabled
    if (!features.favorites) {
      return NextResponse.json(
        { error: 'Favorites feature is currently disabled' },
        { status: 403 }
      );
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const favorites = await Favorite.find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .lean();

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

// POST: Add a new favorite server
export async function POST(request: NextRequest) {
  try {
    // Check if favorites feature is enabled
    if (!features.favorites) {
      return NextResponse.json(
        { error: 'Favorites feature is currently disabled' },
        { status: 403 }
      );
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { serverHost: rawHost, serverPort, serverType: rawType, alias: rawAlias } = body;

    // Validate and sanitize inputs
    if (!rawHost || !serverPort) {
      return NextResponse.json({ error: 'Server host and port are required' }, { status: 400 });
    }

    const serverHost = sanitizeString(rawHost);
    
    // Validate hostname
    const hostValidation = validateHostname(serverHost);
    if (!hostValidation.valid) {
      return NextResponse.json(
        { error: hostValidation.error || 'Invalid hostname' },
        { status: 400 }
      );
    }

    // Validate port
    const portValidation = validatePort(serverPort);
    if (!portValidation.valid) {
      return NextResponse.json(
        { error: portValidation.error || 'Invalid port' },
        { status: 400 }
      );
    }

    // Validate and sanitize server type
    const serverType = rawType || 'java';
    const typeValidation = validateServerType(serverType);
    if (!typeValidation.valid) {
      return NextResponse.json(
        { error: typeValidation.error || 'Invalid server type' },
        { status: 400 }
      );
    }

    // Validate and sanitize alias (optional)
    const alias = rawAlias ? sanitizeString(rawAlias) : null;
    if (alias) {
      const aliasValidation = validateAlias(alias);
      if (!aliasValidation.valid) {
        return NextResponse.json(
          { error: aliasValidation.error || 'Invalid alias' },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    // Check current favorite count for this user
    const favoriteCount = await Favorite.countDocuments({ userId: session.user.id });
    
    if (favoriteCount >= server.maxFavoritesPerUser) {
      return NextResponse.json(
        { error: `Maximum ${server.maxFavoritesPerUser} favorites allowed per user` },
        { status: 400 }
      );
    }

    // Check if favorite already exists
    const existing = await Favorite.findOne({
      userId: session.user.id,
      serverHost,
      serverPort,
    });

    if (existing) {
      return NextResponse.json({ error: 'Server already in favorites' }, { status: 409 });
    }

    const favorite = await Favorite.create({
      userId: session.user.id,
      serverHost,
      serverPort,
      serverType,
      alias,
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

// DELETE: Remove a favorite server
export async function DELETE(request: NextRequest) {
  try {
    // Check if favorites feature is enabled
    if (!features.favorites) {
      return NextResponse.json(
        { error: 'Favorites feature is currently disabled' },
        { status: 403 }
      );
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const favoriteId = sanitizeString(searchParams.get('id') || '');

    if (!favoriteId) {
      return NextResponse.json({ error: 'Favorite ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Use sanitized query to prevent NoSQL injection
    const favorite = await Favorite.findOneAndDelete(
      sanitizeMongoQuery({
        _id: favoriteId,
        userId: session.user.id,
      })
    );

    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}

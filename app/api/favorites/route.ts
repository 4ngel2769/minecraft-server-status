import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

// GET: Fetch all favorites for the authenticated user
export async function GET(request: NextRequest) {
  try {
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { serverHost, serverPort, serverType, alias } = body;

    if (!serverHost || !serverPort) {
      return NextResponse.json({ error: 'Server host and port are required' }, { status: 400 });
    }

    await dbConnect();

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
      serverType: serverType || 'java',
      alias: alias || null,
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get('id');

    if (!favoriteId) {
      return NextResponse.json({ error: 'Favorite ID is required' }, { status: 400 });
    }

    await dbConnect();

    const favorite = await Favorite.findOneAndDelete({
      _id: favoriteId,
      userId: session.user.id,
    });

    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}

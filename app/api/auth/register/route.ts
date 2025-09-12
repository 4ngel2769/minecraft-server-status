import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { features } from '@/lib/config';
import { 
  sanitizeString, 
  validateEmail, 
  validatePassword, 
  validateName 
} from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Check if user registration is enabled
    if (!features.userRegistration) {
      return NextResponse.json(
        { error: 'User registration is currently disabled' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email: rawEmail, password, name: rawName } = body;

    // Validate and sanitize inputs
    if (!rawEmail || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sanitize email
    const email = sanitizeString(rawEmail).toLowerCase();

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error || 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] || 'Invalid password' },
        { status: 400 }
      );
    }

    // Validate and sanitize name (optional)
    let name = rawName ? sanitizeString(rawName) : undefined;
    if (name) {
      const nameValidation = validateName(name);
      if (!nameValidation.valid) {
        return NextResponse.json(
          { error: nameValidation.error || 'Invalid name format' },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0],
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

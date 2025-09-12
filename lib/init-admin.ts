import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { admin } from '@/lib/config';

/**
 * Initialize default admin user if configured and doesn't exist
 * This should be called on server startup
 */
export async function initializeAdminUser(): Promise<void> {
  // Skip if admin user creation is not enabled
  if (!admin.enabled) {
    console.log('Admin user creation disabled (no credentials provided)');
    return;
  }

  try {
    await dbConnect();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: admin.email });
    
    if (existingAdmin) {
      console.log(`Admin user already exists: ${admin.email}`);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    
    await User.create({
      email: admin.email,
      password: hashedPassword,
      name: admin.name,
    });

    console.log(`✅ Admin user created successfully: ${admin.email}`);
  } catch (error) {
    console.error('Failed to initialize admin user:', error);
    // Don't throw - we don't want to crash the app if admin creation fails
  }
}

/**
 * Check if a user is an admin
 */
export function isAdminEmail(email: string): boolean {
  if (!admin.enabled) {
    return false;
  }
  return email.toLowerCase() === admin.email.toLowerCase();
}

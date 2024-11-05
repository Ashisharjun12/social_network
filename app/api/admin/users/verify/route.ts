import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, action, adminUsername } = await req.json();

    if (!username || !action || !adminUsername) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if admin exists
    const admin = await User.findOne({ username: adminUsername, role: 'admin' });
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Find and update user
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update verification status
    user.isVerified = action === 'verify';
    if (action === 'verify') {
      user.verifiedAt = new Date();
      user.verifiedBy = adminUsername;
    } else {
      user.verifiedAt = undefined;
      user.verifiedBy = undefined;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: `User ${action === 'verify' ? 'verified' : 'unverified'} successfully`,
      user: {
        username: user.username,
        isVerified: user.isVerified,
        verifiedAt: user.verifiedAt,
        verifiedBy: user.verifiedBy
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to update verification status' },
      { status: 500 }
    );
  }
} 
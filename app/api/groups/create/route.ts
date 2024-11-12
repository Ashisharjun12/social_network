import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Group from '@/lib/models/Group';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, description, username } = await req.json();

    // Get current user
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create group
    const group = await Group.create({
      name,
      description,
      createdBy: user._id,
      college: user.college,
      members: [user._id] // Creator is automatically a member
    });

    return NextResponse.json(group);

  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
} 
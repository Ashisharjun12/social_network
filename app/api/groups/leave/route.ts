import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Group from '@/lib/models/Group';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { groupId, username } = await req.json();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await Group.findByIdAndUpdate(groupId, {
      $pull: { members: user._id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error leaving group:', error);
    return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 });
  }
} 
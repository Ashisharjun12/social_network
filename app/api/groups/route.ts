import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Group from '@/lib/models/Group';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const username = url.searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Get current user
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get groups user is a member of
    const myGroups = await Group.find({
      members: currentUser._id
    }).populate('createdBy', 'username avatarUrl');

    // Get suggested groups (same college first, then others)
    let suggestedGroups = [];
    
    if (currentUser.college?.id) {
      // First get groups from same college
      const collegeGroups = await Group.find({
        'college.id': currentUser.college.id,
        members: { $ne: currentUser._id }
      }).populate('createdBy', 'username avatarUrl').limit(5);

      suggestedGroups = [...collegeGroups];
    }

    // If we need more suggestions, get groups from other colleges
    if (suggestedGroups.length < 5) {
      const otherGroups = await Group.find({
        'college.id': { $ne: currentUser.college?.id },
        members: { $ne: currentUser._id }
      }).populate('createdBy', 'username avatarUrl')
        .limit(5 - suggestedGroups.length);

      suggestedGroups = [...suggestedGroups, ...otherGroups];
    }

    // Add isJoined flag
    const formattedGroups = {
      myGroups: myGroups.map(group => ({
        ...group.toObject(),
        isJoined: true
      })),
      suggestedGroups: suggestedGroups.map(group => ({
        ...group.toObject(),
        isJoined: false
      }))
    };

    return NextResponse.json(formattedGroups);

  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
} 
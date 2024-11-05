import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username } = await req.json();

    // Check if username exists
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return NextResponse.json({ available: true });
    }

    // Generate suggestions
    const suggestions = [
      `${username}${Math.floor(Math.random() * 999)}`,
      `${username}_${Math.floor(Math.random() * 99)}`,
      `the_${username}`,
      `${username}_pro`,
      `anonymous_${username}`,
    ];

    // Filter out any suggestions that already exist
    const availableSuggestions = await Promise.all(
      suggestions.map(async (suggestion) => {
        const exists = await User.findOne({ username: suggestion });
        return exists ? null : suggestion;
      })
    );

    return NextResponse.json({
      available: false,
      suggestions: availableSuggestions.filter(Boolean)
    });

  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { error: 'Error checking username' },
      { status: 500 }
    );
  }
} 
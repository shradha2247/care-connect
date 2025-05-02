import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
	try {
		const { username, password, role } = await request.json();
		const client = await clientPromise;
		const db = client.db('healthConnectDemo');

		// Find user with matching credentials
		const user = await db.collection('users').findOne({
			username,
			password, // Note: In a real app, you should use hashed passwords!
			role,
		});

		if (!user) {
			return NextResponse.json({ error: 'Invalid credentials or role' }, { status: 401 });
		}

		// Return user info (excluding password in a real app)
		return NextResponse.json({
			id: user._id.toString(),
			username: user.username,
			role: user.role,
		});
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
	}
}

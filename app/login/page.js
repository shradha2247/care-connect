'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { login } from '@/lib/auth';

export default function LoginPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password, role }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Login failed');
			}

			// Save user data to localStorage
			login(data);

			// Redirect based on role
			if (data.role === 'medical') {
				router.push('/dashboard/medical');
			} else if (data.role === 'caregiver') {
				router.push('/dashboard/caregiver');
			} else if (data.role === 'patient') {
				router.push('/dashboard/patient');
			}
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-blue-50">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">HealthConnect Login</CardTitle>
					<CardDescription className="text-center">Sign in to access your healthcare dashboard</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Select value={role} onValueChange={setRole} required>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select your role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="medical">Medical Professional</SelectItem>
									<SelectItem value="caregiver">Care Giver</SelectItem>
									<SelectItem value="patient">Patient</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</div>
						{error && <div className="text-sm font-medium text-red-500">{error}</div>}
						<Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

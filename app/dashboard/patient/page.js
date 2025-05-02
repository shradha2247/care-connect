'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaPills, FaHeartbeat, FaUserMd, FaSearch, FaFileMedical, FaBell } from 'react-icons/fa';
import { IoMdPulse } from 'react-icons/io';
import { RiHealthBookLine, RiMessage2Line } from 'react-icons/ri';
import { MdDashboard, MdLogout, MdOutlineWarning, MdOutlineLocalHospital } from 'react-icons/md';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getUser, logout } from '@/lib/auth';

const MOCK_MEDICATIONS = [
	{
		id: 1,
		name: 'Lisinopril',
		dosage: '10mg',
		frequency: 'Once daily',
		time: 'Morning',
		purpose: 'Blood Pressure',
		refillDate: '2025-05-15',
		instructions: 'Take with food',
		status: 'active',
	},
	{
		id: 2,
		name: 'Metformin',
		dosage: '500mg',
		frequency: 'Twice daily',
		time: 'Morning and Evening',
		purpose: 'Diabetes',
		refillDate: '2025-05-20',
		instructions: 'Take with meals',
		status: 'active',
	},
	{
		id: 3,
		name: 'Atorvastatin',
		dosage: '20mg',
		frequency: 'Once daily',
		time: 'Evening',
		purpose: 'Cholesterol',
		refillDate: '2025-06-05',
		instructions: 'Take at bedtime',
		status: 'active',
	},
	{
		id: 4,
		name: 'Aspirin',
		dosage: '81mg',
		frequency: 'Once daily',
		time: 'Morning',
		purpose: 'Heart Health',
		refillDate: '2025-07-10',
		instructions: 'Take with food',
		status: 'active',
	},
];

const MOCK_APPOINTMENTS = [
	{
		id: 1,
		doctor: 'Dr. Aditya Sharma',
		specialty: 'Geriatric Medicine',
		time: '10:30 AM',
		date: 'May 10, 2025',
		type: 'Check-up',
		status: 'upcoming',
		location: 'Sunrise Healthcare Center',
	},
	{
		id: 2,
		doctor: 'Dr. Priya Mehta',
		specialty: 'Cardiology',
		time: '2:15 PM',
		date: 'May 17, 2025',
		type: 'Follow-up',
		status: 'upcoming',
		location: 'Heart Care Institute',
	},
	{
		id: 3,
		doctor: 'Dr. Rajiv Kumar',
		specialty: 'Endocrinology',
		time: '11:00 AM',
		date: 'May 25, 2025',
		type: 'Consultation',
		status: 'upcoming',
		location: 'Sunrise Healthcare Center',
	},
];

const MOCK_VITALS = [
	{ date: 'May 1, 2025', bp: '138/85', pulse: 78, weight: '72 kg', glucose: '126 mg/dL' },
	{ date: 'Apr 28, 2025', bp: '142/88', pulse: 82, weight: '72.5 kg', glucose: '132 mg/dL' },
	{ date: 'Apr 25, 2025', bp: '140/86', pulse: 76, weight: '73 kg', glucose: '128 mg/dL' },
	{ date: 'Apr 22, 2025', bp: '145/90', pulse: 80, weight: '73 kg', glucose: '135 mg/dL' },
	{ date: 'Apr 19, 2025', bp: '148/92', pulse: 84, weight: '73.5 kg', glucose: '140 mg/dL' },
];

const MOCK_MESSAGES = [
	{
		id: 1,
		from: 'Dr. Aditya Sharma',
		message: 'Your recent blood work looks good. Continue with your current medication regimen.',
		time: '2 days ago',
		read: false,
	},
	{
		id: 2,
		from: 'Deepak Singh (Caregiver)',
		message: 'Reminder: We need to pick up your prescription refill tomorrow.',
		time: '1 day ago',
		read: true,
	},
	{
		id: 3,
		from: 'Sunrise Healthcare',
		message: 'Your appointment with Dr. Priya Mehta has been confirmed for May 17.',
		time: '5 hours ago',
		read: false,
	},
];

export default function PatientDashboard() {
	const [user, setUser] = useState(null);
	const [activeMenu, setActiveMenu] = useState('dashboard');
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [todayMeds, setTodayMeds] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const userData = getUser();

		if (!userData || userData.role !== 'patient') {
			router.push('/login');
			return;
		}

		setUser({
			...userData,
			fullName: 'Rajesh Kumar',
			age: 72,
			gender: 'Male',
			conditions: ['Hypertension', 'Type 2 Diabetes'],
			primaryDoctor: 'Dr. Aditya Sharma',
		});

		// Filter medications for today
		setTodayMeds(MOCK_MEDICATIONS.filter((med) => med.status === 'active'));
	}, [router]);

	const handleLogout = () => {
		logout();
		router.push('/');
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'taken':
				return 'text-green-600 bg-green-100';
			case 'missed':
				return 'text-red-600 bg-red-100';
			case 'upcoming':
				return 'text-blue-600 bg-blue-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gray-50 flex">
			<motion.div initial={false} animate={{ width: sidebarOpen ? '18rem' : '5rem' }} className="fixed inset-y-0 left-0 bg-blue-800 shadow-lg z-10">
				<div className="flex items-center justify-between p-4">
					<motion.div initial={false} animate={{ opacity: sidebarOpen ? 1 : 0, display: sidebarOpen ? 'flex' : 'none' }} className="flex items-center">
						<IoMdPulse className="text-3xl text-white mr-2" />
						<span className="font-bold text-xl text-white">HealthConnect</span>
					</motion.div>
					<Button variant="ghost" className="text-white p-1 hover:bg-blue-700 rounded-full" onClick={() => setSidebarOpen(!sidebarOpen)}>
						<HiOutlineMenuAlt2 className="w-6 h-6" />
					</Button>
				</div>

				<div className="mt-6 px-2">
					<motion.div initial={false} animate={{ opacity: sidebarOpen ? 1 : 0 }} className={`flex items-center p-3 ${sidebarOpen ? 'justify-start' : 'justify-center'} mb-4`}>
						<div className="ml-3">
							<p className="text-white font-semibold">{user.fullName}</p>
							<p className="text-blue-200 text-sm">Patient</p>
						</div>
					</motion.div>

					<nav className="space-y-1">
						{[
							{ name: 'Dashboard', icon: <MdDashboard className="w-5 h-5" />, id: 'dashboard' },
							{ name: 'Health Records', icon: <RiHealthBookLine className="w-5 h-5" />, id: 'records' },
							{ name: 'Medications', icon: <FaPills className="w-5 h-5" />, id: 'medications' },
							{ name: 'Appointments', icon: <FaCalendarAlt className="w-5 h-5" />, id: 'appointments' },
							{ name: 'Vitals Tracker', icon: <FaHeartbeat className="w-5 h-5" />, id: 'vitals' },
							{ name: 'Messages', icon: <RiMessage2Line className="w-5 h-5" />, id: 'messages' },
							{ name: 'Care Team', icon: <FaUserMd className="w-5 h-5" />, id: 'careteam' },
						].map((item) => (
							<Link
								key={item.id}
								href="#"
								onClick={() => setActiveMenu(item.id)}
								className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-3 text-base font-medium rounded-md ${
									activeMenu === item.id ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
								}`}
							>
								{item.icon}
								{sidebarOpen && <span className="ml-3">{item.name}</span>}
							</Link>
						))}
					</nav>

					<div className="absolute bottom-0 left-0 right-0 p-4">
						<Button
							variant="ghost"
							className={`flex items-center ${sidebarOpen ? 'w-full justify-start' : 'justify-center'} text-blue-100 hover:bg-blue-700 hover:text-white`}
							onClick={handleLogout}
						>
							<MdLogout className="w-5 h-5" />
							{sidebarOpen && <span className="ml-3">Logout</span>}
						</Button>
					</div>
				</div>
			</motion.div>

			<div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
				<header className="bg-white shadow-sm">
					<div className="flex items-center justify-between px-6 py-4">
						<h1 className="text-2xl font-bold text-gray-900">
							{activeMenu === 'dashboard'
								? 'My Health Dashboard'
								: activeMenu === 'records'
								? 'My Health Records'
								: activeMenu === 'medications'
								? 'My Medications'
								: activeMenu === 'appointments'
								? 'My Appointments'
								: activeMenu === 'vitals'
								? 'Vitals Tracker'
								: activeMenu === 'messages'
								? 'Messages'
								: 'My Care Team'}
						</h1>
						<div className="flex items-center space-x-4">
							<div className="relative">
								<Button variant="ghost" className="rounded-full p-2">
									<FaBell className="w-5 h-5" />
									<span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
								</Button>
							</div>
							<div className="h-6 w-px bg-gray-300"></div>
							<div className="flex items-center">
								<span className="text-sm font-medium text-gray-700 mr-2">{user.fullName}</span>
							</div>
						</div>
					</div>
				</header>

				<main className="p-6">
					{activeMenu === 'dashboard' && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">Health Status</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">Stable</p>
										</div>
										<div className="p-3 bg-green-100 rounded-full">
											<FaHeartbeat className="w-6 h-6 text-green-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-green-600">Last checked: Today</p>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">Medications Today</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">{todayMeds.length}</p>
										</div>
										<div className="p-3 bg-blue-100 rounded-full">
											<FaPills className="w-6 h-6 text-blue-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-blue-600">2 taken, 2 remaining</p>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">Next Appointment</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">May 10</p>
										</div>
										<div className="p-3 bg-indigo-100 rounded-full">
											<FaCalendarAlt className="w-6 h-6 text-indigo-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-indigo-600">Dr. Aditya Sharma</p>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">New Messages</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">2</p>
										</div>
										<div className="p-3 bg-purple-100 rounded-full">
											<RiMessage2Line className="w-6 h-6 text-purple-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-purple-600">From your care team</p>
									</div>
								</Card>
							</div>

							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-6">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-semibold text-gray-900">My Health Summary</h2>
											<Button variant="ghost" className="text-blue-600 text-sm">
												View Details
											</Button>
										</div>
										<div className="mt-4 space-y-4">
											<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
												<div className="flex items-center">
													<div className="p-2 bg-blue-100 rounded-lg mr-3">
														<FaUserMd className="w-5 h-5 text-blue-600" />
													</div>
													<div>
														<p className="font-medium">Primary Doctor</p>
														<p className="text-sm text-gray-600">{user.primaryDoctor}</p>
													</div>
												</div>
												<Button variant="ghost" className="text-blue-600 text-sm">
													Contact
												</Button>
											</div>

											<div className="p-3 bg-gray-50 rounded-lg">
												<p className="font-medium mb-2">Medical Conditions</p>
												<div className="flex flex-wrap gap-2">
													{user.conditions.map((condition, index) => (
														<span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
															{condition}
														</span>
													))}
												</div>
											</div>

											<div className="p-3 bg-gray-50 rounded-lg">
												<p className="font-medium mb-2">Recent Vitals</p>
												<div className="grid grid-cols-2 gap-4">
													<div>
														<p className="text-sm text-gray-600">Blood Pressure</p>
														<p className="font-medium">{MOCK_VITALS[0].bp}</p>
													</div>
													<div>
														<p className="text-sm text-gray-600">Pulse</p>
														<p className="font-medium">{MOCK_VITALS[0].pulse} bpm</p>
													</div>
													<div>
														<p className="text-sm text-gray-600">Weight</p>
														<p className="font-medium">{MOCK_VITALS[0].weight}</p>
													</div>
													<div>
														<p className="text-sm text-gray-600">Blood Glucose</p>
														<p className="font-medium">{MOCK_VITALS[0].glucose}</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Card>

								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-6">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-semibold text-gray-900">Todays Medications</h2>
											<Button variant="ghost" className="text-blue-600 text-sm">
												View All
											</Button>
										</div>
										<div className="mt-4 space-y-3">
											{todayMeds.map((medication, index) => (
												<div key={medication.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
													<div className={`p-2 ${index < 2 ? 'bg-green-100' : 'bg-blue-100'} rounded-lg mr-3`}>
														<FaPills className={`w-5 h-5 ${index < 2 ? 'text-green-600' : 'text-blue-600'}`} />
													</div>
													<div className="flex-1">
														<p className="font-medium">
															{medication.name} {medication.dosage}
														</p>
														<p className="text-sm text-gray-600">
															{medication.time} - {medication.purpose}
														</p>
													</div>
													<div className="text-right">
														<span
															className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${index < 2 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
														>
															{index < 2 ? 'Taken' : 'Upcoming'}
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								</Card>
							</div>

							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-6">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
											<Button variant="ghost" className="text-blue-600 text-sm">
												Schedule New
											</Button>
										</div>
										<div className="mt-4 space-y-3">
											{MOCK_APPOINTMENTS.map((appointment) => (
												<div key={appointment.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
													<div className="p-2 bg-indigo-100 rounded-lg mr-3">
														<FaCalendarAlt className="w-5 h-5 text-indigo-600" />
													</div>
													<div className="flex-1">
														<p className="font-medium">{appointment.doctor}</p>
														<p className="text-sm text-gray-600">
															{appointment.specialty} - {appointment.type}
														</p>
													</div>
													<div className="text-right">
														<p className="font-medium">{appointment.date}</p>
														<p className="text-sm text-gray-600">{appointment.time}</p>
													</div>
												</div>
											))}
										</div>
									</div>
								</Card>

								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-6">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
											<Button variant="ghost" className="text-blue-600 text-sm">
												View All
											</Button>
										</div>
										<div className="mt-4 space-y-3">
											{MOCK_MESSAGES.map((message) => (
												<div key={message.id} className="flex p-3 hover:bg-gray-50 rounded-lg">
													<div className={`p-2 ${message.read ? 'bg-gray-100' : 'bg-purple-100'} rounded-lg mr-3`}>
														<RiMessage2Line className={`w-5 h-5 ${message.read ? 'text-gray-600' : 'text-purple-600'}`} />
													</div>
													<div className="flex-1">
														<div className="flex justify-between">
															<p className="font-medium">{message.from}</p>
															<p className="text-sm text-gray-500">{message.time}</p>
														</div>
														<p className="text-sm mt-1">{message.message}</p>
													</div>
													{!message.read && <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>}
												</div>
											))}
										</div>
									</div>
								</Card>
							</div>
						</div>
					)}

					{activeMenu === 'medications' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<div className="relative w-96">
									<Input type="text" placeholder="Search medications..." className="pl-10" />
									<FaSearch className="absolute left-3 top-3 text-gray-400" />
								</div>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">Request Refill</Button>
							</div>

							<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
								<Card className="bg-white p-6 shadow-sm col-span-2">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Medication
													</th>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Dosage
													</th>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Schedule
													</th>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Purpose
													</th>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Refill Date
													</th>
													<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
														Actions
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{MOCK_MEDICATIONS.map((medication) => (
													<tr key={medication.id} className="hover:bg-gray-50">
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm font-medium text-gray-900">{medication.name}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">{medication.dosage}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">{medication.frequency}</div>
															<div className="text-sm text-gray-500">{medication.time}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">{medication.purpose}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">{new Date(medication.refillDate).toLocaleDateString('en-IN')}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
															<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
																Details
															</Button>
															<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
																Refill
															</Button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Todays Schedule</h3>
									<div className="space-y-4">
										<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
											<div className="flex items-center justify-between mb-2">
												<h4 className="font-medium">Morning Medications</h4>
												<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Taken</span>
											</div>
											<ul className="space-y-2">
												<li className="flex items-center">
													<div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
													<span className="text-sm">Lisinopril 10mg</span>
												</li>
												<li className="flex items-center">
													<div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
													<span className="text-sm">Metformin 500mg</span>
												</li>
												<li className="flex items-center">
													<div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
													<span className="text-sm">Aspirin 81mg</span>
												</li>
											</ul>
											<p className="text-xs text-gray-500 mt-2">Taken at 8:15 AM</p>
										</div>

										<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
											<div className="flex items-center justify-between mb-2">
												<h4 className="font-medium">Evening Medications</h4>
												<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Upcoming</span>
											</div>
											<ul className="space-y-2">
												<li className="flex items-center">
													<div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
													<span className="text-sm">Metformin 500mg</span>
												</li>
												<li className="flex items-center">
													<div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
													<span className="text-sm">Atorvastatin 20mg</span>
												</li>
											</ul>
											<p className="text-xs text-gray-500 mt-2">Due at 7:00 PM</p>
										</div>

										<div className="mt-4">
											<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Mark Evening Medications as Taken</Button>
										</div>
									</div>
								</Card>
							</div>

							<Card className="bg-white p-6 shadow-sm">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">Medication History</h3>
								<div className="space-y-4">
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div className="flex items-center">
											<div className="p-2 bg-green-100 rounded-lg mr-3">
												<FaPills className="w-5 h-5 text-green-600" />
											</div>
											<div>
												<p className="font-medium">All medications taken as scheduled</p>
												<p className="text-sm text-gray-600">May 1, 2025</p>
											</div>
										</div>
									</div>
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div className="flex items-center">
											<div className="p-2 bg-red-100 rounded-lg mr-3">
												<FaPills className="w-5 h-5 text-red-600" />
											</div>
											<div>
												<p className="font-medium">Missed evening dose of Metformin</p>
												<p className="text-sm text-gray-600">April 30, 2025</p>
											</div>
										</div>
									</div>
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div className="flex items-center">
											<div className="p-2 bg-green-100 rounded-lg mr-3">
												<FaPills className="w-5 h-5 text-green-600" />
											</div>
											<div>
												<p className="font-medium">All medications taken as scheduled</p>
												<p className="text-sm text-gray-600">April 29, 2025</p>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</div>
					)}

					{activeMenu === 'appointments' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<div className="flex space-x-4">
									<Button className="bg-blue-600 hover:bg-blue-700 text-white">Upcoming</Button>
									<Button variant="outline" className="border-gray-300 text-gray-700">
										Past
									</Button>
								</div>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">Request Appointment</Button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								{MOCK_APPOINTMENTS.map((appointment) => (
									<Card key={appointment.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
										<div className="p-6">
											<div className="flex items-center justify-between mb-4">
												<div className="p-3 bg-indigo-100 rounded-full">
													<FaCalendarAlt className="w-6 h-6 text-indigo-600" />
												</div>
												<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{appointment.type}</span>
											</div>
											<h3 className="text-lg font-semibold text-gray-900">{appointment.doctor}</h3>
											<p className="text-sm text-gray-600 mb-4">{appointment.specialty}</p>
											<div className="space-y-2">
												<div className="flex items-center">
													<FaCalendarAlt className="w-4 h-4 text-gray-500 mr-2" />
													<span className="text-sm">{appointment.date}</span>
												</div>
												<div className="flex items-center">
													<FaCalendarAlt className="w-4 h-4 text-gray-500 mr-2" />
													<span className="text-sm">{appointment.time}</span>
												</div>
												<div className="flex items-center">
													<MdOutlineLocalHospital className="w-4 h-4 text-gray-500 mr-2" />
													<span className="text-sm">{appointment.location}</span>
												</div>
											</div>
											<div className="mt-6 flex space-x-2">
												<Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Reschedule</Button>
												<Button variant="outline" className="flex-1 border-gray-300 text-gray-700">
													Cancel
												</Button>
											</div>
										</div>
									</Card>
								))}
							</div>

							<Card className="bg-white p-6 shadow-sm">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h3>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Doctor
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Specialty
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Date
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Type
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Notes
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											<tr className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">Dr. Aditya Sharma</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">Geriatric Medicine</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">April 25, 2025</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">Check-up</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-900">Reviewed medication efficacy. Blood pressure slightly elevated.</div>
												</td>
											</tr>
											<tr className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">Dr. Priya Mehta</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">Cardiology</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">April 10, 2025</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">Consultation</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-900">ECG performed. Results normal. Continue current heart medication.</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</Card>
						</div>
					)}

					{activeMenu === 'vitals' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<div className="flex space-x-4">
									<Button className="bg-blue-600 hover:bg-blue-700 text-white">Week</Button>
									<Button variant="outline" className="border-gray-300 text-gray-700">
										Month
									</Button>
									<Button variant="outline" className="border-gray-300 text-gray-700">
										Year
									</Button>
								</div>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">Record New Vitals</Button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Card className="bg-white p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Pressure Trends</h3>
									<div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">Blood Pressure Chart Visualization</p>
									</div>
									<div className="mt-4 space-y-2">
										<div className="flex justify-between items-center">
											<p className="text-sm text-gray-600">Current</p>
											<p className="font-medium">{MOCK_VITALS[0].bp}</p>
										</div>
										<div className="flex justify-between items-center">
											<p className="text-sm text-gray-600">Average (Week)</p>
											<p className="font-medium">140/87</p>
										</div>
										<div className="flex justify-between items-center">
											<p className="text-sm text-gray-600">Target</p>
											<p className="font-medium">Below 130/80</p>
										</div>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Glucose Trends</h3>
									<div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">Blood Glucose Chart Visualization</p>
									</div>
									<div className="mt-4 space-y-2">
										<div className="flex justify-between items-center">
											<p className="text-sm text-gray-600">Current</p>
											<p className="font-medium">{MOCK_VITALS[0].glucose}</p>
										</div>
										<div className="flex justify-between items-center">
											<p className="text-sm text-gray-600">Average (Week)</p>
											<p className="font-medium">130 mg/dL</p>
										</div>
										<div className="flex justify-between items-center">
											<p className="text-sm text-gray-600">Target</p>
											<p className="font-medium">80-130 mg/dL</p>
										</div>
									</div>
								</Card>
							</div>

							<Card className="bg-white p-6 shadow-sm">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">Vitals History</h3>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Date
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Blood Pressure
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Pulse
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Weight
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Blood Glucose
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{MOCK_VITALS.map((vital, index) => (
												<tr key={index} className="hover:bg-gray-50">
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm font-medium text-gray-900">{vital.date}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">{vital.bp}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">{vital.pulse} bpm</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">{vital.weight}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">{vital.glucose}</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</Card>
						</div>
					)}

					{activeMenu === 'messages' && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-4 border-b">
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold text-gray-900">Messages</h3>
											<Button variant="ghost" className="text-blue-600 text-sm">
												New Message
											</Button>
										</div>
										<div className="relative mt-2">
											<Input type="text" placeholder="Search messages..." className="pl-10" />
											<FaSearch className="absolute left-3 top-3 text-gray-400" />
										</div>
									</div>
									<div className="max-h-[600px] overflow-y-auto">
										{MOCK_MESSAGES.map((message) => (
											<div key={message.id} className={`flex p-4 hover:bg-gray-50 cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}>
												<div className="flex-1">
													<div className="flex justify-between">
														<p className="font-medium">{message.from}</p>
														<p className="text-sm text-gray-500">{message.time}</p>
													</div>
													<p className="text-sm mt-1 text-gray-800 truncate">{message.message}</p>
												</div>
												{!message.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
											</div>
										))}
									</div>
								</Card>

								<Card className="bg-white shadow-sm col-span-2">
									<div className="p-4 border-b flex justify-between items-center">
										<div className="flex items-center">
											<div className="p-2 bg-blue-100 rounded-full mr-3">
												<FaUserMd className="w-5 h-5 text-blue-600" />
											</div>
											<div>
												<h3 className="text-lg font-semibold text-gray-900">Dr. Aditya Sharma</h3>
												<p className="text-sm text-gray-600">Geriatric Medicine</p>
											</div>
										</div>
										<Button variant="outline" className="border-gray-300 text-gray-700">
											<FaFileMedical className="w-4 h-4 mr-2" />
											View Records
										</Button>
									</div>
									<div className="p-6 max-h-[400px] overflow-y-auto">
										<div className="space-y-4">
											<div className="flex">
												<div className="p-2 bg-blue-100 rounded-full mr-3 h-10 w-10 flex items-center justify-center">
													<span className="text-blue-600 font-bold">AS</span>
												</div>
												<div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
													<p className="text-sm text-gray-900">
														Hello Mr. Kumar, Ive reviewed your recent blood work and everything looks good. Your blood pressure is still a bit high, so please continue monitoring it
														daily.
													</p>
													<p className="text-xs text-gray-500 mt-1">2 days ago</p>
												</div>
											</div>

											<div className="flex justify-end">
												<div className="bg-blue-600 rounded-lg p-3 max-w-[80%] text-white">
													<p className="text-sm">Thank you, Doctor. Ive been taking my medication regularly. Should I continue with the same dosage?</p>
													<p className="text-xs text-blue-200 mt-1">2 days ago</p>
												</div>
												<div className="p-2 bg-blue-700 rounded-full ml-3 h-10 w-10 flex items-center justify-center">
													<span className="text-white font-bold">RK</span>
												</div>
											</div>

											<div className="flex">
												<div className="p-2 bg-blue-100 rounded-full mr-3 h-10 w-10 flex items-center justify-center">
													<span className="text-blue-600 font-bold">AS</span>
												</div>
												<div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
													<p className="text-sm text-gray-900">
														Yes, please continue with the same dosage. Well reassess at your next appointment on May 10th. Remember to bring your blood pressure log with you.
													</p>
													<p className="text-xs text-gray-500 mt-1">2 days ago</p>
												</div>
											</div>
										</div>
									</div>
									<div className="p-4 border-t">
										<div className="flex">
											<Input type="text" placeholder="Type your message..." className="flex-grow mr-2" />
											<Button className="bg-blue-600 hover:bg-blue-700 text-white">Send</Button>
										</div>
									</div>
								</Card>
							</div>
						</div>
					)}

					{activeMenu === 'careteam' && (
						<div className="space-y-6">
							<Card className="bg-white p-6 shadow-sm">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">My Care Team</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									<div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
										<div className="flex items-center mb-4">
											<div className="p-3 bg-blue-100 rounded-full mr-3">
												<FaUserMd className="w-6 h-6 text-blue-600" />
											</div>
											<div>
												<h4 className="font-medium">Dr. Aditya Sharma</h4>
												<p className="text-sm text-gray-600">Primary Physician</p>
											</div>
										</div>
										<div className="space-y-2">
											<p className="text-sm">Geriatric Medicine</p>
											<p className="text-sm">Sunrise Healthcare Center</p>
											<p className="text-sm">Next Appointment: May 10, 2025</p>
										</div>
										<div className="mt-4 flex space-x-2">
											<Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Message</Button>
											<Button variant="outline" className="flex-1 border-gray-300 text-gray-700">
												Call
											</Button>
										</div>
									</div>

									<div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
										<div className="flex items-center mb-4">
											<div className="p-3 bg-blue-100 rounded-full mr-3">
												<FaUserMd className="w-6 h-6 text-blue-600" />
											</div>
											<div>
												<h4 className="font-medium">Dr. Priya Mehta</h4>
												<p className="text-sm text-gray-600">Cardiologist</p>
											</div>
										</div>
										<div className="space-y-2">
											<p className="text-sm">Heart Care Institute</p>
											<p className="text-sm">Next Appointment: May 17, 2025</p>
										</div>
										<div className="mt-4 flex space-x-2">
											<Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Message</Button>
											<Button variant="outline" className="flex-1 border-gray-300 text-gray-700">
												Call
											</Button>
										</div>
									</div>

									<div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
										<div className="flex items-center mb-4">
											<div className="p-3 bg-blue-100 rounded-full mr-3">
												<FaUserMd className="w-6 h-6 text-blue-600" />
											</div>
											<div>
												<h4 className="font-medium">Dr. Rajiv Kumar</h4>
												<p className="text-sm text-gray-600">Endocrinologist</p>
											</div>
										</div>
										<div className="space-y-2">
											<p className="text-sm">Sunrise Healthcare Center</p>
											<p className="text-sm">Next Appointment: May 25, 2025</p>
										</div>
										<div className="mt-4 flex space-x-2">
											<Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Message</Button>
											<Button variant="outline" className="flex-1 border-gray-300 text-gray-700">
												Call
											</Button>
										</div>
									</div>

									<div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
										<div className="flex items-center mb-4">
											<div className="p-3 bg-purple-100 rounded-full mr-3">
												<FaUserMd className="w-6 h-6 text-purple-600" />
											</div>
											<div>
												<h4 className="font-medium">Deepak Singh</h4>
												<p className="text-sm text-gray-600">Caregiver</p>
											</div>
										</div>
										<div className="space-y-2">
											<p className="text-sm">Home Care Assistant</p>
											<p className="text-sm">Schedule: Mon, Wed, Fri</p>
										</div>
										<div className="mt-4 flex space-x-2">
											<Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Message</Button>
											<Button variant="outline" className="flex-1 border-gray-300 text-gray-700">
												Call
											</Button>
										</div>
									</div>
								</div>
							</Card>

							<Card className="bg-white p-6 shadow-sm">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
								<div className="space-y-4">
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div className="flex items-center">
											<div className="p-2 bg-red-100 rounded-lg mr-3">
												<MdOutlineWarning className="w-5 h-5 text-red-600" />
											</div>
											<div>
												<p className="font-medium">Sunil Kumar (Son)</p>
												<p className="text-sm text-gray-600">+91 98765 43210</p>
											</div>
										</div>
										<Button variant="outline" className="border-gray-300 text-gray-700">
											Call
										</Button>
									</div>
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div className="flex items-center">
											<div className="p-2 bg-red-100 rounded-lg mr-3">
												<MdOutlineWarning className="w-5 h-5 text-red-600" />
											</div>
											<div>
												<p className="font-medium">Ambulance Service</p>
												<p className="text-sm text-gray-600">102</p>
											</div>
										</div>
										<Button variant="outline" className="border-gray-300 text-gray-700">
											Call
										</Button>
									</div>
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div className="flex items-center">
											<div className="p-2 bg-red-100 rounded-lg mr-3">
												<MdOutlineWarning className="w-5 h-5 text-red-600" />
											</div>
											<div>
												<p className="font-medium">Sunrise Healthcare Helpline</p>
												<p className="text-sm text-gray-600">+91 11223 44556</p>
											</div>
										</div>
										<Button variant="outline" className="border-gray-300 text-gray-700">
											Call
										</Button>
									</div>
								</div>
							</Card>
						</div>
					)}

					{activeMenu === 'records' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<div className="relative w-96">
									<Input type="text" placeholder="Search health records..." className="pl-10" />
									<FaSearch className="absolute left-3 top-3 text-gray-400" />
								</div>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">
									<FaFileMedical className="w-4 h-4 mr-2" />
									Upload Document
								</Button>
							</div>

							<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
								<Card className="bg-white p-6 shadow-sm col-span-1">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Record Categories</h3>
									<div className="space-y-2">
										<Button variant="outline" className="w-full justify-start text-left border-gray-300 text-gray-700">
											<FaFileMedical className="w-4 h-4 mr-2" />
											Medical History
										</Button>
										<Button variant="outline" className="w-full justify-start text-left border-gray-300 text-gray-700">
											<FaFileMedical className="w-4 h-4 mr-2" />
											Lab Results
										</Button>
										<Button variant="outline" className="w-full justify-start text-left border-gray-300 text-gray-700">
											<FaFileMedical className="w-4 h-4 mr-2" />
											Imaging Reports
										</Button>
										<Button variant="outline" className="w-full justify-start text-left border-gray-300 text-gray-700">
											<FaFileMedical className="w-4 h-4 mr-2" />
											Prescriptions
										</Button>
										<Button variant="outline" className="w-full justify-start text-left border-gray-300 text-gray-700">
											<FaFileMedical className="w-4 h-4 mr-2" />
											Vaccination Records
										</Button>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm col-span-2">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Health Records</h3>
									<div className="space-y-4">
										<div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<div className="p-2 bg-blue-100 rounded-lg mr-3">
														<FaFileMedical className="w-5 h-5 text-blue-600" />
													</div>
													<div>
														<p className="font-medium">Complete Blood Count</p>
														<p className="text-sm text-gray-600">Lab Results - May 1, 2025</p>
													</div>
												</div>
												<div className="flex space-x-2">
													<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
														View
													</Button>
													<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
														Download
													</Button>
												</div>
											</div>
										</div>
										<div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<div className="p-2 bg-blue-100 rounded-lg mr-3">
														<FaFileMedical className="w-5 h-5 text-blue-600" />
													</div>
													<div>
														<p className="font-medium">Chest X-Ray</p>
														<p className="text-sm text-gray-600">Imaging - April 15, 2025</p>
													</div>
												</div>
												<div className="flex space-x-2">
													<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
														View
													</Button>
													<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
														Download
													</Button>
												</div>
											</div>
										</div>
										<div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<div className="p-2 bg-blue-100 rounded-lg mr-3">
														<FaFileMedical className="w-5 h-5 text-blue-600" />
													</div>
													<div>
														<p className="font-medium">Diabetes Management Plan</p>
														<p className="text-sm text-gray-600">Treatment Plan - April 10, 2025</p>
													</div>
												</div>
												<div className="flex space-x-2">
													<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
														View
													</Button>
													<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
														Download
													</Button>
												</div>
											</div>
										</div>
										<div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<div className="p-2 bg-blue-100 rounded-lg mr-3">
														<FaFileMedical className="w-5 h-5 text-blue-600" />
													</div>
													<div>
														<p className="font-medium">Lipid Panel</p>
														<p className="text-sm text-gray-600">Lab Results - March 25, 2025</p>
													</div>
												</div>
												<div className="flex space-x-2">
													<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
														View
													</Button>
													<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
														Download
													</Button>
												</div>
											</div>
										</div>
									</div>
								</Card>
							</div>

							<Card className="bg-white p-6 shadow-sm">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History Summary</h3>
								<div className="space-y-4">
									<div className="p-4 bg-gray-50 rounded-lg">
										<h4 className="font-medium mb-2">Chronic Conditions</h4>
										<div className="space-y-2">
											<div className="flex justify-between">
												<p className="text-sm">Hypertension</p>
												<p className="text-sm text-gray-600">Diagnosed: 2020</p>
											</div>
											<div className="flex justify-between">
												<p className="text-sm">Type 2 Diabetes</p>
												<p className="text-sm text-gray-600">Diagnosed: 2018</p>
											</div>
										</div>
									</div>
									<div className="p-4 bg-gray-50 rounded-lg">
										<h4 className="font-medium mb-2">Surgeries</h4>
										<div className="space-y-2">
											<div className="flex justify-between">
												<p className="text-sm">Cataract Surgery (Right Eye)</p>
												<p className="text-sm text-gray-600">2022</p>
											</div>
											<div className="flex justify-between">
												<p className="text-sm">Appendectomy</p>
												<p className="text-sm text-gray-600">1985</p>
											</div>
										</div>
									</div>
									<div className="p-4 bg-gray-50 rounded-lg">
										<h4 className="font-medium mb-2">Allergies</h4>
										<div className="space-y-2">
											<div className="flex justify-between">
												<p className="text-sm">Penicillin</p>
												<p className="text-sm text-gray-600">Severe</p>
											</div>
											<div className="flex justify-between">
												<p className="text-sm">Shellfish</p>
												<p className="text-sm text-gray-600">Moderate</p>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

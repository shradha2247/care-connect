'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUserMd, FaCalendarAlt, FaPills, FaChartLine, FaFileMedical, FaBell, FaSearch } from 'react-icons/fa';
import { IoMdPulse } from 'react-icons/io';
import { RiHealthBookLine, RiMessage2Line } from 'react-icons/ri';
import { MdDashboard, MdPeople, MdSettings, MdLogout, MdOutlineWarning } from 'react-icons/md';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getUser, logout } from '@/lib/auth';

const MOCK_PATIENTS = [
	{
		id: 1,
		name: 'Rajesh Kumar',
		age: 72,
		gender: 'Male',
		condition: 'Hypertension, Diabetes',
		lastVisit: '2025-04-25',
		avatar: '/api/placeholder/32/32',
		status: 'stable',
		vitals: { bp: '138/85', temp: '98.6°F', pulse: 78, respRate: 16, oxygenSat: 97 },
		nextAppointment: '2025-05-10',
	},
	{
		id: 2,
		name: 'Priya Sharma',
		age: 68,
		gender: 'Female',
		condition: 'Rheumatoid Arthritis',
		lastVisit: '2025-04-28',
		avatar: '/api/placeholder/32/32',
		status: 'moderate',
		vitals: { bp: '120/78', temp: '99.1°F', pulse: 82, respRate: 18, oxygenSat: 96 },
		nextAppointment: '2025-05-07',
	},
	{
		id: 3,
		name: 'Anand Patel',
		age: 81,
		gender: 'Male',
		condition: 'Congestive Heart Failure',
		lastVisit: '2025-04-20',
		avatar: '/api/placeholder/32/32',
		status: 'critical',
		vitals: { bp: '145/90', temp: '99.8°F', pulse: 92, respRate: 22, oxygenSat: 91 },
		nextAppointment: '2025-05-03',
	},
	{
		id: 4,
		name: 'Sunita Reddy',
		age: 74,
		gender: 'Female',
		condition: 'Osteoporosis, COPD',
		lastVisit: '2025-04-15',
		avatar: '/api/placeholder/32/32',
		status: 'stable',
		vitals: { bp: '126/82', temp: '98.4°F', pulse: 76, respRate: 17, oxygenSat: 95 },
		nextAppointment: '2025-05-12',
	},
	{
		id: 5,
		name: 'Manish Verma',
		age: 78,
		gender: 'Male',
		condition: 'Post-Stroke Rehabilitation',
		lastVisit: '2025-04-22',
		avatar: '/api/placeholder/32/32',
		status: 'improving',
		vitals: { bp: '132/80', temp: '98.9°F', pulse: 74, respRate: 15, oxygenSat: 96 },
		nextAppointment: '2025-05-06',
	},
];

const MOCK_RECENT_ACTIVITIES = [
	{
		id: 1,
		patient: 'Anand Patel',
		action: 'Abnormal vital signs reported',
		time: '35 minutes ago',
		severity: 'high',
	},
	{
		id: 2,
		patient: 'Priya Sharma',
		action: 'Medication adherence issue',
		time: '2 hours ago',
		severity: 'medium',
	},
	{
		id: 3,
		patient: 'Rajesh Kumar',
		action: 'Completed blood glucose log',
		time: '3 hours ago',
		severity: 'low',
	},
	{
		id: 4,
		patient: 'Sunita Reddy',
		action: 'Requested appointment change',
		time: '5 hours ago',
		severity: 'low',
	},
];

const MOCK_APPOINTMENTS = [
	{
		id: 1,
		patient: 'Anand Patel',
		time: '09:30 AM',
		date: 'May 3, 2025',
		type: 'Check-up',
		status: 'upcoming',
	},
	{
		id: 2,
		patient: 'Priya Sharma',
		time: '11:00 AM',
		date: 'May 7, 2025',
		type: 'Follow-up',
		status: 'upcoming',
	},
	{
		id: 3,
		patient: 'Rajesh Kumar',
		time: '02:30 PM',
		date: 'May 10, 2025',
		type: 'Consultation',
		status: 'upcoming',
	},
];

const MOCK_MESSAGES = [
	{
		id: 1,
		from: 'Caregiver (Deepak Singh)',
		patient: 'Anand Patel',
		message: 'Patient experiencing increased shortness of breath today.',
		time: '45 minutes ago',
		read: false,
	},
	{
		id: 2,
		from: 'Caregiver (Meena Gopal)',
		patient: 'Priya Sharma',
		message: 'Patient skipped morning medication due to nausea.',
		time: '2 hours ago',
		read: false,
	},
	{
		id: 3,
		from: 'Lab Results',
		patient: 'Rajesh Kumar',
		message: 'New blood work results available for review.',
		time: '3 hours ago',
		read: true,
	},
];

export default function MedicalDashboard() {
	const [user, setUser] = useState(null);
	const [activeMenu, setActiveMenu] = useState('dashboard');
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredPatients, setFilteredPatients] = useState(MOCK_PATIENTS);
	const router = useRouter();

	useEffect(() => {
		const userData = getUser();

		if (!userData || userData.role !== 'medical') {
			router.push('/login');
			return;
		}

		setUser({
			...userData,
			fullName: 'Dr. Aditya Sharma',
			specialty: 'Geriatric Medicine',
			hospital: 'Sunrise Healthcare Center',
			// avatar: '/api/placeholder/40/40',
		});
	}, [router]);

	useEffect(() => {
		if (searchQuery) {
			setFilteredPatients(MOCK_PATIENTS.filter((patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.condition.toLowerCase().includes(searchQuery.toLowerCase())));
		} else {
			setFilteredPatients(MOCK_PATIENTS);
		}
	}, [searchQuery]);

	const handleLogout = () => {
		logout();
		router.push('/');
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'critical':
				return 'text-red-600 bg-red-100';
			case 'moderate':
				return 'text-orange-600 bg-orange-100';
			case 'stable':
				return 'text-green-600 bg-green-100';
			case 'improving':
				return 'text-blue-600 bg-blue-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getSeverityColor = (severity) => {
		switch (severity) {
			case 'high':
				return 'text-red-600';
			case 'medium':
				return 'text-orange-600';
			case 'low':
				return 'text-green-600';
			default:
				return 'text-gray-600';
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
						{/* <img src={user.avatar} alt="User" className="h-10 w-10 rounded-full" /> */}
						{sidebarOpen && (
							<div className="ml-3">
								<p className="text-white font-semibold">{user.fullName}</p>
								<p className="text-blue-200 text-sm">{user.specialty}</p>
							</div>
						)}
					</motion.div>

					<nav className="space-y-1">
						{[
							{ name: 'Dashboard', icon: <MdDashboard className="w-5 h-5" />, id: 'dashboard' },
							{ name: 'Patients', icon: <MdPeople className="w-5 h-5" />, id: 'patients' },
							{ name: 'Appointments', icon: <FaCalendarAlt className="w-5 h-5" />, id: 'appointments' },
							{ name: 'Medical Records', icon: <RiHealthBookLine className="w-5 h-5" />, id: 'records' },
							// { name: 'Prescriptions', icon: <FaPills className="w-5 h-5" />, id: 'prescriptions' },
							{ name: 'Messages', icon: <RiMessage2Line className="w-5 h-5" />, id: 'messages' },
							// { name: 'Analytics', icon: <FaChartLine className="w-5 h-5" />, id: 'analytics' },
							// { name: 'Settings', icon: <MdSettings className="w-5 h-5" />, id: 'settings' },
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
								? 'Dashboard'
								: activeMenu === 'patients'
								? 'Patient Management'
								: activeMenu === 'appointments'
								? 'Appointment Schedule'
								: activeMenu === 'records'
								? 'Medical Records'
								: activeMenu === 'prescriptions'
								? 'Prescriptions'
								: activeMenu === 'messages'
								? 'Messages'
								: activeMenu === 'analytics'
								? 'Analytics'
								: 'Settings'}
						</h1>
						<div className="flex items-center space-x-4">
							{/* <div className="relative">
								<Button variant="ghost" className="rounded-full p-2">
									<FaBell className="w-5 h-5" />
									<span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
								</Button>
							</div> */}
							<div className="h-6 w-px bg-gray-300"></div>
							<div className="flex items-center">
								<span className="text-sm font-medium text-gray-700 mr-2">{user.fullName}</span>
								{/* <img src={user.avatar} alt="User" className="h-8 w-8 rounded-full" /> */}
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
											<p className="text-sm font-medium text-gray-500">Total Patients</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">24</p>
										</div>
										<div className="p-3 bg-blue-100 rounded-full">
											<FaUserMd className="w-6 h-6 text-blue-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-green-600">+2 this month</p>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">Todays Appointments</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">3</p>
										</div>
										<div className="p-3 bg-indigo-100 rounded-full">
											<FaCalendarAlt className="w-6 h-6 text-indigo-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-blue-600">Next: 10:30 AM</p>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">Critical Patients</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">1</p>
										</div>
										<div className="p-3 bg-red-100 rounded-full">
											<MdOutlineWarning className="w-6 h-6 text-red-600" />
										</div>
									</div>
									<div className="mt-4">
										<Link href="#" className="text-sm font-medium text-red-600">
											Requires attention
										</Link>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">New Messages</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">5</p>
										</div>
										<div className="p-3 bg-purple-100 rounded-full">
											<RiMessage2Line className="w-6 h-6 text-purple-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-purple-600">2 unread</p>
									</div>
								</Card>
							</div>

							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-6">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-semibold text-gray-900">Recent Patient Activity</h2>
											<Button variant="ghost" className="text-blue-600 text-sm">
												View All
											</Button>
										</div>
										<div className="mt-4 space-y-3">
											{MOCK_RECENT_ACTIVITIES.map((activity) => (
												<div key={activity.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
													<div
														className={`w-2 h-2 rounded-full mr-3 ${activity.severity === 'high' ? 'bg-red-500' : activity.severity === 'medium' ? 'bg-orange-500' : 'bg-green-500'}`}
													></div>
													<div className="flex-1">
														<p className="font-medium">{activity.patient}</p>
														<p className={`text-sm ${getSeverityColor(activity.severity)}`}>{activity.action}</p>
													</div>
													<p className="text-sm text-gray-500">{activity.time}</p>
												</div>
											))}
										</div>
									</div>
								</Card>

								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-6">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
											<Button variant="ghost" className="text-blue-600 text-sm">
												View Calendar
											</Button>
										</div>
										<div className="mt-4 space-y-3">
											{MOCK_APPOINTMENTS.map((appointment) => (
												<div key={appointment.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
													<div className="p-2 bg-blue-100 rounded-lg mr-3">
														<FaCalendarAlt className="w-5 h-5 text-blue-600" />
													</div>
													<div className="flex-1">
														<p className="font-medium">{appointment.patient}</p>
														<p className="text-sm text-gray-600">{appointment.type}</p>
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
							</div>

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
												<div className={`p-2 ${message.read ? 'bg-gray-100' : 'bg-blue-100'} rounded-lg mr-3`}>
													<RiMessage2Line className={`w-5 h-5 ${message.read ? 'text-gray-600' : 'text-blue-600'}`} />
												</div>
												<div className="flex-1">
													<div className="flex justify-between">
														<p className="font-medium">{message.from}</p>
														<p className="text-sm text-gray-500">{message.time}</p>
													</div>
													<p className="text-sm text-gray-600">Re: {message.patient}</p>
													<p className="text-sm mt-1">{message.message}</p>
												</div>
												{!message.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
											</div>
										))}
									</div>
								</div>
							</Card>
						</div>
					)}

					{activeMenu === 'patients' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<div className="relative w-96">
									<Input type="text" placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
									<FaSearch className="absolute left-3 top-3 text-gray-400" />
								</div>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">Add New Patient</Button>
							</div>

							<Card className="bg-white shadow-sm overflow-hidden">
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Patient
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Age/Gender
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Condition
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Status
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Last Visit
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Next Appointment
												</th>
												<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{filteredPatients.map((patient) => (
												<tr key={patient.id} className="hover:bg-gray-50">
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															<img className="h-8 w-8 rounded-full" src={patient.avatar} alt="" />
															<div className="ml-4">
																<div className="text-sm font-medium text-gray-900">{patient.name}</div>
															</div>
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">
															{patient.age} / {patient.gender}
														</div>
													</td>
													<td className="px-6 py-4">
														<div className="text-sm text-gray-900">{patient.condition}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
															{patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(patient.lastVisit).toLocaleDateString('en-IN')}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(patient.nextAppointment).toLocaleDateString('en-IN')}</td>
													<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
														<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
															View
														</Button>
														<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
															Edit
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</Card>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Card className="bg-white p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Demographics</h3>
									<div className="space-y-3">
										<div className="flex justify-between">
											<p className="text-sm text-gray-600">Male Patients</p>
											<p className="text-sm font-medium">15 (62.5%)</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-blue-600 h-2 rounded-full" style={{ width: '62.5%' }}></div>
										</div>
										<div className="flex justify-between mt-3">
											<p className="text-sm text-gray-600">Female Patients</p>
											<p className="text-sm font-medium">9 (37.5%)</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-pink-500 h-2 rounded-full" style={{ width: '37.5%' }}></div>
										</div>
									</div>
									<div className="mt-6">
										<h4 className="text-sm font-semibold text-gray-900 mb-3">Age Distribution</h4>
										<div className="space-y-2">
											<div className="flex justify-between">
												<p className="text-sm text-gray-600">65-70 years</p>
												<p className="text-sm font-medium">8 (33%)</p>
											</div>
											<div className="flex justify-between">
												<p className="text-sm text-gray-600">71-80 years</p>
												<p className="text-sm font-medium">10 (42%)</p>
											</div>
											<div className="flex justify-between">
												<p className="text-sm text-gray-600">81+ years</p>
												<p className="text-sm font-medium">6 (25%)</p>
											</div>
										</div>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Common Conditions</h3>
									<div className="space-y-3">
										<div className="flex justify-between">
											<p className="text-sm text-gray-600">Hypertension</p>
											<p className="text-sm font-medium">16 patients</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-red-500 h-2 rounded-full" style={{ width: '66%' }}></div>
										</div>
										<div className="flex justify-between">
											<p className="text-sm text-gray-600">Diabetes</p>
											<p className="text-sm font-medium">12 patients</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
										</div>
										<div className="flex justify-between">
											<p className="text-sm text-gray-600">Arthritis</p>
											<p className="text-sm font-medium">9 patients</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-green-500 h-2 rounded-full" style={{ width: '38%' }}></div>
										</div>
										<div className="flex justify-between">
											<p className="text-sm text-gray-600">Heart Disease</p>
											<p className="text-sm font-medium">7 patients</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-purple-500 h-2 rounded-full" style={{ width: '29%' }}></div>
										</div>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Status Overview</h3>
									<div className="space-y-3">
										<div className="flex justify-between">
											<p className="text-sm text-gray-600">Stable</p>
											<p className="text-sm font-medium">15 patients</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-green-500 h-2 rounded-full" style={{ width: '62.5%' }}></div>
										</div>
										<div className="flex justify-between">
											<p className="text-sm text-gray-600">Moderate</p>
											<p className="text-sm font-medium">5 patients</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-orange-500 h-2 rounded-full" style={{ width: '20.8%' }}></div>
										</div>
										<div className="flex justify-between">
											<p className="text-sm text-gray-600">Critical</p>
											<p className="text-sm font-medium">3 patients</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-red-500 h-2 rounded-full" style={{ width: '12.5%' }}></div>
										</div>
										<div className="flex justify-between">
											<p className="text-sm text-gray-600">Improving</p>
											<p className="text-sm font-medium">1 patient</p>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-blue-500 h-2 rounded-full" style={{ width: '4.2%' }}></div>
										</div>
									</div>
								</Card>
							</div>
						</div>
					)}

					{activeMenu === 'appointments' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<div className="flex space-x-4">
									<Button className="bg-blue-600 hover:bg-blue-700 text-white">Today</Button>
									<Button variant="outline" className="border-gray-300 text-gray-700">
										Week
									</Button>
									<Button variant="outline" className="border-gray-300 text-gray-700">
										Month
									</Button>
								</div>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">Schedule Appointment</Button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
								<Card className="bg-white p-4 shadow-sm col-span-2">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Calendar</h3>
									<div className="flex justify-between items-center mb-4">
										<Button variant="ghost" className="text-gray-500 p-1">
											&lt;
										</Button>
										<h4 className="font-medium">May 2025</h4>
										<Button variant="ghost" className="text-gray-500 p-1">
											&gt;
										</Button>
									</div>
									<div className="grid grid-cols-7 gap-1 text-center mb-2">
										{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
											<div key={i} className="text-xs font-medium text-gray-500">
												{day}
											</div>
										))}
									</div>
									<div className="grid grid-cols-7 gap-1 text-center">
										{[...Array(31)].map((_, i) => {
											const day = i + 1;
											const hasAppointment = [3, 7, 10].includes(day);
											const isToday = day === 2; // Assuming today is May 2
											return (
												<div key={i} className={`p-2 text-sm rounded-full ${isToday ? 'bg-blue-600 text-white' : hasAppointment ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}>
													{day}
												</div>
											);
										})}
									</div>

									<h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Upcoming Appointments</h3>
									<div className="space-y-3">
										{MOCK_APPOINTMENTS.map((appointment) => (
											<Card key={appointment.id} className="p-3 hover:bg-gray-50 shadow-sm">
												<div className="flex items-center">
													<div className="p-2 bg-blue-100 rounded-lg mr-3">
														<FaCalendarAlt className="w-5 h-5 text-blue-600" />
													</div>
													<div className="flex-1">
														<p className="font-medium">{appointment.patient}</p>
														<p className="text-sm text-gray-600">{appointment.type}</p>
													</div>
													<div className="text-right">
														<p className="font-medium">{appointment.date}</p>
														<p className="text-sm text-gray-600">{appointment.time}</p>
													</div>
												</div>
											</Card>
										))}
									</div>
								</Card>

								<Card className="bg-white shadow-sm col-span-5">
									<div className="p-6 border-b">
										<h3 className="text-lg font-semibold text-gray-900">Todays Schedule - May 2, 2025</h3>
									</div>
									<div className="p-6">
										<div className="relative">
											{/* Time markers */}
											<div className="absolute top-0 left-0 w-16 h-full flex flex-col text-right">
												{[9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour) => (
													<div key={hour} className="h-20 text-sm text-gray-500 pt-2 pr-4">
														{hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
													</div>
												))}
											</div>

											{/* Schedule grid */}
											<div className="ml-16 border-l border-gray-200 pl-4">
												{/* Example appointments */}
												<div className="relative h-[720px]">
													{/* 10:00 AM appointment */}
													<div className="absolute top-[60px] left-0 right-4 h-16 bg-blue-100 rounded-lg p-2 border-l-4 border-blue-600" style={{ width: 'calc(100% - 16px)' }}>
														<p className="font-medium text-blue-800">Vimal Mehra</p>
														<p className="text-sm text-blue-600">10:00 AM - 10:30 AM | Routine Checkup</p>
													</div>

													{/* 11:30 AM appointment */}
													<div className="absolute top-[150px] left-0 right-4 h-16 bg-green-100 rounded-lg p-2 border-l-4 border-green-600" style={{ width: 'calc(100% - 16px)' }}>
														<p className="font-medium text-green-800">Sarita Agarwal</p>
														<p className="text-sm text-green-600">11:30 AM - 12:00 PM | Medication Review</p>
													</div>

													{/* 2:00 PM appointment */}
													<div className="absolute top-[300px] left-0 right-4 h-16 bg-purple-100 rounded-lg p-2 border-l-4 border-purple-600" style={{ width: 'calc(100% - 16px)' }}>
														<p className="font-medium text-purple-800">Kiran Nair</p>
														<p className="text-sm text-purple-600">2:00 PM - 2:30 PM | Blood Work Results</p>
													</div>

													{/* Lunch Break */}
													<div className="absolute top-[210px] left-0 right-4 h-12 bg-gray-100 rounded-lg p-2 border-l-4 border-gray-400" style={{ width: 'calc(100% - 16px)' }}>
														<p className="font-medium text-gray-700">Lunch Break</p>
														<p className="text-sm text-gray-500">12:30 PM - 1:30 PM</p>
													</div>

													{/* Time line indicator for current time */}
													<div className="absolute top-[80px] left-[-20px] right-0 flex items-center">
														<div className="w-3 h-3 rounded-full bg-red-500"></div>
														<div className="h-px flex-grow bg-red-500"></div>
														<div className="ml-2 text-xs font-medium text-red-500">Current Time</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Card>
							</div>
						</div>
					)}

					{/* You can add more UI components for other menu items as needed */}
					{activeMenu === 'messages' && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-4 border-b">
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold text-gray-900">Messages</h3>
											<Button variant="ghost" className="text-blue-600 text-sm">
												Mark All Read
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
													<p className="text-sm text-gray-600">Re: {message.patient}</p>
													<p className="text-sm mt-1 text-gray-800 truncate">{message.message}</p>
												</div>
												{!message.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
											</div>
										))}
										{/* Additional messages */}
										<div className="flex p-4 hover:bg-gray-50 cursor-pointer">
											<div className="flex-1">
												<div className="flex justify-between">
													<p className="font-medium">System Notification</p>
													<p className="text-sm text-gray-500">1 day ago</p>
												</div>
												<p className="text-sm text-gray-600">Medical Records Update</p>
												<p className="text-sm mt-1 text-gray-800 truncate">New electronic health records system update available.</p>
											</div>
										</div>
										<div className="flex p-4 hover:bg-gray-50 cursor-pointer">
											<div className="flex-1">
												<div className="flex justify-between">
													<p className="font-medium">Nurse Sneha</p>
													<p className="text-sm text-gray-500">2 days ago</p>
												</div>
												<p className="text-sm text-gray-600">Re: Medication Schedule</p>
												<p className="text-sm mt-1 text-gray-800 truncate">Updated medication schedule for ward patients.</p>
											</div>
										</div>
									</div>
								</Card>

								<Card className="bg-white shadow-sm col-span-2">
									<div className="p-4 border-b flex justify-between items-center">
										<div className="flex items-center">
											<div className="p-2 bg-blue-100 rounded-full mr-3">
												<RiMessage2Line className="w-5 h-5 text-blue-600" />
											</div>
											<div>
												<h3 className="text-lg font-semibold text-gray-900">Caregiver (Deepak Singh)</h3>
												<p className="text-sm text-gray-600">Re: Anand Patel</p>
											</div>
										</div>
										<Button variant="outline" className="border-gray-300 text-gray-700">
											<FaFileMedical className="w-4 h-4 mr-2" />
											View Patient File
										</Button>
									</div>
									<div className="p-6 max-h-[400px] overflow-y-auto">
										<div className="space-y-4">
											<div className="flex">
												<div className="p-2 bg-blue-100 rounded-full mr-3 h-10 w-10 flex items-center justify-center">
													<span className="text-blue-600 font-bold">DS</span>
												</div>
												<div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
													<p className="text-sm text-gray-900">
														Good morning Dr. Sharma. Mr. Anand has been experiencing increased shortness of breath today, especially when walking to the bathroom.
													</p>
													<p className="text-xs text-gray-500 mt-1">45 minutes ago</p>
												</div>
											</div>

											<div className="flex justify-end">
												<div className="bg-blue-600 rounded-lg p-3 max-w-[80%] text-white">
													<p className="text-sm">Thank you for letting me know, Deepak. Has he taken his morning medications as prescribed?</p>
													<p className="text-xs text-blue-200 mt-1">40 minutes ago</p>
												</div>
												<div className="p-2 bg-blue-700 rounded-full ml-3 h-10 w-10 flex items-center justify-center">
													<span className="text-white font-bold">AS</span>
												</div>
											</div>

											<div className="flex">
												<div className="p-2 bg-blue-100 rounded-full mr-3 h-10 w-10 flex items-center justify-center">
													<span className="text-blue-600 font-bold">DS</span>
												</div>
												<div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
													<p className="text-sm text-gray-900">Yes, he took all his medications at 8 AM. His oxygen saturation is currently 91%, down from 93% yesterday.</p>
													<p className="text-xs text-gray-500 mt-1">35 minutes ago</p>
												</div>
											</div>

											<div className="flex justify-end">
												<div className="bg-blue-600 rounded-lg p-3 max-w-[80%] text-white">
													<p className="text-sm">
														Ill come by to examine him today. In the meantime, please ensure he stays seated when resting, and use the supplemental oxygen as needed. Monitor and record
														his oxygen levels every hour.
													</p>
													<p className="text-xs text-blue-200 mt-1">30 minutes ago</p>
												</div>
												<div className="p-2 bg-blue-700 rounded-full ml-3 h-10 w-10 flex items-center justify-center">
													<span className="text-white font-bold">AS</span>
												</div>
											</div>

											<div className="flex">
												<div className="p-2 bg-blue-100 rounded-full mr-3 h-10 w-10 flex items-center justify-center">
													<span className="text-blue-600 font-bold">DS</span>
												</div>
												<div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
													<p className="text-sm text-gray-900">Will do, doctor. Ive already started the supplemental oxygen at 2L. What time do you expect to visit?</p>
													<p className="text-xs text-gray-500 mt-1">25 minutes ago</p>
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

					{activeMenu === 'records' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<div className="relative w-96">
									<Input type="text" placeholder="Search medical records..." className="pl-10" />
									<FaSearch className="absolute left-3 top-3 text-gray-400" />
								</div>
								<div className="flex space-x-2">
									<Button variant="outline" className="border-gray-300 text-gray-700">
										<FaFileMedical className="w-4 h-4 mr-2" />
										Import Records
									</Button>
									<Button className="bg-blue-600 hover:bg-blue-700 text-white">Create New Record</Button>
								</div>
							</div>

							<Card className="bg-white shadow-sm overflow-hidden">
								<div className="px-6 py-4 border-b">
									<h3 className="text-lg font-semibold text-gray-900">Patient Medical Records</h3>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Patient
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Record Type
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Date Created
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Last Updated
												</th>
												<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Created By
												</th>
												<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{MOCK_PATIENTS.slice(0, 3).map((patient) => (
												<tr key={`record-${patient.id}`} className="hover:bg-gray-50">
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															{/* <img className="h-8 w-8 rounded-full" src={patient.avatar} alt="" /> */}
															<div className="ml-4">
																<div className="text-sm font-medium text-gray-900">{patient.name}</div>
															</div>
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">Medical History</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(patient.lastVisit).toLocaleDateString('en-IN')}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date().toLocaleDateString('en-IN')}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dr. Aditya Sharma</td>
													<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
														<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
															View
														</Button>
														<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
															Edit
														</Button>
													</td>
												</tr>
											))}
											{MOCK_PATIENTS.slice(0, 2).map((patient, idx) => (
												<tr key={`lab-${patient.id}-${idx}`} className="hover:bg-gray-50">
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															{/* <img className="h-8 w-8 rounded-full" src={patient.avatar} alt="" /> */}
															<div className="ml-4">
																<div className="text-sm font-medium text-gray-900">{patient.name}</div>
															</div>
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">Lab Results</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(patient.lastVisit).toLocaleDateString('en-IN')}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(patient.lastVisit).toLocaleDateString('en-IN')}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sunrise Labs</td>
													<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
														<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
															View
														</Button>
														<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
															Download
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</Card>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

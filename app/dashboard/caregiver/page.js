'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaPills, FaSearch, FaUserAlt, FaCheckCircle, FaBell } from 'react-icons/fa';
import { IoMdPulse } from 'react-icons/io';
import { RiMessage2Line } from 'react-icons/ri';
import { MdDashboard, MdLogout } from 'react-icons/md';
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
		status: 'stable',
		lastChecked: '2 hours ago',
		nextMedication: 'Lisinopril - 12:00 PM',
		avatar: '/api/placeholder/32/32',
	},
	{
		id: 2,
		name: 'Priya Sharma',
		age: 68,
		gender: 'Female',
		condition: 'Rheumatoid Arthritis',
		status: 'moderate',
		lastChecked: '1 hour ago',
		nextMedication: 'Methotrexate - 2:00 PM',
		avatar: '/api/placeholder/32/32',
	},
	{
		id: 3,
		name: 'Anand Patel',
		age: 81,
		gender: 'Male',
		condition: 'Congestive Heart Failure',
		status: 'critical',
		lastChecked: '30 minutes ago',
		nextMedication: 'Furosemide - 11:30 AM',
		avatar: '/api/placeholder/32/32',
	},
];

const MOCK_TASKS = [
	{
		id: 1,
		patient: 'Rajesh Kumar',
		task: 'Administer morning medication',
		time: '8:00 AM',
		status: 'completed',
		notes: 'All medications taken with breakfast',
	},
	{
		id: 2,
		patient: 'Anand Patel',
		task: 'Check blood pressure',
		time: '10:00 AM',
		status: 'completed',
		notes: 'BP: 145/90, slightly elevated',
	},
	{
		id: 3,
		patient: 'Priya Sharma',
		task: 'Assist with physical therapy exercises',
		time: '11:00 AM',
		status: 'completed',
		notes: 'Completed all exercises, patient reported less pain today',
	},
	{
		id: 4,
		patient: 'Rajesh Kumar',
		task: 'Administer afternoon medication',
		time: '12:00 PM',
		status: 'pending',
		notes: '',
	},
	{
		id: 5,
		patient: 'Anand Patel',
		task: 'Administer medication',
		time: '11:30 AM',
		status: 'pending',
		notes: '',
	},
	{
		id: 6,
		patient: 'Priya Sharma',
		task: 'Administer medication',
		time: '2:00 PM',
		status: 'pending',
		notes: '',
	},
	{
		id: 7,
		patient: 'All Patients',
		task: 'Prepare and serve lunch',
		time: '1:00 PM',
		status: 'pending',
		notes: '',
	},
];

const MOCK_MESSAGES = [
	{
		id: 1,
		from: 'Dr. Aditya Sharma',
		regarding: 'Rajesh Kumar',
		message: 'Please monitor blood pressure closely today. If above 150/95, contact me immediately.',
		time: '1 hour ago',
		read: false,
	},
	{
		id: 2,
		from: 'Dr. Priya Mehta',
		regarding: 'Anand Patel',
		message: 'Increased his Furosemide dosage. Watch for increased urination and possible dizziness.',
		time: '3 hours ago',
		read: true,
	},
	{
		id: 3,
		from: 'Sunil Kumar (Family)',
		regarding: 'Rajesh Kumar',
		message: 'Will visit this evening around 6 PM. Please have father ready.',
		time: 'Yesterday',
		read: true,
	},
];

export default function CaregiverDashboard() {
	const [user, setUser] = useState(null);
	const [activeMenu, setActiveMenu] = useState('dashboard');
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [completedTasks, setCompletedTasks] = useState(3);
	const [pendingTasks, setPendingTasks] = useState(4);
	const router = useRouter();

	useEffect(() => {
		const userData = getUser();

		if (!userData || userData.role !== 'caregiver') {
			router.push('/login');
			return;
		}

		setUser({
			...userData,
			fullName: 'Deepak Singh',
			position: 'Home Care Assistant',
			shift: 'Day Shift (8 AM - 6 PM)',
		});
	}, [router]);

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
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const getTaskStatusColor = (status) => {
		switch (status) {
			case 'completed':
				return 'text-green-600 bg-green-100';
			case 'pending':
				return 'text-blue-600 bg-blue-100';
			case 'overdue':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	const markTaskComplete = (taskId) => {
		// In a real app, this would update the task in the database
		setCompletedTasks(completedTasks + 1);
		setPendingTasks(pendingTasks - 1);
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
							<p className="text-blue-200 text-sm">Caregiver</p>
						</div>
					</motion.div>

					<nav className="space-y-1">
						{[
							{ name: 'Dashboard', icon: <MdDashboard className="w-5 h-5" />, id: 'dashboard' },
							{ name: 'Care Tasks', icon: <FaCheckCircle className="w-5 h-5" />, id: 'tasks' },
							{ name: 'Messages', icon: <RiMessage2Line className="w-5 h-5" />, id: 'messages' },
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
						<h1 className="text-2xl font-bold text-gray-900">{activeMenu === 'dashboard' ? 'Caregiver Dashboard' : activeMenu === 'tasks' ? 'Care Tasks' : 'Messages'}</h1>
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
											<p className="text-sm font-medium text-gray-500">Assigned Patients</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">{MOCK_PATIENTS.length}</p>
										</div>
										<div className="p-3 bg-blue-100 rounded-full">
											<FaUserAlt className="w-6 h-6 text-blue-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-blue-600">1 requires special attention</p>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">Todays Tasks</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">{completedTasks + pendingTasks}</p>
										</div>
										<div className="p-3 bg-green-100 rounded-full">
											<FaCheckCircle className="w-6 h-6 text-green-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-green-600">
											{completedTasks} completed, {pendingTasks} pending
										</p>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">Medications Today</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">12</p>
										</div>
										<div className="p-3 bg-purple-100 rounded-full">
											<FaPills className="w-6 h-6 text-purple-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-purple-600">5 administered, 7 remaining</p>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm font-medium text-gray-500">New Messages</p>
											<p className="text-3xl font-bold text-gray-900 mt-1">1</p>
										</div>
										<div className="p-3 bg-indigo-100 rounded-full">
											<RiMessage2Line className="w-6 h-6 text-indigo-600" />
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm font-medium text-indigo-600">From Dr. Aditya Sharma</p>
									</div>
								</Card>
							</div>

							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-6">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-semibold text-gray-900">Patient Status</h2>
											<Button variant="ghost" className="text-blue-600 text-sm">
												View All
											</Button>
										</div>
										<div className="mt-4 space-y-3">
											{MOCK_PATIENTS.map((patient) => (
												<div key={patient.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
													<div className="flex-shrink-0">
														<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
															{patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
														</span>
													</div>
													<div className="ml-4 flex-1">
														<div className="text-sm font-medium text-gray-900">{patient.name}</div>
														<div className="text-sm text-gray-500">{patient.condition}</div>
													</div>
													<div className="ml-2">
														<div className="text-sm text-gray-500">Last checked: {patient.lastChecked}</div>
														<div className="text-sm text-gray-900">Next: {patient.nextMedication}</div>
													</div>
													<Button variant="ghost" className="ml-4 text-blue-600 hover:text-blue-800">
														Check
													</Button>
												</div>
											))}
										</div>
									</div>
								</Card>

								<Card className="bg-white shadow-sm overflow-hidden">
									<div className="p-6">
										<div className="flex items-center justify-between">
											<h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
											<Button variant="ghost" className="text-blue-600 text-sm">
												View All
											</Button>
										</div>
										<div className="mt-4 space-y-3">
											{MOCK_TASKS.filter((task) => task.status === 'pending')
												.slice(0, 4)
												.map((task) => (
													<div key={task.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
														<div className="p-2 bg-blue-100 rounded-lg mr-3">
															<FaCalendarAlt className="w-5 h-5 text-blue-600" />
														</div>
														<div className="flex-1">
															<p className="font-medium">{task.task}</p>
															<p className="text-sm text-gray-600">
																{task.patient} - {task.time}
															</p>
														</div>
														<Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => markTaskComplete(task.id)}>
															Complete
														</Button>
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
												<div className={`p-2 ${message.read ? 'bg-gray-100' : 'bg-indigo-100'} rounded-lg mr-3`}>
													<RiMessage2Line className={`w-5 h-5 ${message.read ? 'text-gray-600' : 'text-indigo-600'}`} />
												</div>
												<div className="flex-1">
													<div className="flex justify-between">
														<p className="font-medium">{message.from}</p>
														<p className="text-sm text-gray-500">{message.time}</p>
													</div>
													<p className="text-sm text-gray-600">Re: {message.regarding}</p>
													<p className="text-sm mt-1">{message.message}</p>
												</div>
												{!message.read && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>}
											</div>
										))}
									</div>
								</div>
							</Card>
						</div>
					)}

					{activeMenu === 'tasks' && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<div className="flex space-x-4">
									<Button className="bg-blue-600 hover:bg-blue-700 text-white">Today</Button>
									<Button variant="outline" className="border-gray-300 text-gray-700">
										Tomorrow
									</Button>
									<Button variant="outline" className="border-gray-300 text-gray-700">
										This Week
									</Button>
								</div>
								<Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Task</Button>
							</div>

							<Card className="bg-white shadow-sm overflow-hidden">
								<div className="p-6">
									<h2 className="text-lg font-semibold text-gray-900 mb-4">Todays Care Tasks</h2>
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Task
													</th>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Patient
													</th>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Time
													</th>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Status
													</th>
													<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Notes
													</th>
													<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
														Actions
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{MOCK_TASKS.map((task) => (
													<tr key={task.id} className="hover:bg-gray-50">
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm font-medium text-gray-900">{task.task}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">{task.patient}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-900">{task.time}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
																{task.status.charAt(0).toUpperCase() + task.status.slice(1)}
															</span>
														</td>
														<td className="px-6 py-4">
															<div className="text-sm text-gray-900">{task.notes || '-'}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
															{task.status === 'pending' ? (
																<Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => markTaskComplete(task.id)}>
																	Complete
																</Button>
															) : (
																<Button variant="ghost" className="text-blue-600 hover:text-blue-800">
																	View Details
																</Button>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</Card>

							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								<Card className="bg-white p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Summary</h3>
									<div className="space-y-4">
										<div>
											<div className="flex justify-between items-center mb-1">
												<span className="text-sm font-medium text-gray-700">Todays Progress</span>
												<span className="text-sm font-medium text-gray-700">
													{completedTasks} of {completedTasks + pendingTasks} tasks
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2.5">
												<div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(completedTasks / (completedTasks + pendingTasks)) * 100}%` }}></div>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
												<h4 className="font-medium text-green-800 mb-2">Completed Tasks</h4>
												<p className="text-3xl font-bold text-green-600">{completedTasks}</p>
											</div>
											<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
												<h4 className="font-medium text-blue-800 mb-2">Pending Tasks</h4>
												<p className="text-3xl font-bold text-blue-600">{pendingTasks}</p>
											</div>
										</div>
									</div>
								</Card>

								<Card className="bg-white p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Medication Schedule</h3>
									<div className="space-y-3">
										<div className="p-3 bg-gray-50 rounded-lg">
											<div className="flex justify-between items-center">
												<div>
													<p className="font-medium">Rajesh Kumar</p>
													<p className="text-sm text-gray-600">Lisinopril 10mg - 12:00 PM</p>
												</div>
												<Button className="bg-blue-600 hover:bg-blue-700 text-white">Administer</Button>
											</div>
										</div>
										<div className="p-3 bg-gray-50 rounded-lg">
											<div className="flex justify-between items-center">
												<div>
													<p className="font-medium">Anand Patel</p>
													<p className="text-sm text-gray-600">Furosemide 20mg - 11:30 AM</p>
												</div>
												<Button className="bg-blue-600 hover:bg-blue-700 text-white">Administer</Button>
											</div>
										</div>
										<div className="p-3 bg-gray-50 rounded-lg">
											<div className="flex justify-between items-center">
												<div>
													<p className="font-medium">Priya Sharma</p>
													<p className="text-sm text-gray-600">Methotrexate 15mg - 2:00 PM</p>
												</div>
												<Button className="bg-blue-600 hover:bg-blue-700 text-white">Administer</Button>
											</div>
										</div>
									</div>
								</Card>
							</div>
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
													<p className="text-sm text-gray-600">Re: {message.regarding}</p>
													<p className="text-sm mt-1 truncate">{message.message}</p>
												</div>
												{!message.read && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>}
											</div>
										))}
									</div>
								</Card>

								<Card className="bg-white shadow-sm col-span-2">
									<div className="p-4 border-b flex justify-between items-center">
										<div className="flex items-center">
											<div className="p-2 bg-blue-100 rounded-full mr-3">
												<FaUserAlt className="w-5 h-5 text-blue-600" />
											</div>
											<div>
												<h3 className="text-lg font-semibold text-gray-900">Dr. Aditya Sharma</h3>
												<p className="text-sm text-gray-600">Re: Rajesh Kumar</p>
											</div>
										</div>
										<Button variant="outline" className="border-gray-300 text-gray-700">
											View Patient
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
														Hello Deepak, please monitor Rajeshs blood pressure closely today. His readings were elevated during his last visit. If it goes above 150/95, please contact
														me immediately.
													</p>
													<p className="text-xs text-gray-500 mt-1">1 hour ago</p>
												</div>
											</div>

											<div className="flex justify-end">
												<div className="bg-blue-600 rounded-lg p-3 max-w-[80%] text-white">
													<p className="text-sm">
														Ill keep a close eye on it, Doctor. I just checked his BP about 30 minutes ago and it was 145/90. Ill monitor it again in an hour and let you know if there
														are any changes.
													</p>
													<p className="text-xs text-blue-200 mt-1">45 minutes ago</p>
												</div>
												<div className="p-2 bg-blue-700 rounded-full ml-3 h-10 w-10 flex items-center justify-center">
													<span className="text-white font-bold">DS</span>
												</div>
											</div>

											<div className="flex">
												<div className="p-2 bg-blue-100 rounded-full mr-3 h-10 w-10 flex items-center justify-center">
													<span className="text-blue-600 font-bold">AS</span>
												</div>
												<div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
													<p className="text-sm text-gray-900">
														Thank you. Also make sure he takes his Lisinopril with lunch. He sometimes tries to skip it, but its important he stays on schedule.
													</p>
													<p className="text-xs text-gray-500 mt-1">30 minutes ago</p>
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
				</main>
			</div>
		</div>
	);
}

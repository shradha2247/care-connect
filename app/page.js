'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FaUserMd, FaHandHoldingHeart, FaUserAlt } from 'react-icons/fa';
import { HiChevronDown } from 'react-icons/hi';
import { FiArrowRight } from 'react-icons/fi';
import { IoMdPulse } from 'react-icons/io';
import { AiOutlineSchedule, AiOutlineMessage, AiOutlineMedicineBox } from 'react-icons/ai';

// Animated gradient background component
const AnimatedBackground = () => {
	return (
		<div className="absolute inset-0 -z-10 overflow-hidden">
			<div className="absolute top-0 -left-[10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full filter blur-3xl animate-blob"></div>
			<div className="absolute bottom-0 -right-[10%] w-[40%] h-[40%] bg-cyan-200/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
			<div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-200/30 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
		</div>
	);
};

// Feature card component with animation
const FeatureCard = ({ icon, title, description, color, delay }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay }}
			whileHover={{ scale: 1.03 }}
			className={`bg-white p-8 rounded-xl shadow-lg border-b-4 ${color} transition-all duration-300`}
		>
			<div className={`w-16 h-16 mb-6 rounded-full flex items-center justify-center ${color.replace('border', 'bg').replace('-600', '-100')} text-${color.replace('border-', '')}`}>{icon}</div>
			<h2 className={`text-xl font-bold mb-3 ${color.replace('border', 'text')}`}>{title}</h2>
			<p className="text-gray-600 leading-relaxed">{description}</p>
			<div className="mt-6 flex items-center text-sm font-medium">
				<span className={color.replace('border', 'text')}>Learn more</span>
				<FiArrowRight className={`ml-2 ${color.replace('border', 'text')}`} />
			</div>
		</motion.div>
	);
};

// Statistic item component
const StatItem = ({ value, label, delay }) => {
	return (
		<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay }} className="flex flex-col items-center">
			<span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">{value}</span>
			<span className="text-gray-500 mt-2 text-sm md:text-base">{label}</span>
		</motion.div>
	);
};

// Nav component
const Nav = () => {
	return (
		<motion.nav
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="w-full py-5 px-4 md:px-8 flex justify-between items-center fixed top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm"
		>
			<div className="flex items-center">
				<IoMdPulse className="text-3xl text-blue-600 mr-2" />
				<span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">HealthConnect</span>
			</div>
			<div className="hidden md:flex items-center space-x-8">
				<Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
					Features
				</Link>
				<Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
					How it Works
				</Link>
				{/* <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
					Testimonials
				</Link> */}
			</div>
			<div>
				<Link href="/login">
					<Button variant="outline" className="mr-2 hidden md:inline-flex">
						Sign In
					</Button>
				</Link>
				<Link href="/login">
					<Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">Get Started</Button>
				</Link>
			</div>
		</motion.nav>
	);
};

export default function Home() {
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className="relative">
			<style jsx global>{`
				@keyframes blob {
					0%,
					100% {
						transform: translate(0, 0) scale(1);
					}
					25% {
						transform: translate(20px, -50px) scale(1.1);
					}
					50% {
						transform: translate(0, 20px) scale(0.9);
					}
					75% {
						transform: translate(-20px, -15px) scale(1.05);
					}
				}
				.animate-blob {
					animation: blob 20s infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
				.animation-delay-4000 {
					animation-delay: 4s;
				}
			`}</style>

			<AnimatedBackground />
			<Nav />

			{/* Hero Section */}
			<div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center justify-center relative overflow-hidden">
				<div className="max-w-5xl w-full px-4 text-center z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="inline-block px-4 py-1 mb-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
					>
						Elderly Healthcare Simplified
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600"
					>
						Care beyond boundaries,
						<br />
						connected healthcare for all
					</motion.h1>

					<motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
						HealthConnect bridges the gap between elderly patients, caregivers, and medical professionals, providing seamless coordination for better health outcomes.
					</motion.p>

					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
						<Link href="/login">
							<Button
								size="lg"
								className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-8 py-6 rounded-lg text-lg shadow-lg shadow-blue-500/30 group transition-all"
							>
								Access Your Dashboard
								<motion.span initial={{ x: 0 }} animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}>
									<FiArrowRight className="ml-2 inline-block" />
								</motion.span>
							</Button>
						</Link>
						<Button variant="outline" size="lg" className="px-8 py-6 text-lg border-blue-300 text-blue-700 hover:bg-blue-50">
							Watch Demo
						</Button>
					</motion.div>

					{/* Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mb-12">
						<StatItem value="95%" label="User Satisfaction" delay={0.4} />
						<StatItem value="1000+" label="Active Users" delay={0.5} />
						<StatItem value="24/7" label="Care Support" delay={0.6} />
						<StatItem value="50+" label="Healthcare Partners" delay={0.7} />
					</div>

					{/* Scroll indicator */}
					<motion.div
						animate={{
							y: [0, 10, 0],
							opacity: scrollY > 100 ? 0 : 1,
						}}
						transition={{
							y: { repeat: Infinity, duration: 1.5 },
							opacity: { duration: 0.3 },
						}}
						className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-blue-600"
					>
						<HiChevronDown className="w-8 h-8" />
					</motion.div>
				</div>
			</div>

			{/* Features Section */}
			<div id="features" className="py-24 px-4 bg-white">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="text-3xl md:text-4xl font-bold mb-4"
						>
							Tailored for <span className="text-blue-600">Everyone</span> in the Care Circle
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="text-xl text-gray-600 max-w-3xl mx-auto"
						>
							Our platform provides specialized features for each role, ensuring seamless coordination in elderly care.
						</motion.p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<FeatureCard
							icon={<FaUserMd className="w-8 h-8" />}
							title="For Medical Professionals"
							description="Access comprehensive patient health data, monitor vital trends, manage treatment plans, and collaborate with caregivers through our secure platform."
							color="border-blue-600"
							delay={0.2}
						/>
						<FeatureCard
							icon={<FaHandHoldingHeart className="w-8 h-8" />}
							title="For Caregivers"
							description="Easily track care tasks, manage medication schedules, document patient observations, and maintain clear communication with the medical team."
							color="border-green-600"
							delay={0.3}
						/>
						<FeatureCard
							icon={<FaUserAlt className="w-8 h-8" />}
							title="For Patients"
							description="Monitor your health metrics, maintain medication adherence, track appointments, and stay connected with your entire care team in one place."
							color="border-indigo-600"
							delay={0.4}
						/>
					</div>
				</div>
			</div>

			{/* How It Works Section */}
			<div id="how-it-works" className="py-24 px-4 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="text-3xl md:text-4xl font-bold mb-4"
						>
							How <span className="text-blue-600">HealthConnect</span> Works
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="text-xl text-gray-600 max-w-3xl mx-auto"
						>
							A seamless experience that connects all aspects of elderly healthcare
						</motion.p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								icon: <AiOutlineSchedule className="w-8 h-8" />,
								title: 'Schedule & Plan',
								description: 'Set up appointments, care schedules, and medication reminders all in one place.',
								delay: 0.2,
								color: 'bg-blue-100 text-blue-600',
							},
							{
								icon: <AiOutlineMedicineBox className="w-8 h-8" />,
								title: 'Monitor Health',
								description: 'Track vital signs, medication adherence, and health trends over time.',
								delay: 0.3,
								color: 'bg-green-100 text-green-600',
							},
							{
								icon: <AiOutlineMessage className="w-8 h-8" />,
								title: 'Communicate',
								description: 'Secure messaging between patients, caregivers and medical professionals.',
								delay: 0.4,
								color: 'bg-indigo-100 text-indigo-600',
							},
							{
								icon: <IoMdPulse className="w-8 h-8" />,
								title: 'Improve Outcomes',
								description: 'Better coordination leads to improved health outcomes and quality of life.',
								delay: 0.5,
								color: 'bg-purple-100 text-purple-600',
							},
						].map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: item.delay }}
								className="flex flex-col items-center text-center"
							>
								<div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${item.color}`}>{item.icon}</div>
								<h3 className="text-xl font-bold mb-2">{item.title}</h3>
								<p className="text-gray-600">{item.description}</p>
								{index < 3 && <div className="hidden lg:block w-24 h-0.5 bg-blue-200 absolute right-[-12px] top-[35%] transform translate-y-1/2"></div>}
							</motion.div>
						))}
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="py-24 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
				<div className="max-w-5xl mx-auto text-center">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-3xl md:text-4xl font-bold mb-6 text-white"
					>
						Ready to transform elderly healthcare?
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto"
					>
						Join thousands of healthcare providers, caregivers, and patients who are already experiencing the benefits of connected care.
					</motion.p>
					<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
						<Link href="/login">
							<Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-8 py-6 rounded-lg text-lg">
								Get Started Today
							</Button>
						</Link>
					</motion.div>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-gray-900 text-gray-300 py-12 px-4">
				<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center mb-4">
							<IoMdPulse className="text-2xl text-blue-400 mr-2" />
							<span className="font-bold text-xl text-white">HealthConnect</span>
						</div>
						<p className="text-gray-400 mb-4">Connecting elderly patients with caregivers and medical professionals for better healthcare outcomes.</p>
						<div className="flex space-x-4">{/* Social media icons would go here */}</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
						<ul className="space-y-2">
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									Features
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									How It Works
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									Pricing
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
						<ul className="space-y-2">
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									About Us
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									Careers
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									Blog
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									Contact
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
						<ul className="space-y-2">
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									HIPAA Compliance
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-blue-400 transition-colors">
									Accessibility
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
					<p>&copy; {new Date().getFullYear()} HealthConnect. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri);

async function seedUsers() {
	try {
		await client.connect();
		console.log('Connected to MongoDB');

		const db = client.db('healthConnectDemo');
		const usersCollection = db.collection('users');

		// Clear existing users before seeding
		await usersCollection.deleteMany({});
		console.log('Cleared existing users');

		const users = [
			// Doctors (medical)
			{ username: 'priya.sharma', password: 'doctor01', role: 'medical' },
			{ username: 'alok.gupta', password: 'doctor02', role: 'medical' },
			{ username: 'meera.joshi', password: 'doctor03', role: 'medical' },

			// Caregivers
			{ username: 'rajesh.kumar', password: 'caregiver01', role: 'caregiver' },
			{ username: 'sunita.desai', password: 'caregiver02', role: 'caregiver' },
			{ username: 'amit.patel', password: 'caregiver03', role: 'caregiver' },

			// Patients
			{ username: 'anjali.singh', password: 'patient01', role: 'patient' },
			{ username: 'vikram.yadav', password: 'patient02', role: 'patient' },
			{ username: 'neha.reddy', password: 'patient03', role: 'patient' },
			{ username: 'suresh.menon', password: 'patient04', role: 'patient' },
			{ username: 'pooja.iyer', password: 'patient05', role: 'patient' },
			{ username: 'rahul.verma', password: 'patient06', role: 'patient' },
			{ username: 'geeta.rao', password: 'patient07', role: 'patient' },
			{ username: 'manoj.das', password: 'patient08', role: 'patient' },
			{ username: 'sneha.chatterjee', password: 'patient09', role: 'patient' },
			{ username: 'arjun.pillai', password: 'patient10', role: 'patient' },
			{ username: 'kavita.shah', password: 'patient11', role: 'patient' },
		];

		const result = await usersCollection.insertMany(users);
		console.log(`${result.insertedCount} users inserted`);
	} catch (error) {
		console.error('Error seeding users:', error);
	} finally {
		await client.close();
		console.log('MongoDB connection closed');
	}
}

seedUsers();

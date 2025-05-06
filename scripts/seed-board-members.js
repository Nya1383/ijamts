/**
 * Run this script to seed the boardMembers collection in Firestore.
 * 
 * Usage:
 * node scripts/seed-board-members.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, query } = require('firebase/firestore');

// Firebase config - copy from your lib/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyDw-raVbFjHLGGDMaNuMpTFJ5bG6_DJ80s",
  authDomain: "ijamts.firebaseapp.com",
  projectId: "ijamts",
  storageBucket: "ijamts.firebasestorage.app",
  messagingSenderId: "304504515207",
  appId: "1:304504515207:web:354a14a07c15ba5e3fe622",
  measurementId: "G-KT7G7WGKHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample board members data
const boardMembers = [
  {
    name: "Dr. Jane Smith",
    role: "Editor-in-Chief",
    bio: "Dr. Smith is a Professor of Literature with over 15 years of experience in academic publishing. Her research focuses on comparative literature and modern poetry.",
    order: 1
  },
  {
    name: "Prof. Michael Johnson",
    role: "Associate Editor",
    bio: "Professor Johnson specializes in creative writing and contemporary fiction. He has published numerous articles and books on narrative techniques.",
    order: 2
  },
  {
    name: "Dr. Sarah Williams",
    role: "Managing Editor",
    bio: "Dr. Williams has expertise in digital humanities and publishing technologies. She oversees the journal's publication process and digital presence.",
    order: 3
  },
  {
    name: "Prof. David Chen",
    role: "Review Editor",
    bio: "Professor Chen's background is in literary criticism and theory. He coordinates the peer review process for all submissions.",
    order: 4
  },
  {
    name: "Dr. Amina Patel",
    role: "Board Member",
    bio: "Dr. Patel specializes in world literature and postcolonial studies. She brings a global perspective to the editorial board.",
    order: 5
  },
  {
    name: "Prof. Robert Garcia",
    role: "Board Member",
    bio: "Professor Garcia's research focuses on poetry and literary translation. He has translated numerous works from Spanish to English.",
    order: 6
  },
];

// Function to clear existing data
async function clearCollection() {
  try {
    console.log('Clearing existing board members...');
    const q = query(collection(db, 'boardMembers'));
    const snapshot = await getDocs(q);
    
    const deletePromises = [];
    snapshot.forEach(doc => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    console.log(`Deleted ${deletePromises.length} existing board members`);
  } catch (error) {
    console.error('Error clearing collection:', error);
  }
}

// Function to seed the data
async function seedBoardMembers() {
  try {
    // First clear existing data
    await clearCollection();
    
    console.log('Adding new board members...');
    const addPromises = boardMembers.map(member => 
      addDoc(collection(db, 'boardMembers'), {
        ...member,
        timestamp: new Date()
      })
    );
    
    const results = await Promise.all(addPromises);
    console.log(`Successfully added ${results.length} board members`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedBoardMembers(); 
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
    name: "Dr. Sushma Karnati",
    role: "Chief Editor",
    bio: "Chief Editor of International Journal of Advances in Management, Technology and Science (IJAMTS). Dr. Karnati brings extensive leadership and editorial expertise to guide the journal's academic excellence.",
    order: 0
  },
  {
    name: "Dr. M.V. Ramana Murthy",
    role: "Associate Editor",
    bio: "M.Sc., Ph.D., Rtd. Professor, Department of Mathematics, Osmania University. Dr. Murthy brings extensive experience in mathematical research and academic publishing to the editorial board.",
    order: 1
  },
  {
    name: "Prof. Dr S Jeelan",
    role: "Associate Editor", 
    bio: "Professor in Management, Director, CDVL at Central University. Prof. Jeelan specializes in management studies and brings valuable expertise in leadership and academic administration.",
    order: 2
  },
  {
    name: "Dr Siva Shankar Ramasamy",
    role: "Reviewer",
    bio: "Professor, International College of Digital Innovation, Chiang Mai University, 239, Nimmanahaemin Road, Suthep, Muang, Chiang Mai-50200, Thailand.",
    order: 3
  },
  {
    name: "Dr. Giri Ramadoss",
    role: "Reviewer",
    bio: "Professor, School of computing and information Sciences, University of Technology and Applied Sciences, Muscat, Sultanate of Oman. Email: doss.girish@gmail.com",
    order: 4
  },
  {
    name: "Dr. G Vidya Sagar Rao",
    role: "Reviewer",
    bio: "Assistant Professor, Department of Management, Osmania University, Hyderabad.",
    order: 5
  },
  {
    name: "Dr Sudhir Ranjan Pattanaik",
    role: "Reviewer",
    bio: "Professor, Department of Computer Science and Engineering, Berhampur, Odisha - 761008. Email: sudhir.pattanaik@nist.edu",
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
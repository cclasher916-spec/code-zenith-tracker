// Script to seed departments and sections into Firestore
// Run this once to populate your database with MVIT departments

import { db } from '../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

interface Department {
    name: string;
    code: string;
    type: 'UG' | 'PG';
}

interface Section {
    name: string;
    code: string;
    department_code: string;
}

const departments: Department[] = [
    // UG Programs
    { name: 'Artificial Intelligence and Data Science', code: 'AI&DS', type: 'UG' },
    { name: 'Artificial Intelligence and Machine Learning', code: 'AI&ML', type: 'UG' },
    { name: 'Computer Science and Engineering', code: 'CSE', type: 'UG' },
    { name: 'Computer Science and Engineering (Cyber Security)', code: 'CSE-CS', type: 'UG' },
    { name: 'Electronics and Communication Engineering', code: 'ECE', type: 'UG' },
    { name: 'Electrical and Electronics Engineering', code: 'EEE', type: 'UG' },
    { name: 'Mechanical Engineering', code: 'MECH', type: 'UG' },
    { name: 'Civil Engineering', code: 'CIVIL', type: 'UG' },
    { name: 'Information Technology', code: 'IT', type: 'UG' },

    // PG Programs
    { name: 'M.Tech - Computer Science and Engineering', code: 'MTECH-CSE', type: 'PG' },
    { name: 'M.Tech - VLSI Design', code: 'MTECH-VLSI', type: 'PG' },
    { name: 'MBA', code: 'MBA', type: 'PG' },
];

// Sections for each department (A, B, C, etc.)
const sections: Section[] = [
    // AI&DS Sections
    { name: 'AI&DS - A', code: 'A', department_code: 'AI&DS' },
    { name: 'AI&DS - B', code: 'B', department_code: 'AI&DS' },

    // AI&ML Sections
    { name: 'AI&ML - A', code: 'A', department_code: 'AI&ML' },
    { name: 'AI&ML - B', code: 'B', department_code: 'AI&ML' },

    // CSE Sections
    { name: 'CSE - A', code: 'A', department_code: 'CSE' },
    { name: 'CSE - B', code: 'B', department_code: 'CSE' },
    { name: 'CSE - C', code: 'C', department_code: 'CSE' },

    // CSE-CS Sections
    { name: 'CSE-CS - A', code: 'A', department_code: 'CSE-CS' },

    // ECE Sections
    { name: 'ECE - A', code: 'A', department_code: 'ECE' },
    { name: 'ECE - B', code: 'B', department_code: 'ECE' },

    // EEE Sections
    { name: 'EEE - A', code: 'A', department_code: 'EEE' },

    // MECH Sections
    { name: 'MECH - A', code: 'A', department_code: 'MECH' },
    { name: 'MECH - B', code: 'B', department_code: 'MECH' },

    // CIVIL Sections
    { name: 'CIVIL - A', code: 'A', department_code: 'CIVIL' },

    // IT Sections
    { name: 'IT - A', code: 'A', department_code: 'IT' },
    { name: 'IT - B', code: 'B', department_code: 'IT' },
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Check if departments already exist
        const deptSnapshot = await getDocs(collection(db, 'departments'));
        if (!deptSnapshot.empty) {
            console.log('⚠️  Departments already exist. Skipping seed.');
            console.log(`Found ${deptSnapshot.size} existing departments.`);
            return;
        }

        // Add departments
        console.log('\n📚 Adding departments...');
        const departmentIds: Record<string, string> = {};

        for (const dept of departments) {
            const docRef = await addDoc(collection(db, 'departments'), dept);
            departmentIds[dept.code] = docRef.id;
            console.log(`  ✅ Added: ${dept.name} (${dept.code})`);
        }

        // Add sections with department references
        console.log('\n📋 Adding sections...');
        for (const section of sections) {
            const departmentId = departmentIds[section.department_code];
            if (departmentId) {
                await addDoc(collection(db, 'sections'), {
                    ...section,
                    department_id: departmentId,
                });
                console.log(`  ✅ Added: ${section.name}`);
            }
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log(`   - ${departments.length} departments added`);
        console.log(`   - ${sections.length} sections added`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

// Run the seed function
seedDatabase()
    .then(() => {
        console.log('\n🎉 All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

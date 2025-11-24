import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// MVIT Departments based on official website
export const MVIT_DEPARTMENTS = [
    // UG Programs
    { name: 'Artificial Intelligence and Data Science', code: 'AI&DS', type: 'UG' },
    { name: 'Artificial Intelligence and Machine Learning', code: 'AI&ML', type: 'UG' },
    { name: 'Computer Science and Engineering', code: 'CSE', type: 'UG' },
    { name: 'Computer Science (Cyber Security)', code: 'CSE-CS', type: 'UG' },
    { name: 'Electronics and Communication Engineering', code: 'ECE', type: 'UG' },
    { name: 'Electrical and Electronics Engineering', code: 'EEE', type: 'UG' },
    { name: 'Mechanical Engineering', code: 'MECH', type: 'UG' },
    { name: 'Civil Engineering', code: 'CIVIL', type: 'UG' },
    { name: 'Information Technology', code: 'IT', type: 'UG' },
    { name: 'Robotics and Automation', code: 'RAE', type: 'UG' },
    { name: 'Food Technology', code: 'FT', type: 'UG' },

    // PG Programs
    { name: 'M.Tech - Computer Science and Engineering', code: 'MTECH-CSE', type: 'PG' },
    { name: 'M.Tech - Electronics & Communication', code: 'MTECH-ECE', type: 'PG' },
    { name: 'MBA', code: 'MBA', type: 'PG' },
];

export const MVIT_SECTIONS = [
    // AI&DS
    { name: 'Section A', code: 'A', department_code: 'AI&DS' },
    { name: 'Section B', code: 'B', department_code: 'AI&DS' },

    // AI&ML
    { name: 'Section A', code: 'A', department_code: 'AI&ML' },
    { name: 'Section B', code: 'B', department_code: 'AI&ML' },

    // CSE
    { name: 'Section A', code: 'A', department_code: 'CSE' },
    { name: 'Section B', code: 'B', department_code: 'CSE' },
    { name: 'Section C', code: 'C', department_code: 'CSE' },

    // CSE-CS
    { name: 'Section A', code: 'A', department_code: 'CSE-CS' },

    // ECE
    { name: 'Section A', code: 'A', department_code: 'ECE' },
    { name: 'Section B', code: 'B', department_code: 'ECE' },

    // EEE
    { name: 'Section A', code: 'A', department_code: 'EEE' },

    // MECH
    { name: 'Section A', code: 'A', department_code: 'MECH' },
    { name: 'Section B', code: 'B', department_code: 'MECH' },

    // CIVIL
    { name: 'Section A', code: 'A', department_code: 'CIVIL' },

    // IT
    { name: 'Section A', code: 'A', department_code: 'IT' },
    { name: 'Section B', code: 'B', department_code: 'IT' },

    // RAE
    { name: 'Section A', code: 'A', department_code: 'RAE' },

    // FT
    { name: 'Section A', code: 'A', department_code: 'FT' },
];

export async function seedDepartments() {
    try {
        console.log('🌱 Checking for existing departments...');

        const deptSnapshot = await getDocs(collection(db, 'departments'));
        if (!deptSnapshot.empty) {
            console.log('⚠️  Departments already exist. Skipping seed.');
            return { success: true, message: 'Departments already seeded', count: deptSnapshot.size };
        }

        console.log('📚 Adding departments...');
        const departmentIds: Record<string, string> = {};

        for (const dept of MVIT_DEPARTMENTS) {
            const docRef = await addDoc(collection(db, 'departments'), dept);
            departmentIds[dept.code] = docRef.id;
            console.log(`  ✅ ${dept.name}`);
        }

        console.log('📋 Adding sections...');
        for (const section of MVIT_SECTIONS) {
            const deptId = departmentIds[section.department_code];
            if (deptId) {
                await addDoc(collection(db, 'sections'), {
                    ...section,
                    department_id: deptId,
                });
            }
        }

        console.log('✅ Database seeded successfully!');
        return {
            success: true,
            message: 'Database seeded successfully',
            departments: MVIT_DEPARTMENTS.length,
            sections: MVIT_SECTIONS.length,
        };
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        return { success: false, error };
    }
}

// Add to window for browser console access
if (typeof window !== 'undefined') {
    (window as any).seedDepartments = seedDepartments;
}

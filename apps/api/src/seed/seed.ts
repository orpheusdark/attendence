import { connectDatabase } from '../config/database.js';
import { UserModel } from '../models/user.model.js';
import { DepartmentModel } from '../models/department.model.js';
import { SubjectModel } from '../models/subject.model.js';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDatabase();

  const department = await DepartmentModel.findOneAndUpdate(
    { code: 'CSE' },
    { name: 'Computer Science', code: 'CSE' },
    { upsert: true, new: true }
  );

  const subject = await SubjectModel.findOneAndUpdate(
    { code: 'DSA101' },
    { name: 'Data Structures', code: 'DSA101', departmentId: department?._id },
    { upsert: true, new: true }
  );

  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  await UserModel.findOneAndUpdate(
    { email: 'admin@attendance.local' },
    {
      name: 'System Admin',
      email: 'admin@attendance.local',
      passwordHash,
      role: 'admin',
      subjectIds: [subject?._id].filter(Boolean),
      status: 'active'
    },
    { upsert: true, new: true }
  );

  console.log('Seed completed');
  process.exit(0);
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});
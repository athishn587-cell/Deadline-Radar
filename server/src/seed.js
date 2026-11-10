require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');
const { addDays, todayISO } = require('./utils/dates');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deadline_radar');
  const t = todayISO();
  await Task.deleteMany({});
  await Task.insertMany([
    { title: 'Data Structures midterm', course: 'CS201', type: 'exam', dueDate: addDays(t, 4), estimatedHours: 18 },
    { title: 'Algorithms quiz 3', course: 'CS202', type: 'quiz', dueDate: addDays(t, 4), estimatedHours: 4 },
    { title: 'DBMS assignment', course: 'CS203', type: 'assignment', dueDate: addDays(t, 3), estimatedHours: 8 },
    { title: 'Software Eng. project demo', course: 'CS301', type: 'project', dueDate: addDays(t, 6), estimatedHours: 14 },
    { title: 'Maths problem set', course: 'MA101', type: 'assignment', dueDate: addDays(t, 9), estimatedHours: 5 },
  ]);
  console.log('Seeded sample tasks');
  await mongoose.disconnect();
})();

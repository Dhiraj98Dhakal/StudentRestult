db = db.getSiblingDB('studentdb');
db.createCollection('students');
db.students.createIndex({ roll: 1 }, { unique: true });
print('✅ MongoDB initialized successfully');

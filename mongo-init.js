// MongoDB initialization script
db = db.getSiblingDB('carshare');

db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'carshare'
    }
  ]
});

// Create initial collections if needed
db.createCollection('users');
db.createCollection('cars');
db.createCollection('sessions');
db.createCollection('locations');

print('Database carshare initialized successfully');

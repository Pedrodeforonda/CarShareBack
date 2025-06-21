import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../src/config/environment.js';

// Legacy user schema (without hashing)
const legacyUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const LegacyUser = mongoose.model('LegacyUser', legacyUserSchema, 'users');

async function migratePasswords() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(config.mongoConnectionString);
    console.log('✅ Connected to MongoDB');

    console.log('🔍 Finding users with unhashed passwords...');
    const users = await LegacyUser.find({});
    
    let migratedCount = 0;
    let alreadyHashedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Skip users without password
      if (!user.password) {
        skippedCount++;
        console.log(`⏭️  User ${user.email} has no password, skipping`);
        continue;
      }

      // Check if password is already hashed (bcrypt hashes start with $2b$)
      if (user.password.startsWith('$2b$')) {
        alreadyHashedCount++;
        console.log(`⏭️  User ${user.email} already has hashed password`);
        continue;
      }

      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(user.password, config.BCRYPT_ROUNDS);
      
      // Update the user with hashed password
      await LegacyUser.findByIdAndUpdate(user._id, {
        password: hashedPassword
      });

      migratedCount++;
      console.log(`✅ Migrated password for user: ${user.email}`);
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   Total users: ${users.length}`);
    console.log(`   Passwords migrated: ${migratedCount}`);
    console.log(`   Already hashed: ${alreadyHashedCount}`);
    console.log(`   Skipped (no password): ${skippedCount}`);
    console.log('✅ Password migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migratePasswords();
}

export { migratePasswords };

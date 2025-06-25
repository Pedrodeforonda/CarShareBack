import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../src/models/user.model.js';
import Car from '../src/models/car.model.js';
import Session from '../src/models/session.model.js';
import { config } from '../src/config/environment.js';

async function main() {
  await mongoose.connect(config.mongoConnectionString);
  console.log('✅ Connected to MongoDB');

  // Borrar todo
  await Session.deleteMany({});
  await Car.deleteMany({});
  await User.deleteMany({});
  console.log('🗑️  Database cleaned');

  // Crear usuarios
  const passwordHash = await bcrypt.hash('corcho26', config.BCRYPT_ROUNDS);
  const users = await User.insertMany([
    { name: 'Francisco Lang', email: 'flang@gmail.com', password: passwordHash },
    { name: 'Manuel Salas', email: 'msalas@gmail.com', password: passwordHash },
    { name: 'Pedro de Foronda', email: 'pdeforonda@gmail.com', password: passwordHash },
  ]);
  const [francisco, manuel, pedro] = users;
  console.log('👤 Usuarios creados:', users.map(u => u.email));

  // Crear autos
  const jeep = await Car.create({
    model: 'Renegade',
    brand: 'Jeep',
    year: 2022,
    fuelEfficiency: 11.5,
    fuelType: 'Nafta Super',
    admin: francisco._id,
    users: [manuel._id, pedro._id]
  });
  const fiesta = await Car.create({
    model: 'Fiesta',
    brand: 'Ford',
    year: 2021,
    fuelEfficiency: 11.5,
    fuelType: 'Nafta Premium',
    admin: pedro._id,
    users: [francisco._id, manuel._id]
  });
  console.log('🚗 Autos creados:', [jeep.brand + ' ' + jeep.model, fiesta.brand + ' ' + fiesta.model]);

  // Crear viajes (sessions)
  const viajes: any[] = [];
  // Jeep: alternar usuarios
  viajes.push(await Session.create({
    user: francisco._id, car: jeep._id, start_time: new Date(Date.now() - 86400000 * 4), end_time: new Date(Date.now() - 86400000 * 4 + 1800 * 1000), distance: 3.2, isActive: false, location: [] }));
  viajes.push(await Session.create({
    user: manuel._id, car: jeep._id, start_time: new Date(Date.now() - 86400000 * 3), end_time: new Date(Date.now() - 86400000 * 3 + 2100 * 1000), distance: 4.1, isActive: false, location: [] }));
  viajes.push(await Session.create({
    user: pedro._id, car: jeep._id, start_time: new Date(Date.now() - 86400000 * 2), end_time: new Date(Date.now() - 86400000 * 2 + 1600 * 1000), distance: 3.7, isActive: false, location: [] }));
  // Fiesta: alternar usuarios
  viajes.push(await Session.create({
    user: pedro._id, car: fiesta._id, start_time: new Date(Date.now() - 86400000 * 1), end_time: new Date(Date.now() - 86400000 * 1 + 2000 * 1000), distance: 4.5, isActive: false, location: [] }));
  viajes.push(await Session.create({
    user: francisco._id, car: fiesta._id, start_time: new Date(Date.now() - 86400000 * 0.7), end_time: new Date(Date.now() - 86400000 * 0.7 + 1700 * 1000), distance: 3.9, isActive: false, location: [] }));
  viajes.push(await Session.create({
    user: manuel._id, car: fiesta._id, start_time: new Date(Date.now() - 86400000 * 0.4), end_time: new Date(Date.now() - 86400000 * 0.4 + 1500 * 1000), distance: 3.3, isActive: false, location: [] }));
  console.log('🛣️  Viajes creados:', viajes.length);

  await mongoose.disconnect();
  console.log('✅ Seed terminado');
}

main().catch(e => { console.error(e); process.exit(1); });

import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env');
  const existing = await Admin.findOne({ email });
  if (existing) return;
  const hashed = await bcrypt.hash(password, 12);
  await Admin.create({ name: process.env.ADMIN_NAME || 'Portfolio Admin', email, password: hashed });
  console.log(`Initial admin created for ${email}`);
}

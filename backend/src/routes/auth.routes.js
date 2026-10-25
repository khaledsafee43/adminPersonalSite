import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await bcrypt.compare(password, admin.password))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = jwt.sign({ sub: admin._id.toString(), role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.json({ success: true, token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) { next(error); }
});
router.get('/me', requireAuth, (req, res) => res.json({ success: true, admin: { id: req.admin._id, name: req.admin.name, email: req.admin.email, role: req.admin.role } }));
router.patch('/profile', requireAuth, async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required' });
    const duplicate = await Admin.findOne({ email, _id: { $ne: req.admin._id } });
    if (duplicate) return res.status(409).json({ success: false, message: 'That email is already in use' });
    const admin = await Admin.findByIdAndUpdate(req.admin._id, { name, email }, { new: true, runValidators: true });
    res.json({ success: true, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) { next(error); }
});
router.patch('/password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || String(newPassword).length < 8) return res.status(400).json({ success: false, message: 'Provide current password and a new password of at least 8 characters' });
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!(await bcrypt.compare(currentPassword, admin.password))) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();
    res.json({ success: true, message: 'Password updated. Sign in again if your session expires.' });
  } catch (error) { next(error); }
});
export default router;

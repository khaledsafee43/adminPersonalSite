import { Router } from 'express';
import InboxItem from '../models/InboxItem.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const kinds = new Set(['messages','clients','requests']);
router.use(requireAuth);
router.param('kind', (req, res, next, kind) => { if (!kinds.has(kind)) return res.status(400).json({ success: false, message: 'Unsupported collection' }); next(); });
router.get('/:kind', async (req, res, next) => {
  try { const items = await InboxItem.find({ kind: req.params.kind }).sort({ createdAt: -1 }); res.json({ success: true, items }); }
  catch (error) { next(error); }
});
router.post('/:kind', async (req, res, next) => {
  try { const item = await InboxItem.create({ kind: req.params.kind, name: req.body.name || '', email: req.body.email || '', title: req.body.title || '', message: req.body.message || '', status: req.body.status || 'new', data: req.body.data || {} }); res.status(201).json({ success: true, item }); }
  catch (error) { next(error); }
});
router.patch('/:kind/:id', async (req, res, next) => {
  try { const update = {}; for (const key of ['name','email','title','message','status','data']) if (req.body[key] !== undefined) update[key] = req.body[key]; const item = await InboxItem.findOneAndUpdate({ _id: req.params.id, kind: req.params.kind }, update, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Record not found' }); res.json({ success: true, item }); }
  catch (error) { next(error); }
});
router.delete('/:kind/:id', async (req, res, next) => {
  try { const item = await InboxItem.findOneAndDelete({ _id: req.params.id, kind: req.params.kind }); if (!item) return res.status(404).json({ success: false, message: 'Record not found' }); res.json({ success: true, message: 'Record deleted' }); }
  catch (error) { next(error); }
});
export default router;

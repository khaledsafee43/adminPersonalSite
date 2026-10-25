import { Router } from 'express';
import Content from '../models/Content.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const allowedTypes = new Set(['home','about','projects','posts','skills','services','resume','contact','seo','appearance','languages','notifications','general']);
router.use(requireAuth);
router.param('type', (req, res, next, type) => {
  if (!allowedTypes.has(type)) return res.status(400).json({ success: false, message: 'Unsupported content type' });
  next();
});
router.get('/:type', async (req, res, next) => {
  try { const items = await Content.find({ type: req.params.type }).sort({ updatedAt: -1 }); res.json({ success: true, items }); }
  catch (error) { next(error); }
});
router.post('/:type', async (req, res, next) => {
  try {
    const title = String(req.body.title || '').trim();
    const slug = String(req.body.slug || '').trim().toLowerCase();
    const item = await Content.create({ type: req.params.type, title, slug, status: req.body.status || 'published', data: req.body.data || {} });
    res.status(201).json({ success: true, item });
  } catch (error) { if (error.code === 11000) return res.status(409).json({ success: false, message: 'This slug is already used for this content type' }); next(error); }
});
router.patch('/:type/:id', async (req, res, next) => {
  try {
    const item = await Content.findOneAndUpdate({ _id: req.params.id, type: req.params.type }, { title: String(req.body.title || '').trim(), slug: String(req.body.slug || '').trim().toLowerCase(), status: req.body.status || 'published', data: req.body.data || {} }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Content item not found' });
    res.json({ success: true, item });
  } catch (error) { if (error.code === 11000) return res.status(409).json({ success: false, message: 'This slug is already used for this content type' }); next(error); }
});
router.delete('/:type/:id', async (req, res, next) => {
  try { const item = await Content.findOneAndDelete({ _id: req.params.id, type: req.params.type }); if (!item) return res.status(404).json({ success: false, message: 'Content item not found' }); res.json({ success: true, message: 'Content deleted' }); }
  catch (error) { next(error); }
});
export default router;

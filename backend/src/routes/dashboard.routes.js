import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Content from '../models/Content.js';
import InboxItem from '../models/InboxItem.js';
const router = Router();
router.use(requireAuth);
router.get('/', async (_req, res, next) => {
  try {
    const [projects, posts, messages, requests, clients, unreadMessages, recent] = await Promise.all([
      Content.countDocuments({ type: 'projects' }), Content.countDocuments({ type: 'posts' }),
      InboxItem.countDocuments({ kind: 'messages' }), InboxItem.countDocuments({ kind: 'requests' }),
      InboxItem.countDocuments({ kind: 'clients' }), InboxItem.countDocuments({ kind: 'messages', status: 'new' }),
      InboxItem.find().sort({ createdAt: -1 }).limit(5).select('kind name title status createdAt')
    ]);
    res.json({ success: true, stats: { projects, posts, messages, requests, clients, unreadMessages }, recent });
  } catch (error) { next(error); }
});
export default router;

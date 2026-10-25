import mongoose from 'mongoose';
const inboxSchema = new mongoose.Schema({
  kind: { type: String, enum: ['messages', 'clients', 'requests'], required: true, index: true },
  name: { type: String, default: '' }, email: { type: String, default: '' },
  title: { type: String, default: '' }, message: { type: String, default: '' },
  status: { type: String, default: 'new' }, data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });
export default mongoose.model('InboxItem', inboxSchema);

import mongoose from 'mongoose';
const contentSchema = new mongoose.Schema({
  type: { type: String, required: true, index: true },
  title: { type: String, default: '' },
  slug: { type: String, default: '' },
  status: { type: String, default: 'published' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });
contentSchema.index({ type: 1, slug: 1 }, { unique: true, partialFilterExpression: { slug: { $type: 'string', $gt: '' } } });
export default mongoose.model('Content', contentSchema);

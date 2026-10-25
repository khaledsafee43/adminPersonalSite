import { useEffect, useState } from 'react';
import { ArrowLeft, Save, LoaderCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../lib/api';

export default function EditorPage({ type, title, backTo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', slug: '', status: 'draft', description: '', tags: '', url: '', image: '' });
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!id) return;
    api.get(`/content/${type}`).then(({ data }) => {
      const item = data.items.find((entry) => entry._id === id);
      if (!item) throw new Error('The requested item could not be found.');
      setForm({ title: item.title || '', slug: item.slug || '', status: item.status || 'draft', description: item.data?.description || '', tags: (item.data?.tags || []).join(', '), url: item.data?.url || '', image: item.data?.image || '' });
    }).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, [id, type]);
  async function submit(e) {
    e.preventDefault(); setSaving(true); setError('');
    const payload = { title: form.title.trim(), slug: form.slug.trim().toLowerCase(), status: form.status, data: { description: form.description, tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), url: form.url, image: form.image } };
    try {
      if (id) await api.patch(`/content/${type}/${id}`, payload); else await api.post(`/content/${type}`, payload);
      navigate(backTo);
    } catch (e) { setError(getErrorMessage(e)); } finally { setSaving(false); }
  }
  return <div className="mx-auto max-w-4xl space-y-6"><Link to={backTo} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16}/> Back to {title}</Link><div><p className="eyebrow">CONTENT STUDIO / EDITOR</p><h2 className="mt-2 text-2xl font-semibold text-white">{id ? 'Edit' : 'Create'} {type === 'projects' ? 'project' : 'blog post'}</h2><p className="mt-1 text-sm text-slate-400">Add content and save it to MongoDB through the protected API.</p></div>{loading ? <div className="panel flex items-center gap-2 p-8 text-slate-400"><LoaderCircle className="animate-spin"/> Loading editor…</div> : <form onSubmit={submit} className="panel space-y-5 p-5 sm:p-7"><div className="grid gap-5 sm:grid-cols-2"><label className="block sm:col-span-2"><span className="mb-1.5 block text-xs text-slate-400">Title *</span><input className="field" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder={type==='projects'?'e.g. Appointment Booking Platform':'e.g. How I built my portfolio'}/></label><label className="block"><span className="mb-1.5 block text-xs text-slate-400">URL slug</span><input className="field" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="my-project"/></label><label className="block"><span className="mb-1.5 block text-xs text-slate-400">Status</span><select className="field" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="block sm:col-span-2"><span className="mb-1.5 block text-xs text-slate-400">Description / content summary</span><textarea rows="6" className="field" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Explain the project, your role, the problem solved, and the outcome…"/></label><label className="block"><span className="mb-1.5 block text-xs text-slate-400">Tags (comma separated)</span><input className="field" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="React, Node.js, MongoDB"/></label><label className="block"><span className="mb-1.5 block text-xs text-slate-400">Live / article URL</span><input className="field" type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://example.com"/></label><label className="block sm:col-span-2"><span className="mb-1.5 block text-xs text-slate-400">Cover image URL</span><input className="field" type="url" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://…"/></label></div>{error&&<div className="alert-error">{error}</div>}<div className="flex justify-end gap-2 border-t border-line pt-5"><Link to={backTo} className="btn-secondary">Cancel</Link><button disabled={saving} className="btn-primary" type="submit">{saving?<LoaderCircle className="animate-spin" size={16}/>:<Save size={16}/>} {saving?'Saving…':'Save content'}</button></div></form>}</div>;
}

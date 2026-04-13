import React, { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { API } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const defaultForm = {
  title: '', description: '', category: 'Work', priority: 'Low',
  dueDate: new Date().toISOString().slice(0, 16)
};

export default function TaskDrawer({ onClose, task = null, onSaved }) {
  const [form, setForm] = useState(task ? {
    title: task.title, description: task.description || '',
    category: task.category, priority: task.priority,
    dueDate: new Date(task.dueDate).toISOString().slice(0, 16)
  } : defaultForm);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isEdit = !!task;

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('Task title is required'); return; }
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/tasks/${task._id}`, form);
        toast.success('Task updated!');
      } else {
        await API.post('/tasks', form);
        toast.success('Task created! 🎯');
      }
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        <div className="drawer-header">
          <div>
            <div className="drawer-title">{isEdit ? 'Edit Mission' : 'Create Mission'}</div>
            <div className="drawer-subtitle">New Kinetic Entry</div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="drawer-body">
          <div className="form-group">
            <label className="form-label">Task Identity</label>
            <input
              className="form-input"
              placeholder="What requires focus?"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Stream</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                {['Work', 'Study', 'Personal', 'Health'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
                {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Timeline</label>
            <input
              type="datetime-local"
              className="form-input"
              value={form.dueDate}
              onChange={e => set('dueDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deep Focus Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Detailed constraints or context..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Kinetic Suggestion */}
          {!isEdit && (
            <div className="insight-card">
              <div className="insight-title"><Lightbulb size={14} /> Kinetic Suggestion</div>
              <div className="insight-text">
                Break this into 3 smaller micro-tasks to increase your completion velocity by an estimated 22%.
              </div>
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '13px', letterSpacing: '0.05em' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'SAVING...' : isEdit ? 'SAVE CHANGES' : 'COMMIT TO STREAM'}
          </button>
        </div>
      </div>
    </div>
  );
}

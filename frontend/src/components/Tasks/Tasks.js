import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { API } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';
import TaskDrawer from './TaskDrawer';
import toast from 'react-hot-toast';

const CATEGORIES = ['All Streams', 'Work', 'Study', 'Health', 'Personal'];
const CATEGORY_COUNTS = { Work: 0, Study: 0, Health: 0, Personal: 0 };

// Responsive helper: returns true if screen width is under or equal to 768px (mobile/tablet)
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= breakpoint);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All Streams');
  const [showCritical, setShowCritical] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState(CATEGORY_COUNTS);

  // For single-column dimension selection in mobile
  const [mobileDimIndex, setMobileDimIndex] = useState(0);

  const isMobile = useIsMobile();
  const { query: searchQuery } = useSearch();

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'All Streams') params.set('category', activeCategory);
      const { data } = await API.get(`/tasks?${params}`);
      setTasks(data.tasks);

      // Count by category
      const counts = { Work: 0, Study: 0, Health: 0, Personal: 0 };
      data.tasks.forEach(t => { if (counts[t.category] !== undefined) counts[t.category]++; });
      setCategoryCounts(counts);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, [activeCategory]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const toggleComplete = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, completed: !t.completed } : t));
      if (!task.completed) toast.success('Task completed! 🎯');
    } catch { toast.error('Failed to update task'); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredTasks = tasks.filter(t => {
    if (showCritical && t.priority !== 'Critical' && t.priority !== 'High') return false;
    if (showOverdue && new Date(t.dueDate) >= new Date()) return false;
    if (q) {
      const title = (t.title || '').toLowerCase();
      const desc = (t.description || '').toLowerCase();
      if (!title.includes(q) && !desc.includes(q)) return false;
    }
    return true;
  });

  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  // Responsive styles
  const headerFontSize = isMobile ? 28 : 48;
  const statsGridColumns = isMobile ? '1fr' : 'repeat(3, 1fr)';
  const mainGridStyles = isMobile
    ? {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }
    : {
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 24,
      };
  const sidebarStyles = isMobile
    ? {
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'row',
        gap: 24,
        // Scrolling tabs for priorities in mobile
        overflowX: 'auto',
        paddingBottom: 8,
      }
    : {};

  // For mobile dimension: column scroll, one-by-one
  const dimensionBlockStyles = isMobile
    ? { marginBottom: 0, flex: 1, minWidth: 120 }
    : { marginBottom: 20 };

  const priorityBlockStyles = isMobile
    ? { flex: 1, minWidth: 120 }
    : {};

  const addTaskBtnStyle = isMobile
    ? { marginBottom: 16, width: '100%' }
    : { marginBottom: 16, display: 'flex', justifyContent: 'flex-end' };

  // --- Mobile dimension carousel controls
  function handleMobileDimNav(dir) {
    setMobileDimIndex(idx => {
      if (dir === 'prev') return idx === 0 ? CATEGORIES.length - 1 : idx - 1;
      return idx === CATEGORIES.length - 1 ? 0 : idx + 1;
    });
  }
  // When category changes outside carousel update index accordingly
  useEffect(() => {
    if (isMobile) {
      setMobileDimIndex(CATEGORIES.findIndex(cat => cat === activeCategory));
    }
  }, [activeCategory, isMobile]);

  return (
    <div style={{ padding: isMobile ? 12 : 0 }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? 20 : 32 }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: headerFontSize,
          fontWeight: 800,
          lineHeight: 1
        }}>
          Master Your Stream
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          marginTop: 8,
          fontSize: isMobile ? 13 : 14 }}>
          Orchestrate your focus across high-impact dimensions.<br />
          Silence the noise, amplify the outcomes.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: statsGridColumns,
          gap: 16,
          marginBottom: isMobile ? 20 : 28
        }}
      >
        {[
          { label: 'Completion Rate', value: `${completionRate}%`, delta: '+12% this week', color: 'var(--accent-green)' },
          { label: 'Active Tasks', value: tasks.filter(t => !t.completed).length, sub: `${tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date(Date.now() + 48 * 3600000)).length} Due in next 48h` },
          { label: 'Focus Hours', value: `${Math.round(tasks.filter(t => t.completed).length * 1.5)}`, sub: `Target: ${Math.round(tasks.length * 2)}h` }
        ].map((s, i) => (
          <div key={i} className="card" style={isMobile ? { marginBottom: 4 } : {}}>
            <div className="stat-label" style={isMobile ? { fontSize: 14 } : {}}>{s.label}</div>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: isMobile ? 24 : 32,
              fontWeight: 800,
              color: s.color || 'var(--text-primary)'
            }}>{s.value}</div>
            {s.delta && <div style={{
              fontSize: 12,
              color: 'var(--accent-green)',
              marginTop: 4
            }}>↑ {s.delta}</div>}
            {s.sub && <div style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              marginTop: 4
            }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      <div style={mainGridStyles}>
        {/* Sidebar filters */}
        <div style={sidebarStyles}>
          <div style={dimensionBlockStyles}>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              marginBottom: isMobile ? 6 : 10
            }}>
              Dimensions
            </div>
            {/* For mobile: dimension 'carousel', for desktop: standard list */}
            {isMobile ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 180,
                maxWidth: 220,
                margin: '0 auto'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'center',
                  gap: 10
                }}>
                  <button
                    aria-label="Prev dimension"
                    onClick={() => handleMobileDimNav('prev')}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 20,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 4,
                      flex: 0,
                    }}
                  >&lt;</button>
                  <button
                    className={`nav-item ${activeCategory === CATEGORIES[mobileDimIndex] ? 'active' : ''}`}
                    style={{
                      minWidth: 120,
                      width: '100%',
                      whiteSpace: 'nowrap',
                      flexGrow: 1,
                      display: 'flex',
                      flexWrap: 'nowrap',
                      alignContent: 'center',
                      justifyContent: 'flex-start',
                      border: '1px solid var(--border-muted)',
                      borderRadius: 7 ,
                      padding: '14px 14px',
                      fontWeight: 700,
                      fontSize: 10,
                 
                      background: activeCategory === CATEGORIES[mobileDimIndex] ? 'var(--bg-card-highlight)' : 'var(--bg-card)',
                      boxShadow: activeCategory === CATEGORIES[mobileDimIndex] ? '0 2px 8px 0 rgba(0,0,0,0.04)' : undefined,
                      transition: 'background 0.24s'
                    }}
                    onClick={() => setActiveCategory(CATEGORIES[mobileDimIndex])}
                  >
                    <span style={{
                      width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
                      background: CATEGORIES[mobileDimIndex] === 'Work'
                        ? 'var(--accent-blue)'
                        : CATEGORIES[mobileDimIndex] === 'Study'
                        ? 'var(--accent-purple)'
                        : CATEGORIES[mobileDimIndex] === 'Health'
                        ? 'var(--accent-green)'
                        : CATEGORIES[mobileDimIndex] === 'Personal'
                        ? 'var(--accent-orange)'
                        : 'var(--text-muted)',
                      marginRight: 10
                    }} />
                    <span>
                      {CATEGORIES[mobileDimIndex]}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: 13,
                      color: 'var(--text-muted)',
                      fontWeight: 400
                    }}>
                      {CATEGORIES[mobileDimIndex] === 'All Streams'
                        ? tasks.length
                        : categoryCounts[CATEGORIES[mobileDimIndex]]
                      }
                    </span>
                  </button>
                  <button
                    aria-label="Next dimension"
                    onClick={() => handleMobileDimNav('next')}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 20,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 4,
                      flex: 0,
                    }}
                  >&gt;</button>
                </div>
                {/* Indicator */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 6,
                  gap: 4,
                }}>
                  {CATEGORIES.map((cat, idx) => (
                    <span
                      key={cat}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        display: 'inline-block',
                        background: idx === mobileDimIndex
                          ? 'var(--accent-blue)'
                          : 'var(--border-muted)',
                        transition: 'background 0.18s',
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                display: 'block'
              }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`nav-item ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      marginBottom: 2,
                      minWidth: 0,
                      padding: '6px 12px',
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: cat === 'Work'
                        ? 'var(--accent-blue)'
                        : cat === 'Study'
                        ? 'var(--accent-purple)'
                        : cat === 'Health'
                        ? 'var(--accent-green)'
                        : cat === 'Personal'
                        ? 'var(--accent-orange)'
                        : 'var(--text-muted)',
                      marginRight: 6
                    }} />
                    {cat}
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: 11,
                      color: 'var(--text-muted)'
                    }}>
                      {cat === 'All Streams' ? tasks.length : categoryCounts[cat]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={priorityBlockStyles}>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              marginBottom: isMobile ? 6 : 10
            }}>
              Priority
            </div>
            <div style={{
              display: isMobile ? 'flex' : 'block',
              gap: isMobile ? 12 : 0
            }}>
              {[['Critical Only', showCritical, setShowCritical], ['Overdue', showOverdue, setShowOverdue]].map(([label, val, setter]) => (
                <label key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: isMobile ? '6px 8px' : '6px 0',
                    cursor: 'pointer',
                    fontSize: isMobile ? 13 : 13,
                    marginRight: isMobile ? 10 : 0
                  }}>
                  <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)}
                    style={{
                      accentColor: 'var(--accent-blue)',
                      width: 14,
                      height: 14
                    }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Task list */}
        <div>
          <div style={addTaskBtnStyle}>
            <button
              className="btn btn-primary"
              style={isMobile ? { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, gap: 8 } : {}}
              onClick={() => { setEditTask(null); setDrawerOpen(true); }}
            >
              <Plus size={14} /> Add Task
            </button>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state" style={isMobile ? { minHeight: 160, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', fontSize: 16 } : {}}>
              <div className="empty-icon">📋</div>
              <div className="empty-title">No tasks found</div>
              <div className="empty-desc">Create a task to start tracking your progress</div>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task._id}
                className={`task-item priority-${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''}`}
                style={isMobile
                  ? {
                      flexDirection: 'column',
                      display: 'flex',
                      alignItems: 'stretch',
                      marginBottom: 14,
                      padding: '12px 10px',
                      border: '1px solid var(--border-muted)',
                      borderRadius: 8
                    }
                  : {}
                }
              >
                <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleComplete(task)}
                  style={isMobile ? { width: 20, height: 20, marginBottom: 10 } : {}}
                >
                  {task.completed && <span style={{ fontSize: 11, color: 'white' }}>✓</span>}
                </div>
                <div className="task-content" style={isMobile ? { marginBottom: 12 } : {}}>
                  <div className="task-title" style={isMobile ? { fontSize: 15, fontWeight: 700 } : {}}>{task.title}</div>
                  <div className="task-meta" style={isMobile ? { fontSize: 12 } : {}}>
                    <Calendar size={10} />
                    <span style={{ marginLeft: 5, marginRight: 7 }}>{format(new Date(task.dueDate), isMobile ? 'MMM d, h:mm a' : 'MMM d, h:mm a')}</span>
                    <span className={`badge badge-${task.category.toLowerCase()}`}>{task.category}</span>
                  </div>
                </div>
                <div className="task-actions" style={isMobile ? { marginBottom: 8, display: 'flex', gap: 8 } : {}}>
                  <button className="task-action-btn" onClick={() => { setEditTask(task); setDrawerOpen(true); }}>
                    <Pencil size={13} />
                  </button>
                  <button className="task-action-btn delete" onClick={() => deleteTask(task._id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <span className={`badge badge-${task.priority.toLowerCase()}`}
                  style={isMobile ? { alignSelf: 'flex-end', fontSize: 11, marginTop: 4 } : {}}>
                  {task.priority}
                </span>
              </div>
            ))
          )}

          {filteredTasks.length > 0 && (
            <div style={{
              marginTop: 20,
              padding: isMobile ? '12px 8px' : '12px 16px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              Define your next 3 priorities. Tap to begin deep work.
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <TaskDrawer
          task={editTask}
          onClose={() => { setDrawerOpen(false); setEditTask(null); }}
          onSaved={fetchTasks}
        />
      )}
    </div>
  );
}

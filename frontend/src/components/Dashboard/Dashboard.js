import React, { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Zap, TrendingUp, Flame, Timer, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { API } from '../../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, score: 0, currentStreak: 0 });
  const [todayTasks, setTodayTasks] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [weeklyAvg, setWeeklyAvg] = useState(0);
  const [focusHours, setFocusHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, tasksRes, analyticsRes] = await Promise.all([
        API.get('/tasks/today/stats'),
        API.get(`/tasks?date=${today}`),
        API.get('/analytics/performance?period=7')
      ]);
      setStats(statsRes.data.stats);
      setTodayTasks(tasksRes.data.tasks.slice(0, 5));
      setTrendData(analyticsRes.data.data.scores.map(s => ({ date: s.date.slice(5), score: s.score })));
      setWeeklyAvg(analyticsRes.data.data.weeklyAvg);
      setFocusHours(analyticsRes.data.data.focusHours);
    } catch (err) {
      // use defaults
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Session timer
  useEffect(() => {
    let interval;
    if (sessionActive) {
      interval = setInterval(() => setSessionSeconds(s => {
        if (s >= 2700) { setSessionActive(false); toast.success('Deep Work Session complete! 🎉'); return 0; }
        return s + 1;
      }), 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const toggleTask = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTodayTasks(prev => prev.map(t => t._id === task._id ? { ...t, completed: !t.completed } : t));
      fetchData();
      if (!task.completed) toast.success('Task completed! 🎯');
    } catch { toast.error('Failed to update task'); }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const perfLabel = stats.score >= 90 ? 'Excellent' : stats.score >= 75 ? 'Good' : stats.score >= 50 ? 'Average' : 'Building';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) return (
      <div className="custom-tooltip">
        <div className="label">{payload[0].payload.date}</div>
        <div className="value">{payload[0].value}%</div>
      </div>
    );
    return null;
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>
            {DAYS[new Date().getDay()]}, {format(new Date(), 'MMMM d')}
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 40, fontWeight: 800, lineHeight: 1.1, color: 'var(--text-primary)' }}>
            Daily Pulse
          </h1>
        </div>
        {stats.score > 0 && (
          <div className="perf-label excellent" style={{ marginTop: 8 }}>
            <TrendingUp size={12} /> {perfLabel}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Tasks Today</div>
          <div className="stat-value">{stats.totalTasks.toString().padStart(2, '0')}</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }} /></div>
          <div className="stat-icon"><CheckSquare /></div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completed Tasks</div>
          <div className="stat-value">{stats.completedTasks.toString().padStart(2, '0')}</div>
          <div className="stat-delta positive">
            <ArrowUpRight size={12} /> {stats.completedTasks > 0 ? '12% vs yesterday' : 'Keep going!'}
          </div>
          <div className="stat-icon"><Zap /></div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Daily Score (%)</div>
          <div className="stat-value">{stats.score}<span>%</span></div>
          <div className="stat-delta neutral" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {stats.score >= 90 ? 'P90 THRESHOLD REACHED' : stats.score >= 70 ? 'ABOVE AVERAGE' : 'KEEP PUSHING'}
          </div>
          <div className="stat-icon"><TrendingUp /></div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Current Streak</div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{stats.currentStreak}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>DAYS CONSISTENT</div>
          <div className="stat-icon"><Flame /></div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Today's Focus */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700 }}>Today's Focus</h2>
            <a href="/tasks" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-blue)', textDecoration: 'none', letterSpacing: '0.05em' }}>
              VIEW ALL
            </a>
          </div>

          {todayTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <div className="empty-title">No tasks for today</div>
              <div className="empty-desc">Add tasks to start tracking your productivity</div>
            </div>
          ) : (
            todayTasks.map(task => (
              <div key={task._id} className={`task-item priority-${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''}`}
                onClick={() => toggleTask(task)}>
                <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
                  {task.completed && <span style={{ fontSize: 11, color: 'white' }}>✓</span>}
                </div>
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span>{format(new Date(task.dueDate), 'h:mm a')}</span>
                    <span className={`badge badge-${task.category.toLowerCase()}`}>{task.category}</span>
                  </div>
                </div>
                <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
              </div>
            ))
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Performance Trend */}
          <div className="card">
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16 }}>Performance Trend</div>
            <div style={{ height: 120, marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Weekly Avg</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800 }}>{weeklyAvg}%</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Volume</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800 }}>{focusHours} <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>hrs</span></div>
              </div>
            </div>
          </div>

          {/* Deep Work Session */}
          <div className="deep-work-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="deep-work-title">🎯 Deep Work Session</div>
              {sessionActive && (
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--accent-green)' }}>
                  {formatTime(sessionSeconds)}
                </div>
              )}
            </div>
            <div className="deep-work-desc">
              {sessionActive ? 'Session in progress. Stay focused!' : 'Start a 45-minute focus sprint to finish your top tasks.'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => { setSessionActive(a => !a); if (!sessionActive) setSessionSeconds(0); }}>
                <Timer size={14} /> {sessionActive ? 'STOP SESSION' : 'START SESSION'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

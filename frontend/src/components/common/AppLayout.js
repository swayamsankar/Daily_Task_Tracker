import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';
import {
  LayoutDashboard, CheckSquare, BarChart2, Settings,
  HelpCircle, LogOut, Plus, /* Bell, */ Menu, Moon, Sun, Search, X, Zap
} from 'lucide-react';
import TaskDrawer from '../Tasks/TaskDrawer';

export default function AppLayout({ children }) {
  const { logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { query: searchQuery, setQuery: setSearchQuery } = useSearch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showUpgradeDesc, setShowUpgradeDesc] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Handler for logo click to go to settings
  const handleLogoClick = () => {
    navigate('/settings');
  };

  // Handler for Upgrade button click
  const handleUpgradeClick = () => {
    setShowUpgradeDesc(true);
    // Auto-close after 3 seconds for UX
    setTimeout(() => setShowUpgradeDesc(false), 3000);
  };

  // Handler for Help button click
  const handleHelpClick = () => {
    setShowHelp(true);
  };

  const closeHelp = () => setShowHelp(false);

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon"><Zap size={18} color="white" /></div>
            <div>
              <div className="logo-text">Efficio</div>
              <div className="logo-sub">Kinetic Sanctuary</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckSquare size={16} /> Tasks
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 size={16} /> Analytics
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={16} /> Settings
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button className="new-task-btn" onClick={() => setDrawerOpen(true)}>
            <Plus size={16} /> New Task
          </button>
          <button className="nav-item" onClick={handleHelpClick}>
            <HelpCircle size={16} /> Help
          </button>
          <button className="nav-item" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <button className="icon-btn" onClick={() => setSidebarOpen(s => !s)} style={{ display: 'none' }}>
            <Menu size={16} />
          </button>
          <span className="header-title">TaskSway</span>
          <div className="header-search">
            <Search size={14} color="var(--text-muted)" aria-hidden />
            <input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && location.pathname !== '/tasks') {
                  navigate('/tasks');
                }
              }}
            />
            {searchQuery.trim() !== '' && (
              <button
                type="button"
                className="header-search-clear"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} strokeWidth={2.25} />
              </button>
            )}
          </div>
          <div className="header-actions" style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={toggleDarkMode} title="Toggle theme">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {/* Notification/Bell button removed */}
            {/* <button className="icon-btn">
              <Bell size={16} />
            </button> */}
            <button className="upgrade-btn" onClick={handleUpgradeClick}>Upgrade</button>
            {/* Description popup for upgrade */}
            {showUpgradeDesc && (
              <div
                style={{
                  position: 'absolute',
                  top: 42,
                  right: 95,
                  background: 'var(--bg-elevate, #fff)',
                  color: 'var(--text)',
                  borderRadius: 10,
                  boxShadow: '0 6px 28px rgba(0, 0, 0, 0.15)',
                  padding: '16px 22px',
                  zIndex: 999,
                  minWidth: 240,
                  maxWidth: 300,
                  fontSize: 15,
                }}
              >
                <strong>Coming Soon!</strong> <br />
                <span>
                  In a future upgrade, we will add premium features to enhance your productivity! <br />
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Stay tuned for more advanced analytics, priority support, custom themes, team features, and more. <br />
                    <em>Upgradation terms will be mentioned here.</em>
                  </span>
                </span>
              </div>
            )}
            {/* Help popup */}
            {showHelp && (
              <div
                className="help-popup"
                style={{
                  position: 'absolute',
                  top: 48,
                  right: 16,
                  background: '#000',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,.18)',
                  padding: '28px 30px 22px 28px',
                  zIndex: 2000,
                  minWidth: 310,
                  maxWidth: 380,
                  fontSize: 15,
                  color: '#fff',
                  border: '1px solid #222'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10
                }}>
                  <strong style={{ fontSize: 19, color: '#fff' }}>Get In Touch</strong>
                  <button
                    onClick={closeHelp}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 22,
                      cursor: 'pointer',
                      color: '#f1f1f1',
                      marginLeft: 8,
                      marginTop: -3,
                      lineHeight: 1
                    }}
                    aria-label="Close help"
                  >×</button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <svg width="20" height="20" fill="none" style={{ flexShrink: 0 }}>
                      <rect width="20" height="20" rx="6" fill="#fff" opacity=".08" />
                      <path d="M5 7.5V9a6 6 0 0 0 6 6h1.5a2 2 0 0 0 2-2V11a.5.5 0 0 0-.5-.5h-2A1.5 1.5 0 0 1 11 9V7a.5.5 0 0 0-.5-.5H7A2 2 0 0 0 5 7.5ZM14.5 6.5v-.75a2 2 0 0 0-2-2H7a.5.5 0 0 0-.5.5v2.75" stroke="#fff" strokeWidth="1.3" />
                    </svg>
                    <span>
                      <span style={{ fontWeight: 500, color: '#fff' }}>Email:</span>{' '}
                      <a href="mailto:support@tasksway.com" style={{ color: '#fff', textDecoration: 'underline' }}>
                        swayamsankar898@gmail.com
                      </a>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <svg width="20" height="20" fill="none" style={{ flexShrink: 0 }}>
                      <rect width="20" height="20" rx="6" fill="#fff" opacity=".08" />
                      <path d="M7.5 6.5A1.5 1.5 0 0 1 9 5h2a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 11 15h-2A1.5 1.5 0 0 1 7.5 13.5v-7Z" stroke="#fff" strokeWidth="1.3" />
                      <circle cx="10" cy="13" r="1" fill="#fff" />
                    </svg>
                    <span>
                      <span style={{ fontWeight: 500, color: '#fff' }}>Phone:</span>{' '}
                      <a href="tel:+12345678901" style={{ color: '#fff', textDecoration: 'underline' }}>
                        +1 (234) 567-8901
                      </a>
                    </span>
                  </div>
                  {/* Telegram and Help Center removed */}
                </div>
                <div style={{
                  fontSize: 13,
                  color: '#f1f1f1',
                  textAlign: 'left',
                  marginTop: 18,
                  lineHeight: 1.4
                }}>
                  Looking for help with tasks, settings, or just want to talk? Reach out to us via any of these options.<br />
                  We're here Mon-Fri 9am-6pm!
                </div>
              </div>
            )}
            {/* Logo button for settings, placed near Upgrade button */}
            <button
              className="icon-btn"
              onClick={handleLogoClick}
              style={{
                marginLeft: 8,
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-green))',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Account Settings"
            >
              <Zap size={18} color="white" />
            </button>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>

      {/* Task creation drawer */}
      {drawerOpen && <TaskDrawer onClose={() => setDrawerOpen(false)} />}
    </div>
  );
}

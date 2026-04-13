import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Bell, Shield, Camera, HelpCircle, X as XIcon, LogOut } from 'lucide-react';
import { useAuth, API } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Responsive helper for inline styles. Prefer CSS for real production!
 */
const mobileMedia = '@media (max-width: 700px)';

const styles = {
  container: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 24,
    marginBottom: 36,
    [mobileMedia]: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18,
      marginBottom: 24,
    }
  },
  avatarWrap: {
    position: 'relative'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 16,
    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 800,
    color: 'white',
    overflow: 'hidden',
    flexShrink: 0,
    [mobileMedia]: {
      width: 80,
      height: 80,
      fontSize: 26
    }
  },
  avatarButton: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 8,
    background: 'var(--accent-blue)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [mobileMedia]: {
      width: 22,
      height: 22,
      bottom: -4,
      right: -4,
    }
  },
  avatarEditOption: {
    marginTop: 10,
    display: 'flex',
    gap: 8
  },
  profileText: {
    [mobileMedia]: {
      width: '100%',
      textAlign: 'center'
    }
  },
  h1: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 40,
    fontWeight: 800,
    marginBottom: 4,
    [mobileMedia]: {
      fontSize: 27,
      marginBottom: 2
    }
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 36,
    [mobileMedia]: {
      gridTemplateColumns: '1fr',
      gap: 14,
      marginBottom: 24,
    }
  },
  statCard: {
    position: 'relative',
    padding: '12px -2px',
    [mobileMedia]: {
      padding: '10px 0'
    }
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    [mobileMedia]: {
      gridTemplateColumns: '1fr',
      gap: 10
    }
  },
  preferenceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 0',
    borderBottom: '1px solid var(--border)',
    [mobileMedia]: {
      gap: 10,
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '10px 0'
    }
  },
  preferenceRowNoBorder: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 0',
    [mobileMedia]: {
      gap: 10,
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '10px 0'
    }
  },
  iconCircle: (color) => ({
    width: 40,
    height: 40,
    background: 'var(--bg-input)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
    [mobileMedia]: {
      width: 30,
      height: 30,
      borderRadius: 7,
    }
  }),
  helpSection: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 12,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 18,
    [mobileMedia]: {
      padding: 12,
      borderRadius: 10,
      flexDirection: 'column',
      gap: 10
    }
  },
  helpIcon: {
    color: 'var(--accent-blue)',
    flexShrink: 0,
    marginTop: 2
  },
  helpContent: {
    flex: 1
  },
  helpTitle: {
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 6,
    color: 'var(--accent-blue)'
  },
  helpText: {
    fontSize: 13,
    color: 'var(--text-muted)'
  },
  helpLink: {
    color: 'var(--accent-blue)',
    textDecoration: 'underline',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: 13,
    marginTop: 8,
    display: 'inline-block'
  },
  signOutRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '18px 0 0 0',
    justifyContent: 'flex-end',
    [mobileMedia]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: '12px 0 0 0'
    }
  }
};

function mergeStyles(...objs) {
  // Deeply merges plain objects, merges mobileMedia queries at top level
  const out = {};
  for (const obj of objs) {
    if (!obj) continue;
    for (const k in obj) {
      if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
        out[k] = { ...out[k], ...obj[k] };
      } else {
        out[k] = obj[k];
      }
    }
  }
  return out;
}

// inject responsive styles as <style> (for demo, prefer CSS module in prod)
function ResponsiveStyle() {
  return (
    <style>
      {`
        @media (max-width: 700px) {
          .settings-mobile-stack {
            flex-direction: column !important;
            align-items: center !important;
          }
          .stats-mobile-col {
            grid-template-columns: 1fr !important;
          }
          .card {
            padding: 12px !important;
            border-radius: 10px !important;
          }
          .profile-avatar {
            width: 80px !important;
            height: 80px !important;
            font-size: 26px !important;
          }
        }
      `}
    </style>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser, darkMode, toggleDarkMode, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Avatar edit state
  const fileRef = useRef();
  const [avatarEditMode, setAvatarEditMode] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Help popup state
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      const { data } = await API.put('/users/profile', formData);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
    finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('name', user.name);
      const { data } = await API.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(data.user);
      toast.success('Avatar updated!');
      if (fileRef.current) fileRef.current.value = '';
      setAvatarEditMode(false);
    } catch {
      toast.error('Failed to update avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await API.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const toggleNotification = async (type) => {
    const updated = { ...user.notifications, [type]: !user.notifications?.[type] };
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('notifications', JSON.stringify(updated));
      const { data } = await API.put('/users/profile', { name: user.name, notifications: updated });
      updateUser(data.user);
    } catch {
      toast.error('Failed to update notification preference');
    }
  };

  const avatarUrl = user?.avatar
    ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || ''}${user.avatar}`
    : null;
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const estYear = new Date(user?.createdAt).getFullYear();

  // Email and phone info (hardcoded for demo)
  const supportEmail = "swayamsankar898@gmail.com";
  const supportPhone = "+1-234-567-8901";

  // Basic popup style
  const helpPopupOverlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.26)",
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1011
  };
  const helpPopupCardStyle = {
    minWidth: 280,
    maxWidth: '95vw',
    background: "var(--bg-card, #fff)",
    border: "1px solid var(--border, #d9d9d9)",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 6px 32px 0 rgba(0,0,0,0.14)",
    position: "relative"
  };
  const helpPopupCloseBtnStyle = {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 2,
    color: "var(--accent-blue)"
  };

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.container}>
      <ResponsiveStyle />
      {/* Profile header */}
      <div
        style={Object.assign({}, styles.profileHeader, {
          ...(window.innerWidth <= 700 ? { flexDirection: 'column', alignItems: 'center', gap: 18 } : {})
        })}
        className="settings-mobile-stack"
      >
        <div style={styles.avatarWrap}>
          <div
            style={Object.assign(
              {},
              styles.avatar,
              { ...(window.innerWidth <= 700 ? { width: 80, height: 80, fontSize: 26 } : {}) }
            )}
            className="profile-avatar"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} />
            ) : initials}
          </div>
          {!avatarEditMode && (
            <button
              style={Object.assign(
                {},
                styles.avatarButton,
                { ...(window.innerWidth <= 700 ? { width: 22, height: 22, bottom: -4, right: -4 } : {}) }
              )}
              onClick={() => setAvatarEditMode(true)}
              aria-label="Edit Avatar"
            >
              <Camera size={13} />
            </button>
          )}
          {avatarEditMode && (
            <div style={styles.avatarEditOption}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
                disabled={avatarLoading}
                aria-label="Upload avatar file"
              />
              <button
                className="btn btn-primary"
                style={{ fontSize: 11, padding: '5px 11px' }}
                onClick={() => {
                  if (fileRef.current && !avatarLoading) fileRef.current.click();
                }}
                disabled={avatarLoading}
              >
                {avatarLoading ? 'Uploading...' : 'Change Photo'}
              </button>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 11, padding: '5px 11px' }}
                onClick={() => {
                  setAvatarEditMode(false);
                  if (fileRef.current) fileRef.current.value = '';
                }}
                disabled={avatarLoading}
              >
                Cancel
              </button>
            </div>
          )}
          {/* If not in edit mode, render hidden input for legacy "click icon" to work */}
          {!avatarEditMode && (
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          )}
        </div>
        <div style={styles.profileText}>
          <h1
            style={Object.assign({}, styles.h1, window.innerWidth <= 700 ? { fontSize: 27, marginBottom: 2 } : {})}
          >{user?.name}</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 10 }}>{user?.email}</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: (window.innerWidth <= 700 ? 'center' : 'flex-start') }}>
            <span className="badge" style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)', fontSize: 11 }}>
              PREMIUM PLAN
            </span>
            <span className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', fontSize: 11 }}>
              EST. {estYear}
            </span>
          </div>
        </div>
      </div>
      {/* Profile edit */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 20 }}>Edit Profile</h3>
        <div style={Object.assign({}, styles.formGrid, window.innerWidth <= 700 ? { gridTemplateColumns: '1fr', gap: 10 } : {})}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Display Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email</label>
            <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 16, width: (window.innerWidth <= 700 ? "100%": "max-content") }} onClick={saveProfile} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {/* System Preferences */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 20 }}>System Preferences</h3>
        {/* Dark Mode */}
        <div style={styles.preferenceRow}>
          <div style={styles.iconCircle('var(--accent-blue)')}>
            <Moon size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Dark Mode</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Toggle high-contrast obsidian interface</div>
          </div>
          <button className={`toggle ${darkMode ? 'on' : ''}`} onClick={toggleDarkMode} />
        </div>
        {/* Notifications */}
        <div style={styles.preferenceRow}>
          <div style={styles.iconCircle('var(--accent-green)')}>
            <Bell size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Smart Notifications</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Push alerts for focus sessions and milestones</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: (window.innerWidth <= 700 ? 'wrap' : 'unset') }}>
            {['push', 'email'].map(type => (
              <button key={type}
                className={`btn ${user?.notifications?.[type] ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  padding: '5px 12px',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  width: (window.innerWidth <= 700 ? 74 : undefined)
                }}
                onClick={() => toggleNotification(type)}>
                {type}
              </button>
            ))}
          </div>
        </div>
        {/* Security */}
        <div style={mergeStyles(styles.preferenceRowNoBorder, { borderBottom: 'none' })}>
          <div style={styles.iconCircle('var(--accent-purple)')}>
            <Shield size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Account Security</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Update JWT keys and password protection</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: (window.innerWidth <= 700 ? 'wrap' : 'unset') }}>
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: (window.innerWidth <= 700 ? '7px 10px' : '7px 14px') }}
              onClick={() => setShowPasswordForm(s => !s)}>
              Update Password
            </button>
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: (window.innerWidth <= 700 ? '7px 10px' : '7px 14px') }}>
              Manage Sessions
            </button>
          </div>
        </div>
        {/* Password Form */}
        {showPasswordForm && (
          <div style={{
            marginTop: 16,
            padding: 16,
            background: 'var(--bg-input)',
            borderRadius: 10,
            ...(window.innerWidth <= 700 ? { padding: 10 } : {})
          }}>
            {['currentPassword', 'newPassword', 'confirm'].map(field => (
              <div key={field} className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">{field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}</label>
                <input type="password" className="form-input" value={passwordForm[field]}
                  onChange={e => setPasswordForm(f => ({ ...f, [field]: e.target.value }))} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, flexDirection: (window.innerWidth <= 700 ? 'column' : 'row') }}>
              <button className="btn btn-primary" style={{ width: (window.innerWidth <= 700 ? "100%" : "auto") }} onClick={changePassword}>Change Password</button>
              <button className="btn btn-ghost" style={{ width: (window.innerWidth <= 700 ? "100%" : "auto") }} onClick={() => setShowPasswordForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out (in row, like AppLayout.js menu) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 30,
        marginBottom: 8,
        gap: 0
      }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: 'var(--danger)',
            gap: 7,
            fontWeight: 600,
            fontSize: 16,
            padding: '2px 0',
            cursor: 'pointer'
          }}
          onClick={handleSignOut}
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>

      {/* Help section */}
      <div style={styles.helpSection}>
        <div style={styles.helpIcon}>
          <HelpCircle size={28} />
        </div>
        <div style={styles.helpContent}>
          <div style={styles.helpTitle}>Need Help?</div>
          <div style={styles.helpText}>
            For support, visit our <b>Help Center</b> or contact our support team.<br />
            You can find FAQ, troubleshooting guides, and more.
          </div>
          <button
            type="button"
            style={{
              ...styles.helpLink,
              background: "none",
              border: "none",
              marginTop: 8,
              display: 'inline-block',
              color: 'var(--accent-blue)',
              cursor: 'pointer'
            }}
            onClick={() => setShowHelpPopup(true)}
          >
            Show Contact Info
          </button>
        </div>
      </div>
      {/* Help popup modal */}
      {showHelpPopup && (
        <div style={helpPopupOverlayStyle} onClick={() => setShowHelpPopup(false)}>
          <div
            style={helpPopupCardStyle}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Support Contact Info"
          >
            <button
              aria-label="Close help details"
              style={helpPopupCloseBtnStyle}
              onClick={() => setShowHelpPopup(false)}
            >
              <XIcon size={20} />
            </button>
            <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 10}}>
              <HelpCircle size={29} style={{color: 'var(--accent-blue)'}} />
              <span style={{fontWeight: 700, color: "var(--accent-blue)", fontSize: 17}}>Contact Support</span>
            </div>
            <div style={{ marginBottom: 12, color: "var(--text-muted)", fontSize: 13 }}>
              You can reach our support team via the following channels:
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{fontWeight: 500}}>Email:</span><br />
              <a href={`mailto:${supportEmail}`} style={{ color: 'var(--accent-blue)' }}>{supportEmail}</a>
            </div>
            <div>
              <span style={{fontWeight: 500}}>Phone:</span><br />
              <a href={`tel:${supportPhone}`} style={{ color: 'var(--accent-blue)' }}>{supportPhone}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
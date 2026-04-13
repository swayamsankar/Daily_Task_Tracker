import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth, API } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const passToggleBtn = {
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-muted)',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [resetForm, setResetForm] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎯');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    if (resetForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setResetLoading(true);
    try {
      await API.post('/auth/reset-password', {
        email: resetForm.email.trim(),
        password: resetForm.newPassword,
      });
      toast.success('Password updated. Sign in with your email and new password.');
      setForm((f) => ({ ...f, email: resetForm.email.trim(), password: '' }));
      setResetForm({ email: '', newPassword: '', confirmPassword: '' });
      setMode('login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reset password');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" style={{ top: '-200px', left: '-200px' }} />
      <div className="auth-bg-glow" style={{ bottom: '-200px', right: '-200px', background: 'radial-gradient(circle, rgba(0, 229, 160, 0.05), transparent 70%)' }} />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon"><Zap size={18} color="white" /></div>
          <div>
            <div className="logo-text">Efficio</div>
            <div className="logo-sub">Kinetic Sanctuary</div>
          </div>
        </div>

        {mode === 'login' ? (
          <>
            <h2 className="auth-heading">Welcome back</h2>
            <p className="auth-subheading">Sign in to your sanctuary and resume your flow.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@kinetic.io"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => {
                      setResetForm((r) => ({ ...r, email: form.email }));
                      setMode('forgot');
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" style={passToggleBtn} onClick={() => setShowPass(s => !s)}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 8, fontSize: 14, letterSpacing: '0.03em' }} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account? <Link to="/signup">Create one</Link>
            </div>

            <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-input)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              🚀 Welcome to Tasksway! Register now and start managing your tasks efficiently.
         
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="auth-back-row"
              aria-label="Back to sign in"
            >
              <ArrowLeft size={18} />
              <span>Back to sign in</span>
            </button>

            <h2 className="auth-heading">Reset password</h2>
            <p className="auth-subheading">Enter the email for your account, then choose a new password.</p>

            <form onSubmit={handleResetSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@kinetic.io"
                  value={resetForm.email}
                  onChange={e => setResetForm(r => ({ ...r, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="At least 6 characters"
                    value={resetForm.newPassword}
                    onChange={e => setResetForm(r => ({ ...r, newPassword: e.target.value }))}
                    required
                    minLength={6}
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" style={passToggleBtn} onClick={() => setShowNewPass(s => !s)}>
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm new password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Re-enter new password"
                    value={resetForm.confirmPassword}
                    onChange={e => setResetForm(r => ({ ...r, confirmPassword: e.target.value }))}
                    required
                    minLength={6}
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" style={passToggleBtn} onClick={() => setShowConfirmPass(s => !s)}>
                    {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 8, fontSize: 14, letterSpacing: '0.03em' }} disabled={resetLoading}>
                {resetLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

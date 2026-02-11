import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await resetPassword({ email, newPassword });
            setMessage('Password reset successfully. Redirecting to login...');
            toast.success('Password reset successfully');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
            toast.error(err.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="col-md-5 animate-fade-in">
                <div className="card-premium p-4 p-md-5">
                    <div className="text-center mb-5">
                        <div className="icon-circle mx-auto mb-3" style={{ width: '64px', height: '64px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-key text-accent fa-2x"></i>
                        </div>
                        <h2 className="fw-bold text-white">Reset Password</h2>
                        <p className="text-muted">Enter your email and new password</p>
                    </div>

                    {message && <div className="alert alert-success rounded-4 border-0 mb-4">{message}</div>}
                    {error && <div className="alert alert-danger rounded-4 border-0 mb-4">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold ps-1">Email Address</label>
                            <input
                                type="email"
                                className="form-control-premium w-100"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold ps-1">New Password</label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control-premium w-100 pe-5"
                                    placeholder="••••••••"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none me-2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold ps-1">Confirm New Password</label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control-premium w-100 pe-5"
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none me-2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-premium btn-primary-premium w-100 py-3 mt-2 shadow">
                            Reset Password
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <p className="mb-0 text-muted">
                            Remember your password? <Link to="/login" className="text-accent fw-bold text-decoration-none">Back to Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

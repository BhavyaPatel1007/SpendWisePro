import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';


const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const passwordRef = React.useRef(null);
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="col-md-5 animate-fade-in">
                <div className="card-premium p-4 p-md-5">
                    <div className="text-center mb-5">
                        <div className="icon-circle mx-auto mb-3" style={{ width: '64px', height: '64px', background: 'var(--accent-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-lock text-accent fa-2x"></i>
                        </div>
                        <h2 className="fw-bold text-white">Welcome Back!</h2>
                        <p className="text-muted">Manage your wealth with SpendWise Pro</p>

                    </div>

                    <Toaster position="top-right" />


                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-google w-100 py-3 mb-4 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    >
                        <i className="fa-brands fa-google fs-5"></i>
                        <span>Sign in with Google</span>
                    </button>

                    <div className="divider text-uppercase">
                        <span>Or continue with email</span>
                    </div>

                    {error && <div className="alert alert-danger rounded-4 border-0 mb-4">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold ps-1">Email Address</label>
                            <input
                                type="email"
                                className="form-control-premium w-100"
                                placeholder="name@example.com"
                                required
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between">
                                <label className="form-label fw-semibold ps-1">Password</label>
                                <Link to="/forgot-password" className="small text-accent text-decoration-none fw-semibold">Forgot?</Link>
                            </div>
                            <div className="position-relative">
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? "text" : "password"}
                                    className="form-control-premium w-100 pe-5"
                                    placeholder="••••••••"
                                    required
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                            Sign In
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <p className="mb-0 text-muted">
                            New here? <Link to="/signup" className="text-accent fw-bold text-decoration-none">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

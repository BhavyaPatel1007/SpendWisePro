import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import { toast, Toaster } from 'react-hot-toast';


const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const passwordRef = React.useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    const handleGoogleSignup = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="col-md-5 animate-fade-in">
                <div className="card-premium p-4 p-md-5">
                    <div className="text-center mb-5">
                        <div className="icon-circle mx-auto mb-3" style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-user-plus text-success fa-2x"></i>
                        </div>
                        <h2 className="fw-bold text-white">Get Started</h2>
                        <p className="text-muted">Join thousands of smart spenders globally</p>
                    </div>

                    <Toaster position="top-right" />


                    <button
                        onClick={handleGoogleSignup}
                        className="btn btn-google w-100 py-3 mb-4 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    >
                        <i className="fa-brands fa-google fs-5"></i>
                        <span>Sign up with Google</span>
                    </button>

                    <div className="divider text-uppercase">
                        <span>Or continue with email</span>
                    </div>

                    {error && <div className="alert alert-danger rounded-4 border-0 mb-4">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold ps-1">Full Name</label>
                            <input
                                type="text"
                                className="form-control-premium w-100"
                                placeholder="John Doe"
                                required
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold ps-1">Email Address</label>
                            <input
                                type="email"
                                className="form-control-premium w-100"
                                placeholder="john@example.com"
                                required
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold ps-1">Password</label>
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
                            Create Free Account
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <p className="mb-0 text-muted">
                            Already a member? <Link to="/login" className="text-accent fw-bold text-decoration-none">Log in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

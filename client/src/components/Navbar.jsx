import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark glass navbar-floating sticky-top shadow-sm mx-2 mx-md-4 px-3 px-md-4">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold fs-3 text-white" to={user ? "/dashboard" : "/home"}>
                    <span className="me-2">💰</span>
                    <span className="text-white">SpendWise</span><span className="text-accent">Pro</span>
                </Link>

                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navContent">
                    <ul className="navbar-nav ms-auto align-items-center gap-2">
                        {user ? (
                            <>
                                {/* Dashboard Link for authenticated users */}
                                {location.pathname !== '/dashboard' && (
                                    <li className="nav-item">
                                        <Link to="/dashboard" className="nav-link text-white fw-semibold px-3">
                                            <i className="fa-solid fa-chart-line me-2"></i>
                                            Dashboard
                                        </Link>
                                    </li>
                                )}

                                {/* User Dropdown */}
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle text-white fw-semibold d-flex align-items-center bg-primary-light rounded-pill px-3 py-2 border-0" href="#" role="button" data-bs-toggle="dropdown">
                                        <div className="avatar me-2" style={{ width: '24px', height: '24px', background: 'var(--primary-default)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                                            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <span className="small">{user?.name || 'User'}</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-3 rounded-4 px-2 glass py-2">
                                        <li><Link className="dropdown-item py-2 px-3 rounded-3 text-white" to="/profile">
                                            <i className="fa-solid fa-user me-2"></i>Profile
                                        </Link></li>
                                        <li><Link className="dropdown-item py-2 px-3 rounded-3 text-white" to="/dashboard">
                                            <i className="fa-solid fa-chart-line me-2"></i>Dashboard
                                        </Link></li>
                                        <li><hr className="dropdown-divider opacity-20 mx-2" /></li>
                                        <li><button className="dropdown-item text-danger py-2 px-3 rounded-3" onClick={handleLogout}>
                                            <i className="fa-solid fa-right-from-bracket me-2"></i>Logout
                                        </button></li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <div className="d-flex gap-3">
                                <Link className="nav-link text-white fw-semibold px-3" to="/login">Login</Link>
                                <Link className="btn btn-premium btn-primary-premium shadow px-4" to="/signup">Get Started</Link>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

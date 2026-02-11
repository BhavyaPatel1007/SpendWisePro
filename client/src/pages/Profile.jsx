import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateProfile, fetchStats } from '../services/api';
import { toast, Toaster } from 'react-hot-toast';

const Profile = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        initial_balance: user?.initial_balance || 0,
        currency: user?.currency || '₹',
        phone: user?.phone || ''
    });
    const [lastExpense, setLastExpense] = useState(null);

    React.useEffect(() => {
        const loadStats = async () => {
            try {
                const { data } = await fetchStats();
                if (data.lastExpense) {
                    setLastExpense(data.lastExpense);
                }
            } catch (error) {
                console.error('Failed to load stats for profile:', error);
            }
        };
        loadStats();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setFormData({
            name: user?.name || '',
            initial_balance: user?.initial_balance || 0,
            currency: user?.currency || '₹',
            phone: user?.phone || ''
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user?.name || '',
            initial_balance: user?.initial_balance || 0,
            currency: user?.currency || '₹',
            phone: user?.phone || ''
        });
    };

    const handleSave = async () => {
        console.log('handleSave called with formData:', formData);
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (parseFloat(formData.initial_balance) < 0) {
            toast.error('Initial balance cannot be negative');
            return;
        }

        setIsSaving(true);
        try {
            console.log('Sending updateProfile request...');
            const response = await updateProfile(formData);
            console.log('updateProfile response:', response);

            // Ensure we use the data returned from the server
            const updatedUser = response.data.user;
            console.log('Updated user from server:', updatedUser);

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
            toast.success('Logged out successfully');
        }
    };

    const currencyOptions = [
        { symbol: '₹', name: 'Indian Rupee' },
        { symbol: '$', name: 'US Dollar' },
        { symbol: '€', name: 'Euro' },
        { symbol: '£', name: 'British Pound' },
        { symbol: '¥', name: 'Japanese Yen' }
    ];

    return (
        <div className="container py-5">
            <Toaster position="top-right" />

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="btn btn-link text-white text-decoration-none mb-4 p-0 d-flex align-items-center gap-2 hover-text-accent"
            >
                <i className="fa-solid fa-arrow-left"></i>
                <span className="fw-semibold">Back to Dashboard</span>
            </button>

            {/* Profile Header */}
            <div className="text-center mb-5 animate-fade-in">
                <div className="avatar mx-auto mb-3" style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, var(--accent), #4f46e5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
                }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <h1 className="fw-bold text-white mb-2">User Profile</h1>
                <p className="text-muted">Manage your account information</p>
            </div>

            {/* Profile Information Card */}
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card-premium p-4 glass mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <i className="fa-solid fa-user text-accent"></i>
                            <h5 className="mb-0 fw-bold text-white">Personal Information</h5>
                        </div>

                        {!isEditing ? (
                            // View Mode
                            <div className="profile-view">
                                <div className="mb-4">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <i className="fa-solid fa-user text-muted"></i>
                                        <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-0">Full Name</label>
                                    </div>
                                    <p className="text-white fw-semibold fs-5 mb-0">{user?.name || 'Not set'}</p>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <i className="fa-solid fa-envelope text-muted"></i>
                                        <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-0">Email Address</label>
                                    </div>
                                    <p className="text-white fw-semibold fs-5 mb-0">{user?.email || 'Not set'}</p>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <i className="fa-solid fa-wallet text-muted"></i>
                                        <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-0">Initial Balance</label>
                                    </div>
                                    <p className="text-success fw-bold fs-4 mb-0">
                                        {user?.currency || '₹'}{parseFloat(user?.initial_balance || 0).toLocaleString()}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <i className="fa-solid fa-globe text-muted"></i>
                                        <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-0">Currency</label>
                                    </div>
                                    <p className="text-white fw-semibold fs-5 mb-0">
                                        {user?.currency || '₹'} ({currencyOptions.find(c => c.symbol === user?.currency)?.name || 'Indian Rupee'})
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <i className="fa-solid fa-phone text-muted"></i>
                                        <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-0">Phone Number</label>
                                    </div>
                                    <p className="text-white fw-semibold fs-5 mb-0">{user?.phone || 'Not set'}</p>
                                </div>



                                {lastExpense && (
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <i className="fa-solid fa-receipt text-muted"></i>
                                            <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-0">Last Expense</label>
                                        </div>
                                        <p className="text-white fw-semibold fs-5 mb-0">
                                            {user?.currency || '₹'}{parseFloat(lastExpense.amount).toLocaleString()}
                                            <span className="text-muted fs-6 ms-2">
                                                on {new Date(lastExpense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleEdit}
                                    className="btn btn-premium btn-primary-premium w-100 d-flex align-items-center justify-content-center gap-2"
                                >
                                    <i className="fa-solid fa-pencil"></i>
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            // Edit Mode
                            <div className="profile-edit">
                                <div className="mb-4">
                                    <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">
                                        <i className="fa-solid fa-user me-2"></i>Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-premium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">
                                        <i className="fa-solid fa-envelope me-2"></i>Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-premium"
                                        value={user?.email || ''}
                                        disabled
                                        style={{ opacity: 1, cursor: 'not-allowed', backgroundColor: 'var(--bg-section)' }}
                                    />
                                    <small className="text-muted xx-small">Email cannot be changed</small>
                                </div>

                                <div className="mb-4">
                                    <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">
                                        <i className="fa-solid fa-wallet me-2"></i>Initial Balance
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-premium"
                                        value={formData.initial_balance}
                                        onChange={(e) => setFormData({ ...formData, initial_balance: e.target.value })}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">
                                        <i className="fa-solid fa-globe me-2"></i>Currency
                                    </label>
                                    <select
                                        className="form-select form-control-premium"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        {currencyOptions.map(curr => (
                                            <option key={curr.symbol} value={curr.symbol}>
                                                {curr.symbol} - {curr.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">
                                        <i className="fa-solid fa-phone me-2"></i>Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-premium"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="d-flex gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="btn btn-premium btn-primary-premium flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-check"></i>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="btn btn-outline-premium flex-grow-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Account Actions Card */}
                    <div className="card-premium p-4 glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <i className="fa-solid fa-shield-halved text-accent"></i>
                            <h5 className="mb-0 fw-bold text-white">Account Actions</h5>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                            style={{
                                background: 'linear-gradient(135deg, var(--danger), #dc2626)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '700',
                                fontSize: '1rem'
                            }}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

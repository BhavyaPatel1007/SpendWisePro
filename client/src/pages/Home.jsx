import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section text-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="hero-content animate-fade-in">
                                <h1 className="hero-title display-3 fw-bold mb-4">
                                    Take Control of Your
                                    <span className="text-accent d-block">Financial Future</span>
                                </h1>
                                <p className="hero-subtitle lead mb-5" style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>
                                    Track expenses, manage budgets, and gain insights into your spending habits with SpendWise Pro.
                                    Your personal finance companion for smarter money management.
                                </p>
                                <div className="cta-buttons d-flex gap-3 justify-content-center flex-wrap">
                                    <Link to="/signup" className="btn btn-premium btn-primary-premium btn-lg px-5 py-3 shadow-lg">
                                        <i className="fa-solid fa-rocket me-2"></i>
                                        Get Started Free
                                    </Link>
                                    <Link to="/login" className="btn btn-outline-light btn-lg px-5 py-3" style={{
                                        borderColor: 'var(--border-default)',
                                        color: 'var(--text-primary)',
                                        background: 'var(--bg-card)'
                                    }}>
                                        <i className="fa-solid fa-sign-in-alt me-2"></i>
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
                            Why Choose <span className="text-accent">SpendWise Pro</span>?
                        </h2>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                            Everything you need to manage your finances in one beautiful app
                        </p>
                    </div>

                    <div className="row g-4">
                        {/* Feature 1 */}
                        <div className="col-md-6 col-lg-3">
                            <div className="feature-card card-premium p-4 text-center h-100 glass">
                                <div className="feature-icon mb-3 mx-auto" style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, var(--primary-default), var(--primary-hover))',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-chart-line fa-2x text-white"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Smart Analytics</h4>
                                <p className="text-muted small">
                                    Visualize your spending patterns with interactive charts and get AI-powered insights.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="col-md-6 col-lg-3">
                            <div className="feature-card card-premium p-4 text-center h-100 glass">
                                <div className="feature-icon mb-3 mx-auto" style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, var(--success), #16a34a)',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-wallet fa-2x text-white"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Budget Tracking</h4>
                                <p className="text-muted small">
                                    Set budgets, track expenses, and stay on top of your financial goals effortlessly.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="col-md-6 col-lg-3">
                            <div className="feature-card card-premium p-4 text-center h-100 glass">
                                <div className="feature-icon mb-3 mx-auto" style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, var(--info), #0284c7)',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-shield-halved fa-2x text-white"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Secure & Private</h4>
                                <p className="text-muted small">
                                    Your financial data is encrypted and secure. We never share your information.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="col-md-6 col-lg-3">
                            <div className="feature-card card-premium p-4 text-center h-100 glass">
                                <div className="feature-icon mb-3 mx-auto" style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, var(--warning), #d97706)',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-mobile-screen-button fa-2x text-white"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Multi-Device</h4>
                                <p className="text-muted small">
                                    Access your finances anywhere, anytime. Fully responsive on all devices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="preview-section py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
                            Beautiful Dashboard, <span className="text-accent">Powerful Insights</span>
                        </h2>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                            Get a glimpse of what awaits you inside
                        </p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="preview-card card-premium p-4 glass position-relative">
                                {/* Lock Overlay */}
                                <div className="lock-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 'var(--radius-lg)',
                                    zIndex: 10
                                }}>
                                    <div className="text-center p-4">
                                        <i className="fa-solid fa-lock fa-4x mb-4 text-white" style={{ opacity: 0.9 }}></i>
                                        <h3 className="fw-bold mb-3 text-white">Sign Up to Unlock Full Access</h3>
                                        <p className="mb-4" style={{ maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                                            Create a free account to start tracking your expenses and managing your finances
                                        </p>
                                        <Link to="/signup" className="btn btn-premium btn-primary-premium btn-lg px-5 py-3">
                                            <i className="fa-solid fa-rocket me-2"></i>
                                            Get Started Now
                                        </Link>
                                    </div>
                                </div>

                                {/* Blurred Dashboard Preview */}
                                <div style={{ filter: 'blur(5px)', opacity: 0.5 }}>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-4">
                                            <div className="p-3 rounded-4" style={{ background: 'var(--bg-section)' }}>
                                                <div className="small text-muted mb-2">Total Balance</div>
                                                <div className="h4 fw-bold mb-0">$12,450</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="p-3 rounded-4" style={{ background: 'var(--bg-section)' }}>
                                                <div className="small text-muted mb-2">Income</div>
                                                <div className="h4 fw-bold mb-0 text-success">$8,500</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="p-3 rounded-4" style={{ background: 'var(--bg-section)' }}>
                                                <div className="small text-muted mb-2">Expenses</div>
                                                <div className="h4 fw-bold mb-0 text-danger">$3,200</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <div className="p-4 rounded-4" style={{ background: 'var(--bg-section)', height: '300px' }}>
                                                <div className="fw-bold mb-3">Expense Distribution</div>
                                                <div className="text-muted small">Chart visualization...</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="p-4 rounded-4" style={{ background: 'var(--bg-section)', height: '300px' }}>
                                                <div className="fw-bold mb-3">Recent Transactions</div>
                                                <div className="text-muted small">Transaction list...</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="final-cta-section py-5 text-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="cta-card card-premium p-5 glass">
                                <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
                                    Ready to Transform Your Finances?
                                </h2>
                                <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                                    Join thousands of users who are already managing their money smarter with SpendWise Pro
                                </p>
                                <Link to="/signup" className="btn btn-premium btn-primary-premium btn-lg px-5 py-3 shadow-lg">
                                    <i className="fa-solid fa-rocket me-2"></i>
                                    Start Your Journey Today
                                </Link>
                                <div className="mt-4">
                                    <small className="text-muted">
                                        Already have an account? <Link to="/login" className="text-accent fw-bold">Login here</Link>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

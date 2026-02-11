import React, { useState, useEffect } from 'react';

const SummaryCards = ({ stats, currency = '$' }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 800);
        return () => clearTimeout(timer);
    }, [stats]);

    return (
        <div className={`row g-4 ${animate ? 'animate-pulse-highlight' : ''}`}>
            {/* Total Wealth Card */}
            <div className="col-md-3">
                <div className="card-premium p-4" style={{ borderLeft: '4px solid #6366f1' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '16px' }}>
                            <i className="fa-solid fa-wallet text-accent fa-xl"></i>
                        </div>
                        <span className="badge bg-primary-light text-muted rounded-pill px-3 py-2 x-small">
                            <i className="fa-solid fa-earth-americas me-1"></i> Global
                        </span>
                    </div>
                    <h6 className="text-muted fw-bold xx-small text-uppercase ls-1 mb-2">TOTAL WEALTH</h6>
                    <h2 className="mb-0 fw-bold fs-2 text-white">{currency}{stats?.balance?.toLocaleString() || '0.00'}</h2>
                </div>
            </div>

            {/* Filtered Income Card */}
            <div className="col-md-3">
                <div className="card-premium p-4" style={{ borderLeft: '4px solid #10b981' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '16px' }}>
                            <i className="fa-solid fa-arrow-up text-success fa-xl"></i>
                        </div>
                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 x-small">
                            <i className="fa-solid fa-filter me-1"></i> Inflow
                        </span>
                    </div>
                    <h6 className="text-muted fw-bold xx-small text-uppercase ls-1 mb-2">FILTERED INCOME</h6>
                    <h2 className="mb-0 fw-bold fs-2 text-success">{currency}{stats?.income?.toLocaleString() || '0.00'}</h2>
                </div>
            </div>

            {/* Filtered Spending Card */}
            <div className="col-md-3">
                <div className="card-premium p-4" style={{ borderLeft: '4px solid #f43f5e' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '16px' }}>
                            <i className="fa-solid fa-arrow-down text-danger fa-xl"></i>
                        </div>
                        <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 x-small">
                            <i className="fa-solid fa-filter me-1"></i> Outflow
                        </span>
                    </div>
                    <h6 className="text-muted fw-bold xx-small text-uppercase ls-1 mb-2">FILTERED SPENDING</h6>
                    <h2 className="mb-0 fw-bold fs-2 text-danger">{currency}{stats?.expense?.toLocaleString() || '0.00'}</h2>
                </div>
            </div>

            {/* Net Balance Card */}
            <div className="col-md-3">
                <div className="card-premium p-4" style={{ borderLeft: '4px solid #22d3ee' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '12px', borderRadius: '16px' }}>
                            <i className="fa-solid fa-scale-balanced text-info fa-xl"></i>
                        </div>
                        <span className="badge bg-info-subtle text-info rounded-pill px-3 py-2 x-small">
                            <i className="fa-solid fa-sliders me-1"></i> Period Net
                        </span>
                    </div>
                    <h6 className="text-muted fw-bold xx-small text-uppercase ls-1 mb-2">NET BALANCE</h6>
                    <h2 className={`mb-0 fw-bold fs-2 ${stats?.periodNet >= 0 ? 'text-info' : 'text-danger'}`}>
                        {stats?.periodNet < 0 && '-'}{currency}{Math.abs(stats?.periodNet || 0).toLocaleString()}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;

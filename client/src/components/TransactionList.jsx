import React from 'react';

const TransactionList = ({ expenses, onDelete, onEdit, currency, onExport, showHistory, onToggleHistory }) => {
    const categoryIcons = {
        'Food': 'fa-utensils',
        'Salary': 'fa-money-bill-wave',
        'Rent': 'fa-house-user',
        'Travel': 'fa-car-side',
        'Shopping': 'fa-cart-shopping',
        'Freelance': 'fa-laptop-code',
        'Investment': 'fa-chart-pie',
        'Gift': 'fa-gift',
        'Health': 'fa-heart-pulse',
        'Entertainment': 'fa-gamepad',
        'Transport': 'fa-bus',
        'Petrol': 'fa-gas-pump',
        'Project': 'fa-briefcase',
        'Crypto': 'fa-bitcoin-sign',
        'Bonus': 'fa-star',
        'Other': 'fa-circle-nodes'
    };

    // Filter to last 5 transactions if not showing history
    const displayExpenses = showHistory ? expenses : expenses.slice(0, 5);

    return (
        <div className="card-premium h-100 glass p-4 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1 fw-bold text-white ls-1">Recent Activity</h5>
                    <p className="text-muted xx-small mb-0 uppercase ls-2">{expenses.length} records found</p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-premium btn-secondary-premium py-2 px-3 small d-flex align-items-center gap-2"
                        onClick={onExport}
                        disabled={expenses.length === 0}
                        style={{ background: 'rgba(255,255,255,0.05)', fontSize: '11px', opacity: expenses.length === 0 ? 0.5 : 1 }}
                    >
                        <i className="fa-solid fa-file-export text-accent"></i>
                        <span className="d-none d-md-inline">Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="transaction-scroll flex-grow-1" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
                {displayExpenses.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                        {displayExpenses.map((t) => (
                            <div key={t.id} className="transaction-item-new p-3 rounded-4 glass border border-white-10 d-flex justify-content-between align-items-center animate-scale-hover"
                                style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', borderLeft: `4px solid ${t.type === 'Expense' ? 'var(--danger)' : 'var(--success)'}` }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`icon-box-small rounded-pill d-flex align-items-center justify-content-center ${t.type === 'Expense' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}
                                        style={{ width: '40px', height: '40px' }}>
                                        <i className={`fa-solid ${categoryIcons[t.category] || 'fa-circle-question'} fa-lg`}></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold text-white small text-truncate" style={{ maxWidth: '150px' }}>{t.note || 'Untitled Transaction'}</h6>
                                        <div className="d-flex gap-2 align-items-center mt-1">
                                            <small className="text-muted xx-small ls-1 text-uppercase fw-bold">
                                                {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </small>
                                            <span className="opacity-20">|</span>
                                            <small className="text-accent xx-small ls-1 text-uppercase fw-bold">{t.category}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end d-flex align-items-center justify-content-between gap-2 w-100-mobile">
                                    <span className={`fw-bold ${t.type === 'Expense' ? 'text-danger' : 'text-success'}`} style={{ letterSpacing: '-0.02em', fontSize: '1.1rem' }}>
                                        {t.type === 'Expense' ? '-' : '+'}{currency}{Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>

                                    <div className="action-btns d-flex gap-1 ms-2">
                                        <button onClick={() => onEdit(t)} className="btn btn-sm btn-link text-muted p-1 hover-text-accent">
                                            <i className="fa-solid fa-pencil fa-xs"></i>
                                        </button>
                                        <button onClick={() => onDelete(t.id)} className="btn btn-sm btn-link text-muted p-1 hover-text-danger">
                                            <i className="fa-solid fa-trash-can fa-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 glass rounded-4 border border-dashed-white">
                        <div className="mb-3 opacity-20">
                            <i className="fa-solid fa-receipt fa-4x"></i>
                        </div>
                        <h6 className="text-white fw-bold">No Records Found</h6>
                        <p className="text-muted small mb-0 px-4">Your financial journey starts by adding your first income or expense above.</p>
                    </div>
                )}
            </div>

            {expenses.length > 5 && (
                <div className="mt-4 pt-3 border-top border-white-10">
                    <button className="btn btn-link text-accent w-100 text-decoration-none fw-bold small ls-1" onClick={onToggleHistory}>
                        {showHistory ? 'Show Less' : 'View All Transactions'}
                        <i className={`fa-solid fa-chevron-${showHistory ? 'up' : 'down'} ms-2`}></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionList;

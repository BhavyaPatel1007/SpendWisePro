import React, { useState, useEffect, useContext, useMemo } from 'react';
import { fetchExpenses, deleteExpense, fetchStats, updateSettings } from '../services/api';
import TransactionList from '../components/TransactionList';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import { AuthContext } from '../context/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DEMO_TRANSACTIONS } from '../services/demoData';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [stats, setStats] = useState({ totals: { balance: 0, income: 0, expense: 0 }, categorySummary: [] });
    const [editingExpense, setEditingExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [settingsData, setSettingsData] = useState({
        initial_balance: 0,
        currency: '$'
    });
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [categoryFilter, setCategoryFilter] = useState('All');
    const [monthFilter, setMonthFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [showHistory, setShowHistory] = useState(false);
    const [isDemoData, setIsDemoData] = useState(false);

    const loadData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Session Token Missing!');
            setLoading(false);
            toast.error('Session expired. Please login again.');
            return;
        }

        setLoading(true);
        try {
            const [expenseRes, statsRes] = await Promise.all([
                fetchExpenses(),
                fetchStats()
            ]);
            const realExpenses = expenseRes.data || [];

            console.log('✅ API Response - Expenses:', realExpenses.length, 'transactions');
            console.log('✅ API Response - Stats:', statsRes.data);

            // Set the expenses to state
            if (realExpenses.length > 0) {
                setExpenses(realExpenses);
                setIsDemoData(false);
            } else {
                // No transactions yet, show demo data
                setExpenses(DEMO_TRANSACTIONS);
                setIsDemoData(true);
            }
        } catch (err) {
            console.error('Error loading dashboard data', err);
            setExpenses(DEMO_TRANSACTIONS);
            setIsDemoData(true);
            if (err.response?.status === 401) {
                toast.error('Session invalid. Please logout and login.');
            } else {
                toast.error('Server unreachable. Showing demo data.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (user) {
            setSettingsData({
                initial_balance: user.initial_balance || 0,
                currency: user.currency || '$'
            });
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (isDemoData) {
            toast.error('Cannot delete demo data. Add your own transactions first!');
            return;
        }
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteExpense(id);
                toast.success('Transaction deleted');
                loadData();
            } catch (err) {
                toast.error('Failed to delete transaction');
            }
        }
    };

    const handleEdit = (expense) => {
        if (isDemoData) {
            toast.error('Cannot edit demo data. Add your own transactions first!');
            return;
        }
        setEditingExpense(expense);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSettingsUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await updateSettings(settingsData);
            updateUser(res.data);
            setSaveSuccess(true);
            toast.success('Settings updated');
            setTimeout(() => setSaveSuccess(false), 3000);
            loadData();
        } catch (err) {
            toast.error('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = () => {
        if (filteredExpenses.length === 0) return;

        const headers = ['Date', 'Category', 'Note', 'Amount'];
        const csvContent = [
            headers.join(','),
            ...filteredExpenses.map(e => [
                e.date,
                e.category,
                `"${e.note || ''}"`,
                e.amount
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `SpendWise_Export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('CSV Exported');
    };

    const filteredExpenses = useMemo(() => {
        return expenses.filter(exp => {
            let matchesCategory = true;
            if (categoryFilter !== 'All') matchesCategory = exp.category === categoryFilter;

            let matchesTime = true;
            if (monthFilter !== 'All') {
                const expDate = new Date(exp.date);
                const now = new Date();
                if (monthFilter === 'This Month') {
                    matchesTime = expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
                } else if (monthFilter === 'Last Month') {
                    const lastMonth = new Date();
                    lastMonth.setMonth(now.getMonth() - 1);
                    matchesTime = expDate.getMonth() === lastMonth.getMonth() && expDate.getFullYear() === lastMonth.getFullYear();
                }
            }

            let matchesSearch = true;
            if (searchTerm) {
                matchesSearch = exp.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    exp.category?.toLowerCase().includes(searchTerm.toLowerCase());
            }

            let matchesDateRange = true;
            if (dateRange.from) matchesDateRange = matchesDateRange && exp.date >= dateRange.from;
            if (dateRange.to) matchesDateRange = matchesDateRange && exp.date <= dateRange.to;

            return matchesCategory && matchesTime && matchesSearch && matchesDateRange;
        });
    }, [expenses, categoryFilter, monthFilter, searchTerm, dateRange]);

    const filteredStats = useMemo(() => {
        const initial = user?.initial_balance || 0;
        let totalIncome = 0;
        let totalExpense = 0;

        // 1. Calculate Global Stats (All transaction history)
        // FIXED: Use the 'type' field instead of amount sign
        expenses.forEach(exp => {
            const amt = Math.abs(parseFloat(exp.amount)); // Always use absolute value
            if (exp.type === 'Income') {
                totalIncome += amt;
            } else if (exp.type === 'Expense') {
                totalExpense += amt;
            }
        });
        const globalBalance = initial + totalIncome - totalExpense;

        let filteredIncome = 0;
        let filteredExpense = 0;
        const categoryTotals = {};

        // 2. Calculate Filtered Stats (Only what is currently visible)
        // FIXED: Use the 'type' field instead of amount sign
        filteredExpenses.forEach(exp => {
            const amt = Math.abs(parseFloat(exp.amount)); // Always use absolute value
            if (exp.type === 'Income') {
                filteredIncome += amt;
            } else if (exp.type === 'Expense') {
                filteredExpense += amt;
                categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amt;
            }
        });

        const categorySummary = Object.keys(categoryTotals).map(cat => ({
            category: cat,
            total: categoryTotals[cat]
        }));
        const sortedCategories = [...categorySummary].sort((a, b) => b.total - a.total);
        const topCategory = sortedCategories.length > 0 ? sortedCategories[0] : null;

        return {
            totals: {
                income: filteredIncome,
                expense: filteredExpense,
                balance: globalBalance,
                periodNet: filteredIncome - filteredExpense // This is the "minus out" value
            },
            categorySummary,
            topCategory
        };
    }, [expenses, filteredExpenses, user]);

    const chartData = {
        labels: filteredStats.categorySummary.map(c => c.category),
        datasets: [{
            data: filteredStats.categorySummary.map(c => c.total),
            backgroundColor: [
                '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6',
                '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#a855f7'
            ],
            borderWidth: 0,
            hoverOffset: 20
        }]
    };

    const currency = user?.currency || '$';

    const SkeletonLoader = () => (
        <div className="animate-fade-in">
            <div className="row g-4 mb-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="col-12 col-md-6 col-lg-3">
                        <div className="card-premium p-4 glass">
                            <div className="skeleton rounded-pill mb-3" style={{ width: '40px', height: '40px' }}></div>
                            <div className="skeleton rounded-pill mb-2" style={{ width: '60%', height: '12px' }}></div>
                            <div className="skeleton rounded-pill" style={{ width: '80%', height: '24px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card-premium p-4 glass mb-4" style={{ height: '400px' }}>
                        <div className="skeleton rounded-4 w-100 h-100"></div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card-premium p-4 glass" style={{ height: '400px' }}>
                        <div className="skeleton rounded-pill mb-4" style={{ width: '100px', height: '20px' }}></div>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="d-flex gap-3 mb-3">
                                <div className="skeleton rounded-pill" style={{ width: '40px', height: '40px' }}></div>
                                <div className="flex-grow-1">
                                    <div className="skeleton rounded-pill mb-2" style={{ width: '70%', height: '12px' }}></div>
                                    <div className="skeleton rounded-pill" style={{ width: '40%', height: '10px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <div className="skeleton rounded-pill mb-2" style={{ width: '200px', height: '32px' }}></div>
                        <div className="skeleton rounded-pill" style={{ width: '250px', height: '16px' }}></div>
                    </div>
                    <div className="skeleton rounded-pill" style={{ width: '120px', height: '40px' }}></div>
                </div>
                <SkeletonLoader />
            </div>
        );
    }

    return (
        <div className="container py-4 pb-5">
            <Toaster position="top-right" />

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
                <div>
                    <h1 className="fw-bold text-white mb-2 ls-1 animate-fade-in">Financial Insights</h1>
                    <p className="text-muted small mb-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>Explore your spending and manage your budget with precision.</p>
                </div>
                <button className="btn btn-premium btn-primary-premium d-flex align-items-center gap-2 shadow-lg px-4" onClick={() => setShowSettings(true)}>
                    <i className="fa-solid fa-sliders"></i>
                    Preferences
                </button>
            </div>

            {isDemoData && (
                <div className="alert demo-banner border-0 mb-4 animate-fade-in d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="icon-box-small bg-white bg-opacity-10 rounded-pill p-2 me-3">
                            <i className="fa-solid fa-wand-magic-sparkles text-accent"></i>
                        </div>
                        <div>
                            <h6 className="mb-0 fw-bold text-white small">Viewing Demo Data</h6>
                            <p className="mb-0 xx-small text-muted">Add your first real transaction to clear this sample data.</p>
                        </div>
                    </div>
                </div>
            )}

            <SummaryCards stats={filteredStats.totals} currency={currency} />

            <div className="row mt-4 mt-md-5 g-4 text-center text-md-start">
                <div className="col-lg-8 order-2 order-lg-1">
                    <div className="row g-4 mb-4">
                        <div className="col-12">
                            <div className="card-premium p-4 glass">
                                <div className="row align-items-center g-4">
                                    <div className="col-md-7">
                                        <h6 className="mb-4 fw-bold ls-1 text-muted text-uppercase small">Expense Distribution</h6>
                                        {filteredStats.categorySummary?.length > 0 ? (
                                            <div style={{ height: '300px', position: 'relative' }}>
                                                <Pie
                                                    data={chartData}
                                                    options={{
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: window.innerWidth < 768 ? 'bottom' : 'right',
                                                                labels: {
                                                                    color: '#94a3b8',
                                                                    boxWidth: 12,
                                                                    padding: 15,
                                                                    font: { size: 11 }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-100 d-flex align-items-center justify-content-center py-5">
                                                <p className="text-muted small">No spending data to visualize</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-5">
                                        <div className="p-4 rounded-4 bg-primary-dark border border-accent-subtle animate-bounce-in">
                                            <h6 className="xx-small text-accent fw-bold text-uppercase ls-2 mb-3">
                                                <i className="fa-solid fa-wand-magic-sparkles me-2"></i> Smart Insight
                                            </h6>
                                            {filteredStats.topCategory ? (
                                                <div className="text-center py-2">
                                                    <div className="icon-box-large mx-auto mb-3" style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <i className="fa-solid fa-trophy text-accent fa-2xl"></i>
                                                    </div>
                                                    <h4 className="fw-bold text-white mb-1">{filteredStats.topCategory.category}</h4>
                                                    <p className="text-muted small mb-3">
                                                        You spent the most on <strong>{filteredStats.topCategory.category}</strong>.
                                                    </p>
                                                    <div className="h2 fw-bold text-danger mb-0">
                                                        {currency}{filteredStats.topCategory.total.toLocaleString()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p className="text-muted small mb-0">Add expenses to see insights</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TransactionList
                        expenses={filteredExpenses}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        currency={currency}
                        onExport={handleExport}
                        showHistory={showHistory}
                        onToggleHistory={() => setShowHistory(!showHistory)}
                    />
                </div>

                <div className="col-lg-4 order-1 order-lg-2">
                    <TransactionForm
                        onSuccess={loadData}
                        editingExpense={editingExpense}
                        setEditingExpense={setEditingExpense}
                        currency={currency}
                    />

                    <div className="card-premium p-4 glass mt-4">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <i className="fa-solid fa-filter text-accent"></i>
                            <h6 className="mb-0 fw-bold text-white ls-1">Smart Filters</h6>
                        </div>

                        <div className="mb-3">
                            <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">Search Note</label>
                            <div className="position-relative">
                                <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                <input
                                    type="text"
                                    className="form-control form-control-premium ps-5"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-6">
                                <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">Category</label>
                                <select className="form-select form-control-premium" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                    <option value="All">All Categories</option>
                                    <option value="Food">Food</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">Time Period</label>
                                <select className="form-select form-control-premium" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                                    <option value="All">All Time</option>
                                    <option value="This Month">This Month</option>
                                    <option value="Last Month">Last Month</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content glass border border-white-10 rounded-5 overflow-hidden">
                            <div className="modal-header border-0 p-4">
                                <h5 className="modal-title fw-bold text-white ls-1">Financial Preferences</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSettings(false)}></button>
                            </div>
                            <form onSubmit={handleSettingsUpdate}>
                                <div className="modal-body p-4 pt-0">
                                    <div className="mb-4">
                                        <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">Pre-existing Balance</label>
                                        <div className="position-relative">
                                            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-accent fw-bold">{settingsData.currency}</span>
                                            <input
                                                type="number"
                                                className="form-control form-control-premium ps-5"
                                                value={settingsData.initial_balance}
                                                onChange={(e) => setSettingsData({ ...settingsData, initial_balance: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-muted xx-small fw-bold text-uppercase ls-2 mb-2 d-block">Preferred Currency</label>
                                        <div className="row g-2">
                                            {['$', '₹', '€', '£'].map(curr => (
                                                <div key={curr} className="col-3">
                                                    <button
                                                        type="button"
                                                        className={`btn w-100 rounded-3 py-3 ${settingsData.currency === curr ? 'btn-accent text-white' : 'btn-outline-secondary border-white-10 text-muted'}`}
                                                        onClick={() => setSettingsData({ ...settingsData, currency: curr })}
                                                    >
                                                        {curr}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 flex-column">
                                    <button type="submit" disabled={isSaving} className="btn btn-premium btn-primary-premium w-100 py-3">
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

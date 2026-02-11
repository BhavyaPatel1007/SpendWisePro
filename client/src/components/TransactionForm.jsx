import React, { useState, useEffect } from 'react';
import { addExpense, updateExpense } from '../services/api';
import { toast } from 'react-hot-toast';

const TransactionForm = ({ onSuccess, editingExpense, setEditingExpense, currency = '$' }) => {
    const [isExpense, setIsExpense] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const suggestCategory = (note) => {
        const text = note.toLowerCase();
        if (isExpense) {
            if (text.includes('taxi') || text.includes('uber') || text.includes('ola') || text.includes('petrol') || text.includes('bus')) return 'Travel';
            if (text.includes('lunch') || text.includes('dinner') || text.includes('food') || text.includes('burger') || text.includes('pizza') || text.includes('swiggy') || text.includes('zomato')) return 'Food';
            if (text.includes('rent') || text.includes('bill') || text.includes('electricity') || text.includes('water')) return 'Rent';
            if (text.includes('amazon') || text.includes('flipkart') || text.includes('buy') || text.includes('clothes')) return 'Shopping';
            if (text.includes('hospital') || text.includes('medicine') || text.includes('doctor')) return 'Health';
            if (text.includes('movie') || text.includes('netflix') || text.includes('game')) return 'Entertainment';
        } else {
            if (text.includes('salary') || text.includes('office') || text.includes('pay')) return 'Salary';
            if (text.includes('freelance') || text.includes('project') || text.includes('client')) return 'Freelance';
            if (text.includes('stock') || text.includes('crypto') || text.includes('profit') || text.includes('dividend')) return 'Investment';
            if (text.includes('gift') || text.includes('birthday') || text.includes('bonus')) return 'Gift';
        }
        return formData.category;
    };

    const handleNoteChange = (e) => {
        const note = e.target.value;
        const suggested = suggestCategory(note);

        // Smarter auto-toggle: Salary, Freelance, Investment, Gift are Income
        const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift'];
        if (incomeCategories.includes(suggested)) {
            setIsExpense(false);
        } else if (suggested !== formData.category) {
            setIsExpense(true);
        }

        setFormData({ ...formData, note, category: suggested });
    };

    useEffect(() => {
        if (editingExpense) {
            setIsExpense(editingExpense.amount < 0);
            setFormData({
                amount: Math.abs(editingExpense.amount),
                category: editingExpense.category,
                date: new Date(editingExpense.date).toISOString().split('T')[0],
                note: editingExpense.note || ''
            });
        }
    }, [editingExpense]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const amt = parseFloat(formData.amount);
        if (isNaN(amt) || amt <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setIsSaving(true);
        const type = isExpense ? 'expense' : 'income';
        const absoluteAmount = Math.abs(amt);
        const finalAmount = isExpense ? -absoluteAmount : absoluteAmount;

        try {
            if (editingExpense) {
                await updateExpense(editingExpense.id, { ...formData, amount: absoluteAmount, type });
                toast.success('Transaction updated successfully');
                setEditingExpense(null);
            } else {
                await addExpense({ ...formData, amount: absoluteAmount, type });
                toast.success('Transaction recorded successfully');
            }
            setFormData({
                amount: '',
                category: isExpense ? 'Food' : 'Salary',
                date: new Date().toISOString().split('T')[0],
                note: ''
            });
            onSuccess();
        } catch (err) {
            console.error('Error saving expense', err);
            const errMsg = err.response?.data?.message || 'Failed to save transaction';
            toast.error(errMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const isInvalid = !formData.amount || parseFloat(formData.amount) <= 0 || isSaving;

    return (
        <div className="card-premium p-4 glass">
            <div className="d-flex align-items-center mb-4">
                <div className="icon-box me-3 text-center d-flex align-items-center justify-content-center" style={{ background: 'rgba(255,255,255,0.05)', width: '42px', height: '42px', borderRadius: '12px' }}>
                    <i className={`fa-solid ${editingExpense ? 'fa-pen-to-square' : 'fa-plus'} text-accent`}></i>
                </div>
                <h6 className="mb-0 fw-bold text-white ls-1 text-uppercase small">{editingExpense ? 'Edit Entry' : 'Quick Add'}</h6>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Type Toggle */}
                <div className="btn-group w-100 mb-4 bg-primary-dark p-1 rounded-3" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        type="button"
                        className={`btn btn-sm py-2 rounded-2 border-0 transition-all ${isExpense ? 'bg-danger text-white shadow-sm' : 'text-muted'}`}
                        onClick={() => { setIsExpense(true); setFormData({ ...formData, category: 'Food' }); }}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm py-2 rounded-2 border-0 transition-all ${!isExpense ? 'bg-success text-white shadow-sm' : 'text-muted'}`}
                        onClick={() => { setIsExpense(false); setFormData({ ...formData, category: 'Salary' }); }}
                    >
                        Income
                    </button>
                </div>

                <div className="mb-3">
                    <label className="xx-small text-muted ls-1 text-uppercase fw-bold mb-1 d-block">What was this for?</label>
                    <input
                        type="text"
                        className="form-control-premium w-100 x-small"
                        value={formData.note}
                        required
                        placeholder="Description..."
                        onChange={handleNoteChange}
                    />
                </div>

                <div className="row g-2 mb-3">
                    <div className="col-7">
                        <label className="xx-small text-muted ls-1 text-uppercase fw-bold mb-1 d-block">Amount</label>
                        <div className="input-group">
                            <span className="input-group-text border-0 ps-3 bg-primary-dark text-muted x-small" style={{ borderRadius: '12px 0 0 12px' }}>{currency}</span>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control-premium flex-grow-1 small"
                                style={{ borderRadius: '0 12px 12px 0' }}
                                value={formData.amount}
                                required
                                placeholder="0.00"
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="col-5">
                        <label className="xx-small text-muted ls-1 text-uppercase fw-bold mb-1 d-block">Date</label>
                        <input
                            type="date"
                            className="form-control-premium w-100 small px-2"
                            value={formData.date}
                            required
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="xx-small text-muted ls-1 text-uppercase fw-bold mb-1 d-block">Category</label>
                    <select
                        className="form-select form-control-premium w-100 border-0 small"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ appearance: 'auto' }}
                    >
                        {isExpense ? (
                            <>
                                <option value="Food">🍽️ Food & Dining</option>
                                <option value="Rent">🏠 Rent & Utilities</option>
                                <option value="Travel">🚗 Transport / Petrol</option>
                                <option value="Shopping">🛍️ Shopping</option>
                                <option value="Health">💊 Health & Medical</option>
                                <option value="Entertainment">🎬 Entertainment</option>
                                <option value="Other">✨ Other</option>
                            </>
                        ) : (
                            <>
                                <option value="Salary">💰 Monthly Salary</option>
                                <option value="Freelance">💻 Freelance / Project</option>
                                <option value="Investment">📈 Investments / Crypto</option>
                                <option value="Gift">🎁 Gift / Bonus</option>
                                <option value="Other">✨ Other</option>
                            </>
                        )}
                    </select>
                </div>

                <button type="submit" disabled={isInvalid} className="btn btn-premium btn-primary-premium w-100 py-3 shadow-lg d-flex align-items-center justify-content-center" style={{ opacity: isInvalid ? 0.6 : 1 }}>
                    {isSaving ? (
                        <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                        <span className="fw-bold small">{editingExpense ? 'Save Changes' : 'Record Transaction'}</span>
                    )}
                </button>

                {editingExpense && (
                    <button
                        type="button"
                        className="btn btn-link w-100 mt-2 text-decoration-none text-muted xx-small ls-1 text-uppercase fw-bold"
                        onClick={() => setEditingExpense(null)}
                    >
                        Discard
                    </button>
                )}
            </form>
        </div>
    );
};

export default TransactionForm;

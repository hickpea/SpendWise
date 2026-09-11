import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['income', 'expense'], default: 'expense' },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

const goalSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    target: { type: Number, required: true, min: 0 },
    saved: { type: Number, default: 0, min: 0 },
    color: { type: String, default: 'blue' }
}, { _id: true });

const billSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    category: { type: String, default: 'Other', trim: true }
}, { _id: true });

const dashboardSchema = new mongoose.Schema({
    owner: { type: String, default: 'default', unique: true },
    transactions: { type: [transactionSchema], default: [] },
    goals: { type: [goalSchema], default: [] },
    bills: { type: [billSchema], default: [] }
}, { timestamps: true });

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
const defaultDashboard = {
    owner: 'default',
    transactions: [
        { name: 'Grocery Store', category: 'Shopping', amount: 120, type: 'expense' },
        { name: 'Monthly Rent', category: 'Housing', amount: 1200, type: 'expense' },
        { name: 'Gym Membership', category: 'Fitness', amount: 45, type: 'expense' },
        { name: 'Salary', category: 'Income', amount: 5200, type: 'income' }
    ],
    goals: [
        { name: 'Vacation Fund', target: 5000, saved: 3000, color: 'blue' },
        { name: 'Emergency Fund', target: 10000, saved: 3400, color: 'green' }
    ],
    bills: [
        { name: 'Internet Bill', amount: 80, category: 'Utilities', dueDate: new Date('2026-09-25') },
        { name: 'Car Insurance', amount: 150, category: 'Insurance', dueDate: new Date('2026-10-10') }
    ]
};

async function getDashboard() {
    let dashboard = await Dashboard.findOne({ owner: 'default' });
    if (!dashboard) dashboard = await Dashboard.create(defaultDashboard);
    return dashboard;
}

export { Dashboard, getDashboard };
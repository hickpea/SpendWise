import { getDashboard } from '../models/models.js';

const home = async (req, res, next) => {
    try {
        const dashboard = await getDashboard();
        res.render('home', { dashboard: dashboard.toObject() });
    } catch (error) { next(error); }
}

const dashboardApi = async (req, res, next) => {
    try {
        const dashboard = await getDashboard();
        const income = dashboard.transactions.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
        const expenses = dashboard.transactions.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
        res.json({ dashboard, metrics: { income, expenses, balance: income - expenses, savings: income - expenses } });
    } catch (error) { next(error); }
}

const addTransaction = async (req, res, next) => {
    try {
        const { name, category, amount, type } = req.body;
        if (!name || !category || !Number.isFinite(Number(amount)) || Number(amount) < 0) return res.status(400).json({ error: 'name, category, and a non-negative amount are required' });
        const dashboard = await getDashboard();
        dashboard.transactions.unshift({ name, category, amount: Number(amount), type: type === 'income' ? 'income' : 'expense' });
        await dashboard.save();
        res.status(201).json(dashboard.transactions[0]);
    } catch (error) { next(error); }
};

const addGoal = async (req, res, next) => {
    try {
        const { name, target, saved = 0, color = 'blue' } = req.body;
        if (!name || !Number.isFinite(Number(target)) || Number(target) <= 0) return res.status(400).json({ error: 'name and a positive target are required' });
        const dashboard = await getDashboard();
        dashboard.goals.push({ name, target: Number(target), saved: Number(saved), color });
        await dashboard.save();
        res.status(201).json(dashboard.goals.at(-1));
    } catch (error) { next(error); }
};

const addBill = async (req, res, next) => {
    try {
        const { name, amount, dueDate, category = 'Other' } = req.body;
        if (!name || !dueDate || !Number.isFinite(Number(amount)) || Number(amount) < 0) return res.status(400).json({ error: 'name, amount, and dueDate are required' });
        const dashboard = await getDashboard();
        dashboard.bills.push({ name, amount: Number(amount), dueDate: new Date(dueDate), category });
        await dashboard.save();
        res.status(201).json(dashboard.bills.at(-1));
    } catch (error) { next(error); }
};

const deleteItem = async (req, res, next) => {
    try {
        const dashboard = await getDashboard();
        const collection = req.params.collection;
        if (!['transactions', 'goals', 'bills'].includes(collection)) return res.status(400).json({ error: 'Invalid collection' });
        const before = dashboard[collection].length;
        dashboard[collection].pull(req.params.id);
        if (dashboard[collection].length === before) return res.status(404).json({ error: 'Item not found' });
        await dashboard.save();
        res.status(204).end();
    } catch (error) { next(error); }
};

export { home, dashboardApi, addTransaction, addGoal, addBill, deleteItem };

const requestJson = async (url, options) => {
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
    const body = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(body?.error || 'Request failed');
    return body;
};

const addTransaction = async () => {
    const name = window.prompt('Transaction name');
    if (!name) return;
    const amount = window.prompt('Amount');
    const category = window.prompt('Category', 'Other');
    const type = window.confirm('Click OK for income, Cancel for expense') ? 'income' : 'expense';
    await requestJson('/api/transactions', { method: 'POST', body: JSON.stringify({ name, amount, category, type }) });
    window.location.reload();
};

const addGoal = async () => {
    const name = window.prompt('Goal name');
    if (!name) return;
    const target = window.prompt('Target amount');
    const saved = window.prompt('Amount already saved', '0');
    await requestJson('/api/goals', { method: 'POST', body: JSON.stringify({ name, target, saved }) });
    window.location.reload();
};

const addBill = async () => {
    const name = window.prompt('Bill name');
    if (!name) return;
    const amount = window.prompt('Amount');
    const dueDate = window.prompt('Due date (YYYY-MM-DD)');
    const category = window.prompt('Category', 'Other');
    await requestJson('/api/bills', { method: 'POST', body: JSON.stringify({ name, amount, dueDate, category }) });
    window.location.reload();
};

document.addEventListener('click', async event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    try {
        if (action === 'add-transaction') await addTransaction();
        if (action === 'add-goal') await addGoal();
        if (action === 'add-bill') await addBill();
    } catch (error) {
        window.alert(error.message);
    }
});
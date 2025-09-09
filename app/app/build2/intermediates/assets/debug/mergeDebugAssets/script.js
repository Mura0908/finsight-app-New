// FinSight Budget App JavaScript

// Data arrays
let incomes = [];
let expenses = [];
let budgets = [];
let goals = [];
let debts = [];
let repayments = [];

// DOM Elements
const tabButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const incomeFormContainer = document.getElementById('income-form-container');
const expenseFormContainer = document.getElementById('expense-form-container');
const budgetFormContainer = document.getElementById('budget-form-container');
const goalFormContainer = document.getElementById('goal-form-container');
const debtFormContainer = document.getElementById('debt-form-container');
const repaymentFormContainer = document.getElementById('repayment-form-container');
const repaymentPasswordSection = document.getElementById('repayment-password-section');
const repaymentsList = document.getElementById('repayments-list');

// Form elements
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const budgetForm = document.getElementById('budget-form');
const goalForm = document.getElementById('goal-form');
const debtForm = document.getElementById('debt-form');
const repaymentForm = document.getElementById('repayment-form');

// Button elements
const addIncomeBtn = document.getElementById('add-income-btn');
const addExpenseBtn = document.getElementById('add-expense-btn');
const addBudgetBtn = document.getElementById('add-budget-btn');
const addGoalBtn = document.getElementById('add-goal-btn');
const addDebtBtn = document.getElementById('add-debt-btn');
const addRepaymentBtn = document.getElementById('add-repayment-btn');

const cancelIncomeBtn = document.getElementById('cancel-income-btn');
const cancelExpenseBtn = document.getElementById('cancel-expense-btn');
const cancelBudgetBtn = document.getElementById('cancel-budget-btn');
const cancelGoalBtn = document.getElementById('cancel-goal-btn');
const cancelDebtBtn = document.getElementById('cancel-debt-btn');
const cancelRepaymentBtn = document.getElementById('cancel-repayment-btn');

// Password protection elements
const repaymentPasswordInput = document.getElementById('repayment-password');
const repaymentPasswordSetupInput = document.getElementById('repayment-password-setup');
const repaymentPasswordBtn = document.getElementById('repayment-password-btn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadFromLocalStorage();
    updateDashboard();
});

// Initialize the app
function initializeApp() {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('income-date').value = today;
    document.getElementById('expense-date').value = today;
    document.getElementById('budget-form').querySelector('#budget-period').value = 'monthly';
    
    // Set min date for goals and debts
    document.getElementById('goal-deadline').min = today;
    document.getElementById('debt-start-date').value = today;
}

// Set up event listeners
function setupEventListeners() {
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // Form toggles
    addIncomeBtn.addEventListener('click', () => toggleForm(incomeFormContainer));
    addExpenseBtn.addEventListener('click', () => toggleForm(expenseFormContainer));
    addBudgetBtn.addEventListener('click', () => toggleForm(budgetFormContainer));
    addGoalBtn.addEventListener('click', () => toggleForm(goalFormContainer));
    addDebtBtn.addEventListener('click', () => toggleForm(debtFormContainer));
    addRepaymentBtn.addEventListener('click', () => toggleForm(repaymentFormContainer));
    
    // Cancel buttons
    cancelIncomeBtn.addEventListener('click', () => toggleForm(incomeFormContainer));
    cancelExpenseBtn.addEventListener('click', () => toggleForm(expenseFormContainer));
    cancelBudgetBtn.addEventListener('click', () => toggleForm(budgetFormContainer));
    cancelGoalBtn.addEventListener('click', () => toggleForm(goalFormContainer));
    cancelDebtBtn.addEventListener('click', () => toggleForm(debtFormContainer));
    cancelRepaymentBtn.addEventListener('click', () => toggleForm(repaymentFormContainer));
    
    // Form submissions
    incomeForm.addEventListener('submit', handleIncomeSubmit);
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    budgetForm.addEventListener('submit', handleBudgetSubmit);
    goalForm.addEventListener('submit', handleGoalSubmit);
    debtForm.addEventListener('submit', handleDebtSubmit);
    repaymentForm.addEventListener('submit', handleRepaymentSubmit);
    
    // Password protection for repayments
    repaymentPasswordBtn.addEventListener('click', handleRepaymentPassword);
    
    // Dashboard period selector
    document.getElementById('dashboard-period').addEventListener('change', updateDashboard);
    
    // Report period selector
    document.getElementById('report-period').addEventListener('change', updateReports);
}

// Update debts list
function updateDebtsList() {
    const container = document.getElementById('debts-list');
    
    if (debts.length === 0) {
        container.innerHTML = '<p class="no-data">Geen schulden geregistreerd</p>';
        return;
    }
    
    container.innerHTML = '';
    debts.forEach(debt => {
        const percentage = Math.min(100, (debt.paid / debt.amount) * 100);
        const remaining = debt.amount - debt.paid;
        
        const debtCard = document.createElement('div');
        debtCard.className = 'debt-card';
        debtCard.innerHTML = `
            <div class="debt-header">
                <h3>${debt.name}</h3>
                <span class="debt-status">${percentage >= 100 ? 'Afgelost' : 'Openstaand'}</span>
            </div>
            <div class="debt-amount">€${debt.paid.toFixed(2)} / €${debt.amount.toFixed(2)}</div>
            <div class="debt-details">
                <div>Crediteur: ${debt.creditor}</div>
                <div>Rente: ${debt.interest}%</div>
            </div>
            <div class="debt-details">
                <div>Maandelijkse afbetaling: €${debt.monthlyPayment.toFixed(2)}</div>
                <div>Resterend: €${remaining.toFixed(2)}</div>
            </div>
            <div class="debt-actions">
                <button class="pay-btn" onclick="makePayment(${debt.id})"><i class="fas fa-euro-sign"></i> Betalen</button>
                <button class="edit-btn" onclick="editDebt(${debt.id})"><i class="fas fa-edit"></i> Bewerken</button>
                <button class="delete-btn" onclick="deleteDebt(${debt.id})"><i class="fas fa-trash"></i> Verwijderen</button>
            </div>
        `;
        container.appendChild(debtCard);
    });
}

// Update repayments list
function updateRepaymentsList() {
    const container = document.getElementById('repayments-list');
    
    if (repayments.length === 0) {
        container.innerHTML = '<p class="no-data">Geen terugbetalingen geregistreerd</p>';
        return;
    }
    
    container.innerHTML = '';
    repayments.forEach(repayment => {
        const repaymentCard = document.createElement('div');
        repaymentCard.className = 'repayment-card';
        repaymentCard.innerHTML = `
            <div class="repayment-header">
                <h3>${repayment.person}</h3>
                <span class="repayment-status status-${repayment.type}">${repayment.type === 'owed-to-me' ? 'Schuld aan mij' : 'Schuld van mij'}</span>
            </div>
            <div class="repayment-amount ${repayment.type === 'owed-to-me' ? 'owed-to-me-amount' : 'owed-by-me-amount'}">
                €${repayment.amount.toFixed(2)}
            </div>
            <div class="repayment-details">
                <div>Datum: ${formatDate(repayment.date)}</div>
                <div>Type: ${repayment.type === 'owed-to-me' ? 'Te ontvangen' : 'Te betalen'}</div>
            </div>
            ${repayment.description ? `<div class="repayment-description">${repayment.description}</div>` : ''}
            <div class="repayment-actions">
                ${repayment.type === 'owed-by-me' ? `<button class="pay-btn" onclick="markAsPaid(${repayment.id})"><i class="fas fa-check"></i> Betaald</button>` : ''}
                <button class="edit-btn" onclick="editRepayment(${repayment.id})"><i class="fas fa-edit"></i> Bewerken</button>
                <button class="delete-btn" onclick="deleteRepayment(${repayment.id})"><i class="fas fa-trash"></i> Verwijderen</button>
            </div>
        `;
        container.appendChild(repaymentCard);
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Update active tab button
    tabButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Show active tab content
    tabContents.forEach(content => {
        if (content.id === tabName) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Close all forms when switching tabs
    closeAllForms();
    
    // Special handling for repayments tab
    if (tabName === 'repayments') {
        // Check if password is already entered
        const storedPassword = localStorage.getItem('finsight_repayment_password');
        const accessGranted = sessionStorage.getItem('repayment_access_granted');
        
        if (storedPassword && accessGranted === 'true') {
            repaymentPasswordSection.style.display = 'none';
            repaymentFormContainer.classList.add('active');
            repaymentsList.classList.add('active');
            updateRepaymentsList();
        } else {
            repaymentPasswordSection.style.display = 'block';
            repaymentFormContainer.classList.remove('active');
            repaymentsList.classList.remove('active');
            // Clear password fields
            repaymentPasswordInput.value = '';
            repaymentPasswordSetupInput.value = '';
        }
    }
    
    // Update the view based on the active tab
    switch(tabName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'income':
            updateIncomeTable();
            break;
        case 'expenses':
            updateExpenseTable();
            break;
        case 'budgets':
            updateBudgetsList();
            break;
        case 'goals':
            updateGoalsList();
            break;
        case 'debts':
            updateDebtsList();
            break;
        case 'repayments':
            // Handled above
            break;
        case 'reports':
            updateReports();
            break;
    }
}

// Handle income form submission
function handleIncomeSubmit(e) {
    e.preventDefault();
    
    const income = {
        id: Date.now(),
        description: document.getElementById('income-description').value,
        amount: parseFloat(document.getElementById('income-amount').value),
        category: document.getElementById('income-category').value,
        date: document.getElementById('income-date').value,
        frequency: document.getElementById('income-frequency').value,
        source: document.getElementById('income-source').value
    };
    
    incomes.push(income);
    saveToLocalStorage();
    updateIncomeTable();
    updateDashboard();
    
    // Reset form and hide it
    incomeForm.reset();
    document.getElementById('income-date').value = new Date().toISOString().split('T')[0];
    toggleForm(incomeFormContainer);
}

// Handle expense form submission
function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const expense = {
        id: Date.now(),
        description: document.getElementById('expense-description').value,
        amount: parseFloat(document.getElementById('expense-amount').value),
        category: document.getElementById('expense-category').value,
        date: document.getElementById('expense-date').value,
        paymentMethod: document.getElementById('expense-payment-method').value
    };
    
    expenses.push(expense);
    saveToLocalStorage();
    updateExpenseTable();
    updateDashboard();
    
    // Reset form and hide it
    expenseForm.reset();
    document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
    toggleForm(expenseFormContainer);
}

// Handle budget form submission
function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const budget = {
        id: Date.now(),
        name: document.getElementById('budget-name').value,
        amount: parseFloat(document.getElementById('budget-amount').value),
        category: document.getElementById('budget-category').value,
        period: document.getElementById('budget-period').value,
        used: 0 // Initialize used amount to 0
    };
    
    // Calculate used amount based on existing expenses in this category
    const categoryExpenses = expenses.filter(expense => expense.category === budget.category);
    budget.used = categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
    
    budgets.push(budget);
    saveToLocalStorage();
    updateBudgetsList();
    updateDashboard();
    
    // Reset form and hide it
    budgetForm.reset();
    toggleForm(budgetFormContainer);
}

// Handle goal form submission
function handleGoalSubmit(e) {
    e.preventDefault();
    
    const goal = {
        id: Date.now(),
        name: document.getElementById('goal-name').value,
        target: parseFloat(document.getElementById('goal-target').value),
        deadline: document.getElementById('goal-deadline').value,
        monthlyAmount: parseFloat(document.getElementById('goal-monthly-amount').value) || 0,
        description: document.getElementById('goal-description').value,
        saved: 0 // Initialize saved amount to 0
    };
    
    goals.push(goal);
    saveToLocalStorage();
    updateGoalsList();
    updateDashboard();
    
    // Reset form and hide it
    goalForm.reset();
    toggleForm(goalFormContainer);
}

// Handle debt form submission
function handleDebtSubmit(e) {
    e.preventDefault();
    
    const debt = {
        id: Date.now(),
        name: document.getElementById('debt-name').value,
        amount: parseFloat(document.getElementById('debt-amount').value),
        creditor: document.getElementById('debt-creditor').value,
        interest: parseFloat(document.getElementById('debt-interest').value) || 0,
        startDate: document.getElementById('debt-start-date').value,
        endDate: document.getElementById('debt-end-date').value,
        monthlyPayment: parseFloat(document.getElementById('debt-monthly-payment').value),
        paid: 0 // Initialize paid amount to 0
    };
    
    debts.push(debt);
    saveToLocalStorage();
    updateDebtsList();
    updateDashboard();
    
    // Reset form and hide it
    debtForm.reset();
    document.getElementById('debt-start-date').value = new Date().toISOString().split('T')[0];
    toggleForm(debtFormContainer);
}

// Handle repayment form submission
function handleRepaymentSubmit(e) {
    e.preventDefault();
    
    const repayment = {
        id: Date.now(),
        person: document.getElementById('repayment-person').value,
        amount: parseFloat(document.getElementById('repayment-amount').value),
        date: document.getElementById('repayment-date').value,
        type: document.getElementById('repayment-type').value,
        description: document.getElementById('repayment-description').value
    };
    
    repayments.push(repayment);
    saveToLocalStorage();
    updateRepaymentsList();
    updateDashboard();
    
    // Reset form and hide it
    repaymentForm.reset();
    document.getElementById('repayment-date').value = new Date().toISOString().split('T')[0];
    toggleForm(repaymentFormContainer);
}

// Handle repayment password protection
function handleRepaymentPassword() {
    const password = repaymentPasswordInput.value;
    const setupPassword = repaymentPasswordSetupInput.value;
    
    // Get stored password
    const storedPassword = localStorage.getItem('finsight_repayment_password');
    
    // If no password is set and user is setting one
    if (!storedPassword && setupPassword) {
        localStorage.setItem('finsight_repayment_password', setupPassword);
        sessionStorage.setItem('repayment_access_granted', 'true');
        showRepaymentSection();
        return;
    }
    
    // If password is set and user entered correct password
    if (storedPassword && password === storedPassword) {
        sessionStorage.setItem('repayment_access_granted', 'true');
        showRepaymentSection();
        return;
    }
    
    // If password is set but user entered wrong password
    if (storedPassword && password !== storedPassword) {
        alert('Onjuist wachtwoord!');
        return;
    }
    
    // If no password is set and user didn't enter setup password
    if (!storedPassword && !setupPassword) {
        alert('Stel eerst een wachtwoord in!');
        return;
    }
}

// Show repayment section after successful password entry
function showRepaymentSection() {
    repaymentPasswordSection.style.display = 'none';
    repaymentFormContainer.classList.add('active');
    repaymentsList.classList.add('active');
    updateRepaymentsList();
}

// Toggle form visibility
function toggleForm(formContainer) {
    formContainer.classList.toggle('active');
}

// Close all forms
function closeAllForms() {
    incomeFormContainer.classList.remove('active');
    expenseFormContainer.classList.remove('active');
    budgetFormContainer.classList.remove('active');
    goalFormContainer.classList.remove('active');
    debtFormContainer.classList.remove('active');
    repaymentFormContainer.classList.remove('active');
}

// Update income table
function updateIncomeTable() {
    const tbody = document.getElementById('income-table-body');
    
    if (incomes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Geen inkomsten gevonden</td></tr>';
        return;
    }
    
    // Sort incomes by date (newest first)
    const sortedIncomes = [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = '';
    sortedIncomes.forEach(income => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(income.date)}</td>
            <td>${income.description}</td>
            <td>${getCategoryName(income.category)}</td>
            <td>${income.source || '-'}</td>
            <td>€${income.amount.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editIncome(${income.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteIncome(${income.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update expense table
function updateExpenseTable() {
    const tbody = document.getElementById('expense-table-body');
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Geen uitgaven gevonden</td></tr>';
        return;
    }
    
    // Sort expenses by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = '';
    sortedExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.description}</td>
            <td>${getCategoryName(expense.category)}</td>
            <td>${getPaymentMethodName(expense.paymentMethod)}</td>
            <td>€${expense.amount.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editExpense(${expense.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update budgets list
function updateBudgetsList() {
    const container = document.getElementById('budgets-list');
    
    if (budgets.length === 0) {
        container.innerHTML = '<p class="no-data">Geen budgetten ingesteld</p>';
        return;
    }
    
    container.innerHTML = '';
    budgets.forEach(budget => {
        const percentage = Math.min(100, (budget.used / budget.amount) * 100);
        const progressBarClass = percentage < 70 ? 'safe' : percentage < 90 ? 'warning' : 'danger';
        
        const budgetCard = document.createElement('div');
        budgetCard.className = 'budget-card';
        budgetCard.innerHTML = `
            <div class="budget-header">
                <h3>${budget.name}</h3>
                <span class="budget-category">${getCategoryName(budget.category)}</span>
            </div>
            <div class="budget-amount">€${budget.used.toFixed(2)} / €${budget.amount.toFixed(2)}</div>
            <div class="budget-progress">
                <div class="budget-progress-bar ${progressBarClass}" style="width: ${percentage}%"></div>
            </div>
            <div class="budget-details">
                <span>${percentage.toFixed(1)}% gebruikt</span>
                <span>${budget.period === 'weekly' ? 'Wekelijks' : budget.period === 'monthly' ? 'Maandelijks' : 'Jaarlijks'}</span>
            </div>
            <div class="budget-actions">
                <button class="edit-btn" onclick="editBudget(${budget.id})"><i class="fas fa-edit"></i> Bewerken</button>
                <button class="delete-btn" onclick="deleteBudget(${budget.id})"><i class="fas fa-trash"></i> Verwijderen</button>
            </div>
        `;
        container.appendChild(budgetCard);
    });
}

// Update goals list
function updateGoalsList() {
    const container = document.getElementById('goals-list');
    
    if (goals.length === 0) {
        container.innerHTML = '<p class="no-data">Geen spaardoelen ingesteld</p>';
        return;
    }
    
    container.innerHTML = '';
    goals.forEach(goal => {
        const percentage = Math.min(100, (goal.saved / goal.target) * 100);
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        const isCompleted = percentage >= 100;
        
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        goalCard.innerHTML = `
            <div class="goal-header">
                <h3>${goal.name}</h3>
                ${isCompleted ? '<span class="completed-badge">Voltooid</span>' : ''}
            </div>
            <div class="goal-amount">€${goal.saved.toFixed(2)} / €${goal.target.toFixed(2)}</div>
            <div class="goal-progress">
                <div class="goal-progress-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="goal-details">
                <span>${percentage.toFixed(1)}% voltooid</span>
                <div class="goal-deadline">
                    <i class="fas fa-calendar"></i>
                    <span>${daysLeft > 0 ? `${daysLeft} dagen` : 'Vandaag'} resterend</span>
                </div>
            </div>
            <div class="goal-actions">
                <button class="pay-btn" onclick="addToGoal(${goal.id})"><i class="fas fa-plus"></i> Geld toevoegen</button>
                <button class="edit-btn" onclick="editGoal(${goal.id})"><i class="fas fa-edit"></i> Bewerken</button>
                <button class="delete-btn" onclick="deleteGoal(${goal.id})"><i class="fas fa-trash"></i> Verwijderen</button>
            </div>
        `;
        container.appendChild(goalCard);
    });
}

// Update dashboard
function updateDashboard() {
    // Calculate totals
    const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    // Calculate savings (goal savings)
    const totalSavings = goals.reduce((total, goal) => total + goal.saved, 0);
    
    // Update summary cards
    document.getElementById('total-income').textContent = `€${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `€${totalExpenses.toFixed(2)}`;
    document.getElementById('current-balance').textContent = `€${balance.toFixed(2)}`;
    document.getElementById('total-savings').textContent = `€${totalSavings.toFixed(2)}`;
    
    // Update recent transactions
    updateRecentTransactions();
    
    // Update charts
    updateCharts();
}

// Update recent transactions
function updateRecentTransactions() {
    const container = document.getElementById('recent-transactions-list');
    
    // Combine and sort all transactions
    const allTransactions = [
        ...incomes.map(income => ({ ...income, type: 'income' })),
        ...expenses.map(expense => ({ ...expense, type: 'expense' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    if (allTransactions.length === 0) {
        container.innerHTML = '<p class="no-data">Geen transacties gevonden</p>';
        return;
    }
    
    container.innerHTML = '';
    allTransactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        transactionItem.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-category">${getCategoryName(transaction.category)}</div>
                <div class="transaction-date">${formatDate(transaction.date)}</div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}€${transaction.amount.toFixed(2)}
            </div>
        `;
        container.appendChild(transactionItem);
    });
}

// Update charts
function updateCharts() {
    // Destroy existing charts if they exist
    if (window.incomeExpenseChart) {
        window.incomeExpenseChart.destroy();
    }
    
    if (window.expenseCategoryChart) {
        window.expenseCategoryChart.destroy();
    }
    
    // Get period from selector
    const period = document.getElementById('dashboard-period').value;
    
    // Prepare data for income vs expense chart
    const incomeExpenseData = getIncomeExpenseData(period);
    
    // Create income vs expense chart
    const incomeExpenseCtx = document.getElementById('income-expense-chart').getContext('2d');
    window.incomeExpenseChart = new Chart(incomeExpenseCtx, {
        type: 'bar',
        data: {
            labels: incomeExpenseData.labels,
            datasets: [
                {
                    label: 'Inkomsten',
                    data: incomeExpenseData.incomes,
                    backgroundColor: 'rgba(56, 182, 255, 0.7)',
                    borderColor: 'rgba(56, 182, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Uitgaven',
                    data: incomeExpenseData.expenses,
                    backgroundColor: 'rgba(247, 37, 133, 0.7)',
                    borderColor: 'rgba(247, 37, 133, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value;
                        }
                    }
                }
            }
        }
    });
    
    // Prepare data for expense category chart
    const expenseCategoryData = getExpenseCategoryData();
    
    // Create expense category chart
    const expenseCategoryCtx = document.getElementById('expense-category-chart').getContext('2d');
    window.expenseCategoryChart = new Chart(expenseCategoryCtx, {
        type: 'doughnut',
        data: {
            labels: expenseCategoryData.labels,
            datasets: [{
                data: expenseCategoryData.values,
                backgroundColor: [
                    '#4361ee',
                    '#3a0ca3',
                    '#4cc9f0',
                    '#f72585',
                    '#7209b7',
                    '#3f37c9',
                    '#4895ef',
                    '#4cc9f0'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Get income vs expense data for chart
function getIncomeExpenseData(period) {
    const labels = [];
    const incomesData = [];
    const expensesData = [];
    
    const today = new Date();
    
    if (period === 'week') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = formatDate(date.toISOString().split('T')[0]);
            labels.push(dateStr);
            
            const dateKey = date.toISOString().split('T')[0];
            const dayIncomes = incomes.filter(income => income.date === dateKey);
            const dayExpenses = expenses.filter(expense => expense.date === dateKey);
            
            incomesData.push(dayIncomes.reduce((total, income) => total + income.amount, 0));
            expensesData.push(dayExpenses.reduce((total, expense) => total + expense.amount, 0));
        }
    } else if (period === 'month') {
        // This month by week
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        for (let i = 0; i < 4; i++) {
            const startWeek = new Date(firstDay);
            startWeek.setDate(firstDay.getDate() + i * 7);
            
            const endWeek = new Date(startWeek);
            endWeek.setDate(startWeek.getDate() + 6);
            
            if (startWeek > lastDay) break;
            
            if (endWeek > lastDay) endWeek.setDate(lastDay.getDate());
            
            labels.push(`Week ${i + 1}`);
            
            const weekIncomes = incomes.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate >= startWeek && incomeDate <= endWeek;
            });
            
            const weekExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startWeek && expenseDate <= endWeek;
            });
            
            incomesData.push(weekIncomes.reduce((total, income) => total + income.amount, 0));
            expensesData.push(weekExpenses.reduce((total, expense) => total + expense.amount, 0));
        }
    } else {
        // This year by month
        for (let i = 0; i < 12; i++) {
            const month = new Date(today.getFullYear(), i, 1);
            labels.push(month.toLocaleString('nl-NL', { month: 'short' }));
            
            const monthIncomes = incomes.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate.getMonth() === i && incomeDate.getFullYear() === today.getFullYear();
            });
            
            const monthExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === i && expenseDate.getFullYear() === today.getFullYear();
            });
            
            incomesData.push(monthIncomes.reduce((total, income) => total + income.amount, 0));
            expensesData.push(monthExpenses.reduce((total, expense) => total + expense.amount, 0));
        }
    }
    
    return { labels, incomes: incomesData, expenses: expensesData };
}

// Get expense category data for chart
function getExpenseCategoryData() {
    const categoryTotals = {};
    
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });
    
    const labels = Object.keys(categoryTotals).map(category => getCategoryName(category));
    const values = Object.values(categoryTotals);
    
    return { labels, values };
}

// Update reports
function updateReports() {
    // Calculate report data
    const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const netResult = totalIncome - totalExpenses;
    
    // Find highest expense category
    const categoryExpenses = {};
    expenses.forEach(expense => {
        if (!categoryExpenses[expense.category]) {
            categoryExpenses[expense.category] = 0;
        }
        categoryExpenses[expense.category] += expense.amount;
    });
    
    let highestCategory = '';
    let highestAmount = 0;
    for (const [category, amount] of Object.entries(categoryExpenses)) {
        if (amount > highestAmount) {
            highestAmount = amount;
            highestCategory = getCategoryName(category);
        }
    }
    
    // Calculate average monthly expenses
    const months = new Set(expenses.map(expense => expense.date.substring(0, 7))).size;
    const avgMonthlyExpenses = months > 0 ? totalExpenses / months : 0;
    
    // Find most common expenses
    const expenseDescriptions = {};
    expenses.forEach(expense => {
        if (!expenseDescriptions[expense.description]) {
            expenseDescriptions[expense.description] = 0;
        }
        expenseDescriptions[expense.description]++;
    });
    
    let mostCommonExpense = '';
    let maxCount = 0;
    for (const [description, count] of Object.entries(expenseDescriptions)) {
        if (count > maxCount) {
            maxCount = count;
            mostCommonExpense = description;
        }
    }
    
    // Budget compliance
    const withinLimit = budgets.filter(budget => budget.used <= budget.amount).length;
    const exceeded = budgets.filter(budget => budget.used > budget.amount).length;
    const avgCompliance = budgets.length > 0 ? 
        (budgets.reduce((total, budget) => total + Math.min(100, (budget.used / budget.amount) * 100), 0) / budgets.length).toFixed(1) : 0;
    
    // Update report elements
    document.getElementById('report-total-income').textContent = `€${totalIncome.toFixed(2)}`;
    document.getElementById('report-total-expenses').textContent = `€${totalExpenses.toFixed(2)}`;
    document.getElementById('report-net-result').textContent = `€${netResult.toFixed(2)}`;
    document.getElementById('highest-expense-category').textContent = highestCategory || '-';
    document.getElementById('avg-monthly-expenses').textContent = `€${avgMonthlyExpenses.toFixed(2)}`;
    document.getElementById('most-common-expenses').textContent = mostCommonExpense || '-';
    document.getElementById('budgets-within-limit').textContent = withinLimit;
    document.getElementById('budgets-exceeded').textContent = exceeded;
    document.getElementById('avg-budget-compliance').textContent = `${avgCompliance}%`;
    
    // Update trend analysis chart
    updateTrendChart();
}

// Update trend analysis chart
function updateTrendChart() {
    // Destroy existing chart if it exists
    if (window.trendAnalysisChart) {
        window.trendAnalysisChart.destroy();
    }
    
    // Get period from selector
    const period = document.getElementById('report-period').value;
    
    // Prepare data for trend chart
    const trendData = getTrendData(period);
    
    // Create trend analysis chart
    const trendCtx = document.getElementById('trend-analysis-chart').getContext('2d');
    window.trendAnalysisChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: trendData.labels,
            datasets: [
                {
                    label: 'Inkomsten',
                    data: trendData.incomes,
                    borderColor: 'rgba(56, 182, 255, 1)',
                    backgroundColor: 'rgba(56, 182, 255, 0.2)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Uitgaven',
                    data: trendData.expenses,
                    borderColor: 'rgba(247, 37, 133, 1)',
                    backgroundColor: 'rgba(247, 37, 133, 0.2)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Saldo',
                    data: trendData.balances,
                    borderColor: 'rgba(67, 97, 238, 1)',
                    backgroundColor: 'rgba(67, 97, 238, 0.2)',
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value;
                        }
                    }
                }
            }
        }
    });
}

// Get trend data for chart
function getTrendData(period) {
    const labels = [];
    const incomesData = [];
    const expensesData = [];
    const balancesData = [];
    
    const today = new Date();
    
    if (period === 'month') {
        // This month by week
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        for (let i = 0; i < 4; i++) {
            const startWeek = new Date(firstDay);
            startWeek.setDate(firstDay.getDate() + i * 7);
            
            const endWeek = new Date(startWeek);
            endWeek.setDate(startWeek.getDate() + 6);
            
            if (startWeek > lastDay) break;
            
            if (endWeek > lastDay) endWeek.setDate(lastDay.getDate());
            
            labels.push(`Week ${i + 1}`);
            
            const weekIncomes = incomes.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate >= startWeek && incomeDate <= endWeek;
            });
            
            const weekExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startWeek && expenseDate <= endWeek;
            });
            
            const weekIncomeTotal = weekIncomes.reduce((total, income) => total + income.amount, 0);
            const weekExpenseTotal = weekExpenses.reduce((total, expense) => total + expense.amount, 0);
            
            incomesData.push(weekIncomeTotal);
            expensesData.push(weekExpenseTotal);
            balancesData.push(weekIncomeTotal - weekExpenseTotal);
        }
    } else if (period === 'quarter') {
        // This quarter by month
        const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            const month = new Date(today.getFullYear(), quarterStartMonth + i, 1);
            labels.push(month.toLocaleString('nl-NL', { month: 'short' }));
            
            const monthIncomes = incomes.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate.getMonth() === quarterStartMonth + i && 
                       incomeDate.getFullYear() === today.getFullYear();
            });
            
            const monthExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === quarterStartMonth + i && 
                       expenseDate.getFullYear() === today.getFullYear();
            });
            
            const monthIncomeTotal = monthIncomes.reduce((total, income) => total + income.amount, 0);
            const monthExpenseTotal = monthExpenses.reduce((total, expense) => total + expense.amount, 0);
            
            incomesData.push(monthIncomeTotal);
            expensesData.push(monthExpenseTotal);
            balancesData.push(monthIncomeTotal - monthExpenseTotal);
        }
    } else {
        // This year by month
        for (let i = 0; i < 12; i++) {
            const month = new Date(today.getFullYear(), i, 1);
            labels.push(month.toLocaleString('nl-NL', { month: 'short' }));
            
            const monthIncomes = incomes.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate.getMonth() === i && incomeDate.getFullYear() === today.getFullYear();
            });
            
            const monthExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === i && expenseDate.getFullYear() === today.getFullYear();
            });
            
            const monthIncomeTotal = monthIncomes.reduce((total, income) => total + income.amount, 0);
            const monthExpenseTotal = monthExpenses.reduce((total, expense) => total + expense.amount, 0);
            
            incomesData.push(monthIncomeTotal);
            expensesData.push(monthExpenseTotal);
            balancesData.push(monthIncomeTotal - monthExpenseTotal);
        }
    }
    
    return { labels, incomes: incomesData, expenses: expensesData, balances: balancesData };
}

// Helper functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('nl-NL', options);
}

function getCategoryName(category) {
    const categories = {
        'salary': 'Salaris',
        'freelance': 'Freelance',
        'investment': 'Investeringen',
        'gift': 'Geschenken',
        'other': 'Overige',
        'groceries': 'Boodschappen',
        'rent': 'Huur',
        'utilities': 'Nutsvoorzieningen',
        'transport': 'Vervoer',
        'entertainment': 'Entertainment',
        'healthcare': 'Gezondheidszorg',
        'education': 'Onderwijs'
    };
    
    return categories[category] || category;
}

function getPaymentMethodName(method) {
    const methods = {
        'cash': 'Contant',
        'card': 'Betaalpas',
        'transfer': 'Overschrijving',
        'other': 'Overige'
    };
    
    return methods[method] || method;
}

// Placeholder functions for edit/delete operations
function editIncome(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}

function deleteIncome(id) {
    if (confirm('Weet je zeker dat je deze inkomst wilt verwijderen?')) {
        incomes = incomes.filter(income => income.id !== id);
        saveToLocalStorage();
        updateIncomeTable();
        updateDashboard();
    }
}

function editExpense(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}

function deleteExpense(id) {
    if (confirm('Weet je zeker dat je deze uitgave wilt verwijderen?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveToLocalStorage();
        updateExpenseTable();
        updateDashboard();
    }
}

function editBudget(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}

function deleteBudget(id) {
    if (confirm('Weet je zeker dat je dit budget wilt verwijderen?')) {
        budgets = budgets.filter(budget => budget.id !== id);
        saveToLocalStorage();
        updateBudgetsList();
        updateDashboard();
    }
}

function editGoal(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}

function deleteGoal(id) {
    if (confirm('Weet je zeker dat je dit doel wilt verwijderen?')) {
        goals = goals.filter(goal => goal.id !== id);
        saveToLocalStorage();
        updateGoalsList();
        updateDashboard();
    }
}

function editDebt(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}

function deleteDebt(id) {
    if (confirm('Weet je zeker dat je deze schuld wilt verwijderen?')) {
        debts = debts.filter(debt => debt.id !== id);
        saveToLocalStorage();
        updateDebtsList();
        updateDashboard();
    }
}

// Repayment helper functions
function markAsPaid(id) {
    const repayment = repayments.find(r => r.id === id);
    if (repayment) {
        if (confirm(`Markeer terugbetaling van €${repayment.amount} van ${repayment.person} als betaald?`)) {
            // For now, we'll just show a confirmation
            alert(`Terugbetaling gemarkeerd als betaald!`);
            // In a more advanced version, you might want to archive or remove the repayment
        }
    }
}

function editRepayment(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}

function deleteRepayment(id) {
    if (confirm('Weet je zeker dat je deze terugbetaling wilt verwijderen?')) {
        repayments = repayments.filter(repayment => repayment.id !== id);
        saveToLocalStorage();
        updateRepaymentsList();
        updateDashboard();
    }
}

// Local storage functions
function saveToLocalStorage() {
    localStorage.setItem('finsight_incomes', JSON.stringify(incomes));
    localStorage.setItem('finsight_expenses', JSON.stringify(expenses));
    localStorage.setItem('finsight_budgets', JSON.stringify(budgets));
    localStorage.setItem('finsight_goals', JSON.stringify(goals));
    localStorage.setItem('finsight_debts', JSON.stringify(debts));
    localStorage.setItem('finsight_repayments', JSON.stringify(repayments));
}

function loadFromLocalStorage() {
    const storedIncomes = localStorage.getItem('finsight_incomes');
    if (storedIncomes) incomes = JSON.parse(storedIncomes);
    
    const storedExpenses = localStorage.getItem('finsight_expenses');
    if (storedExpenses) expenses = JSON.parse(storedExpenses);
    
    const storedBudgets = localStorage.getItem('finsight_budgets');
    if (storedBudgets) budgets = JSON.parse(storedBudgets);
    
    const storedGoals = localStorage.getItem('finsight_goals');
    if (storedGoals) goals = JSON.parse(storedGoals);
    
    const storedDebts = localStorage.getItem('finsight_debts');
    if (storedDebts) debts = JSON.parse(storedDebts);
    
    const storedRepayments = localStorage.getItem('finsight_repayments');
    if (storedRepayments) repayments = JSON.parse(storedRepayments);
}
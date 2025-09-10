// FinSight Budget App JavaScript

// Data arrays
let incomes = [];
let expenses = [];
let budgets = [];
let goals = [];
let debts = [];
let repayments = [];
let categories = {
    income: [
        { id: 'salary', name: 'Salaris', description: '', icon: '' },
        { id: 'freelance', name: 'Freelance', description: '', icon: '' },
        { id: 'investment', name: 'Investeringen', description: '', icon: '' },
        { id: 'gift', name: 'Geschenken', description: '', icon: '' },
        { id: 'other', name: 'Overige', description: '', icon: '' }
    ],
    expense: [
        { id: 'groceries', name: 'Boodschappen', description: '', icon: '' },
        { id: 'rent', name: 'Huur', description: '', icon: '' },
        { id: 'utilities', name: 'Nutsvoorzieningen', description: '', icon: '' },
        { id: 'transport', name: 'Vervoer', description: '', icon: '' },
        { id: 'entertainment', name: 'Entertainment', description: '', icon: '' },
        { id: 'healthcare', name: 'Gezondheidszorg', description: '', icon: '' },
        { id: 'education', name: 'Onderwijs', description: '', icon: '' },
        { id: 'other', name: 'Overige', description: '', icon: '' }
    ]
};

// Add new array for month closures
let monthClosures = [];

// DOM Elements
const tabButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const incomeFormContainer = document.getElementById('income-form-container');
const expenseFormContainer = document.getElementById('expense-form-container');
const budgetFormContainer = document.getElementById('budget-form-container');
const goalFormContainer = document.getElementById('goal-form-container');
const debtFormContainer = document.getElementById('debt-form-container');
const repaymentFormContainer = document.getElementById('repayment-form-container');
const categoryFormContainer = document.getElementById('category-form-container');
const repaymentPasswordSection = document.getElementById('repayment-password-section');
const repaymentsList = document.getElementById('repayments-list');

// Form elements
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const budgetForm = document.getElementById('budget-form');
const goalForm = document.getElementById('goal-form');
const debtForm = document.getElementById('debt-form');
const repaymentForm = document.getElementById('repayment-form');
const categoryForm = document.getElementById('category-form');

// Button elements
const addIncomeBtn = document.getElementById('add-income-btn');
const addExpenseBtn = document.getElementById('add-expense-btn');
const addBudgetBtn = document.getElementById('add-budget-btn');
const addGoalBtn = document.getElementById('add-goal-btn');
const addDebtBtn = document.getElementById('add-debt-btn');
const addRepaymentBtn = document.getElementById('add-repayment-btn');
const addCategoryBtn = document.getElementById('add-category-btn');

const cancelIncomeBtn = document.getElementById('cancel-income-btn');
const cancelExpenseBtn = document.getElementById('cancel-expense-btn');
const cancelBudgetBtn = document.getElementById('cancel-budget-btn');
const cancelGoalBtn = document.getElementById('cancel-goal-btn');
const cancelDebtBtn = document.getElementById('cancel-debt-btn');
const cancelRepaymentBtn = document.getElementById('cancel-repayment-btn');
const cancelCategoryBtn = document.getElementById('cancel-category-btn');

// Password protection elements
const repaymentPasswordInput = document.getElementById('repayment-password');
const repaymentPasswordSetupInput = document.getElementById('repayment-password-setup');
const repaymentPasswordBtn = document.getElementById('repayment-password-btn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app');
    initializeApp();
    setupEventListeners();
    loadFromLocalStorage();
    updateDashboard();
    updateCategorySelectors();
    console.log('App initialization completed');
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
    console.log('Setting up event listeners');
    console.log('Found tab buttons:', tabButtons.length);
    console.log('Found tab contents:', tabContents.length);
    
    // Tab navigation
    tabButtons.forEach((button, index) => {
        console.log('Setting up event listener for tab button', index, button.dataset.tab);
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Tab button clicked:', button.dataset.tab);
            switchTab(button.dataset.tab);
        });
    });
    
    // Form toggles
    addIncomeBtn.addEventListener('click', () => toggleForm(incomeFormContainer));
    addExpenseBtn.addEventListener('click', () => toggleForm(expenseFormContainer));
    addBudgetBtn.addEventListener('click', () => toggleForm(budgetFormContainer));
    addGoalBtn.addEventListener('click', () => toggleForm(goalFormContainer));
    addDebtBtn.addEventListener('click', () => toggleForm(debtFormContainer));
    addRepaymentBtn.addEventListener('click', () => toggleForm(repaymentFormContainer));
    addCategoryBtn.addEventListener('click', () => toggleForm(categoryFormContainer));
    
    // Cancel buttons
    cancelIncomeBtn.addEventListener('click', () => toggleForm(incomeFormContainer));
    cancelExpenseBtn.addEventListener('click', () => toggleForm(expenseFormContainer));
    cancelBudgetBtn.addEventListener('click', () => toggleForm(budgetFormContainer));
    cancelGoalBtn.addEventListener('click', () => toggleForm(goalFormContainer));
    cancelDebtBtn.addEventListener('click', () => toggleForm(debtFormContainer));
    cancelRepaymentBtn.addEventListener('click', () => toggleForm(repaymentFormContainer));
    cancelCategoryBtn.addEventListener('click', () => toggleForm(categoryFormContainer));
    
    // Form submissions
    incomeForm.addEventListener('submit', handleIncomeSubmit);
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    budgetForm.addEventListener('submit', handleBudgetSubmit);
    goalForm.addEventListener('submit', handleGoalSubmit);
    debtForm.addEventListener('submit', handleDebtSubmit);
    repaymentForm.addEventListener('submit', handleRepaymentSubmit);
    categoryForm.addEventListener('submit', handleCategorySubmit);
    
    // Password protection for repayments
    repaymentPasswordBtn.addEventListener('click', handleRepaymentPassword);
    
    // Dashboard period selector
    document.getElementById('dashboard-period').addEventListener('change', updateDashboard);
    
    // Report period selector
    document.getElementById('report-period').addEventListener('change', updateReports);
    
    // Search and filter event listeners
    const incomeSearch = document.getElementById('income-search');
    const incomeCategoryFilter = document.getElementById('income-category-filter');
    const expenseSearch = document.getElementById('expense-search');
    const expenseCategoryFilter = document.getElementById('expense-category-filter');
    
    if (incomeSearch) {
        incomeSearch.addEventListener('input', updateIncomeTable);
    }
    
    if (incomeCategoryFilter) {
        incomeCategoryFilter.addEventListener('change', updateIncomeTable);
    }
    
    if (expenseSearch) {
        expenseSearch.addEventListener('input', updateExpenseTable);
    }
    
    if (expenseCategoryFilter) {
        expenseCategoryFilter.addEventListener('change', updateExpenseTable);
    }
    
    // Month closure button
    const closeMonthBtn = document.getElementById('close-month-btn');
    if (closeMonthBtn) {
        closeMonthBtn.addEventListener('click', closeCurrentMonth);
    }
}

// Handle category form submission
function handleCategorySubmit(e) {
    e.preventDefault();
    
    const categoryName = document.getElementById('category-name').value;
    const categoryType = document.getElementById('category-type').value;
    const categoryDescription = document.getElementById('category-description').value;
    const categoryIcon = document.getElementById('category-icon').value;
    
    // Generate a unique ID for the category
    const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Check if category already exists
    const existingCategory = categories[categoryType].find(cat => cat.id === categoryId);
    if (existingCategory) {
        alert('Er bestaat al een categorie met deze naam!');
        return;
    }
    
    // Add new category
    categories[categoryType].push({
        id: categoryId,
        name: categoryName,
        description: categoryDescription,
        icon: categoryIcon
    });
    
    saveToLocalStorage();
    updateCategorySelectors();
    updateCategoriesTable();
    
    // Reset form and hide it
    categoryForm.reset();
    toggleForm(categoryFormContainer);
}

    toggleForm(categoryFormContainer);
}

// Update category selectors in forms
function updateCategorySelectors() {
    // Update income category selector
    const incomeCategorySelect = document.getElementById('income-category');
    if (incomeCategorySelect) {
        const currentSelection = incomeCategorySelect.value;
        incomeCategorySelect.innerHTML = '<option value="">Selecteer categorie</option>';
        categories.income.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            incomeCategorySelect.appendChild(option);
        });
        incomeCategorySelect.value = currentSelection;
    }
    
    // Update expense category selector
    const expenseCategorySelect = document.getElementById('expense-category');
    if (expenseCategorySelect) {
        const currentSelection = expenseCategorySelect.value;
        expenseCategorySelect.innerHTML = '<option value="">Selecteer categorie</option>';
        categories.expense.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            expenseCategorySelect.appendChild(option);
        });
        expenseCategorySelect.value = currentSelection;
    }
    
    // Update budget category selector
    const budgetCategorySelect = document.getElementById('budget-category');
    if (budgetCategorySelect) {
        const currentSelection = budgetCategorySelect.value;
        budgetCategorySelect.innerHTML = '<option value="">Selecteer categorie</option>';
        categories.expense.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            budgetCategorySelect.appendChild(option);
        });
        budgetCategorySelect.value = currentSelection;
    }
}

// Update categories table
function updateCategoriesTable() {
    // Update income categories table
    const incomeTbody = document.getElementById('income-categories-table-body');
    if (categories.income.length === 0) {
        incomeTbody.innerHTML = '<tr><td colspan="4" class="no-data">Geen inkomsten categorieën gevonden</td></tr>';
    } else {
        incomeTbody.innerHTML = '';
        categories.income.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>${category.description || '-'}</td>
                <td>${category.icon ? `<i class="${category.icon}"></i>` : '-'}</td>
                <td>
                    <button class="edit-btn" onclick="editCategory('${category.id}', 'income')"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" onclick="deleteCategory('${category.id}', 'income')"><i class="fas fa-trash"></i></button>
                </td>
            `;
            incomeTbody.appendChild(row);
        });
    }
    
    // Update expense categories table
    const expenseTbody = document.getElementById('expense-categories-table-body');
    if (categories.expense.length === 0) {
        expenseTbody.innerHTML = '<tr><td colspan="4" class="no-data">Geen uitgaven categorieën gevonden</td></tr>';
    } else {
        expenseTbody.innerHTML = '';
        categories.expense.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>${category.description || '-'}</td>
                <td>${category.icon ? `<i class="${category.icon}"></i>` : '-'}</td>
                <td>
                    <button class="edit-btn" onclick="editCategory('${category.id}', 'expense')"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" onclick="deleteCategory('${category.id}', 'expense')"><i class="fas fa-trash"></i></button>
                </td>
            `;
            expenseTbody.appendChild(row);
        });
    }
}

// Edit category
function editCategory(id, type) {
    const category = categories[type].find(cat => cat.id === id);
    if (!category) return;
    
    // Show the category form
    toggleForm(categoryFormContainer);
    
    // Fill the form with category data
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-type').value = type;
    document.getElementById('category-description').value = category.description || '';
    document.getElementById('category-icon').value = category.icon || '';
    
    // Store the original ID and type for updating
    categoryForm.dataset.editingId = id;
    categoryForm.dataset.editingType = type;
    
    // Change form submit handler to update instead of add
    categoryForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Get the editing ID and type
        const editingId = categoryForm.dataset.editingId;
        const editingType = categoryForm.dataset.editingType;
        
        // Find the category to update
        const categoryToUpdate = categories[editingType].find(cat => cat.id === editingId);
        if (!categoryToUpdate) return;
        
        // Get updated values
        const newName = document.getElementById('category-name').value;
        const newDescription = document.getElementById('category-description').value;
        const newIcon = document.getElementById('category-icon').value;
        
        // Update category data
        categoryToUpdate.name = newName;
        categoryToUpdate.description = newDescription;
        categoryToUpdate.icon = newIcon;
        
        // If the name changed, we might need to update the ID
        const newId = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (newId !== editingId) {
            // Check if new ID already exists
            const existingCategory = categories[editingType].find(cat => cat.id === newId);
            if (!existingCategory || existingCategory === categoryToUpdate) {
                // Update the ID if it's not conflicting or if it's the same category
                if (!existingCategory) {
                    categoryToUpdate.id = newId;
                }
                // If it's the same category, we don't need to change the ID
            }
        }
        
        saveToLocalStorage();
        updateCategorySelectors();
        updateCategoriesTable();
        
        // Reset form and hide it
        categoryForm.reset();
        delete categoryForm.dataset.editingId;
        delete categoryForm.dataset.editingType;
        toggleForm(categoryFormContainer);
        
        // Restore original submit handler
        categoryForm.onsubmit = handleCategorySubmit;
    };
}

// Delete category
function deleteCategory(id, type) {
    // Check if trying to delete 'other' category (prevent deletion of this fallback category)
    if (id === 'other') {
        alert('De "Overige" categorie kan niet worden verwijderd omdat deze als fallback-categorie wordt gebruikt.');
        return;
    }
    
    if (confirm('Weet je zeker dat je deze categorie wilt verwijderen?')) {
        // Check if this category is used in any transactions
        let isUsed = false;
        if (type === 'income') {
            isUsed = incomes.some(income => income.category === id);
        } else {
            isUsed = expenses.some(expense => expense.category === id) || 
                     budgets.some(budget => budget.category === id);
        }
        
        if (isUsed) {
            if (confirm('Deze categorie wordt gebruikt in bestaande transacties. Als je doorgaat, worden deze transacties naar de "Overige" categorie verplaatst. Wil je doorgaan?')) {
                // Move transactions to 'other' category
                if (type === 'income') {
                    incomes.forEach(income => {
                        if (income.category === id) {
                            income.category = 'other';
                        }
                    });
                } else {
                    expenses.forEach(expense => {
                        if (expense.category === id) {
                            expense.category = 'other';
                        }
                    });
                    
                    budgets.forEach(budget => {
                        if (budget.category === id) {
                            budget.category = 'other';
                        }
                    });
                }
                
                // Save changes
                saveToLocalStorage();
                updateIncomeTable();
                updateExpenseTable();
                updateBudgetsList();
                updateDashboard();
            } else {
                return; // User cancelled
            }
        }
        
        // Remove the category
        categories[type] = categories[type].filter(cat => cat.id !== id);
        saveToLocalStorage();
        updateCategorySelectors();
        updateCategoriesTable();
    }
}

// Switch between tabs
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
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
    
    // Special handling for specific tabs
    switch(tabName) {
        case 'repayments':
            handleRepaymentsTab();
            break;
        case 'categories':
            updateCategoriesTable();
            break;
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
        case 'reports':
            updateReports();
            break;
    }
    
    console.log('Tab switching completed for:', tabName);
}


            break;
    }
}

// Handle repayments tab (moved from switchTab)
function handleRepaymentsTab() {
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
        paymentMethod: document.getElementById('expense-payment-method').value,
        // Add payment status (default to 'open')
        paymentStatus: 'open', // 'open' or 'paid'
        // Add month/year for tracking
        month: new Date(document.getElementById('expense-date').value).getMonth(),
        year: new Date(document.getElementById('expense-date').value).getFullYear()
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

// Update income table with search and filter functionality
function updateIncomeTable() {
    const tbody = document.getElementById('income-table-body');
    
    if (incomes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Geen inkomsten gevonden</td></tr>';
        return;
    }
    
    // Get search and filter values
    const searchInput = document.getElementById('income-search');
    const categoryFilter = document.getElementById('income-category-filter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const categoryFilterValue = categoryFilter ? categoryFilter.value : '';
    
    // Filter incomes based on search and category
    let filteredIncomes = [...incomes];
    
    if (searchTerm) {
        filteredIncomes = filteredIncomes.filter(income => 
            income.description.toLowerCase().includes(searchTerm) ||
            getCategoryName(income.category).toLowerCase().includes(searchTerm) ||
            (income.source && income.source.toLowerCase().includes(searchTerm))
        );
    }
    
    if (categoryFilterValue) {
        filteredIncomes = filteredIncomes.filter(income => income.category === categoryFilterValue);
    }
    
    // Sort incomes by date (newest first)
    const sortedIncomes = filteredIncomes.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedIncomes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Geen inkomsten gevonden</td></tr>';
        return;
    }
    
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

// Update expense table with search and filter functionality
function updateExpenseTable() {
    const tbody = document.getElementById('expense-table-body');
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">Geen uitgaven gevonden</td></tr>';
        return;
    }
    
    // Get search and filter values
    const searchInput = document.getElementById('expense-search');
    const categoryFilter = document.getElementById('expense-category-filter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const categoryFilterValue = categoryFilter ? categoryFilter.value : '';
    
    // Filter expenses based on search and category
    let filteredExpenses = [...expenses];
    
    if (searchTerm) {
        filteredExpenses = filteredExpenses.filter(expense => 
            expense.description.toLowerCase().includes(searchTerm) ||
            getCategoryName(expense.category).toLowerCase().includes(searchTerm) ||
            getPaymentMethodName(expense.paymentMethod).toLowerCase().includes(searchTerm)
        );
    }
    
    if (categoryFilterValue) {
        filteredExpenses = filteredExpenses.filter(expense => expense.category === categoryFilterValue);
    }
    
    // Sort expenses by date (newest first)
    const sortedExpenses = filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedExpenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">Geen uitgaven gevonden</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    sortedExpenses.forEach(expense => {
        // Determine status class
        const statusClass = expense.paymentStatus === 'paid' ? 'status-paid' : 'status-open';
        const statusText = expense.paymentStatus === 'paid' ? 'Betaald' : 'Open';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.description}</td>
            <td>${getCategoryName(expense.category)}</td>
            <td>${getPaymentMethodName(expense.paymentMethod)}</td>
            <td>€${expense.amount.toFixed(2)}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
                <button class="edit-btn" onclick="editExpense(${expense.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})"><i class="fas fa-trash"></i></button>
                ${expense.paymentStatus === 'open' ? 
                    `<button class="pay-btn" onclick="markExpenseAsPaid(${expense.id})"><i class="fas fa-check"></i></button>` : 
                    ''}
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
        container.innerHTML = '<p class="no-data">Geen doelen ingesteld</p>';
        return;
    }
    
    container.innerHTML = '';
    goals.forEach(goal => {
        const percentage = Math.min(100, (goal.saved / goal.target) * 100);
        const progressBarClass = percentage < 70 ? 'safe' : percentage < 90 ? 'warning' : 'danger';
        const remaining = goal.target - goal.saved;
        
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        goalCard.innerHTML = `
            <div class="goal-header">
                <h3>${goal.name}</h3>
                <span class="goal-status">${percentage >= 100 ? 'Bereikt' : 'Openstaand'}</span>
            </div>
            <div class="goal-amount">€${goal.saved.toFixed(2)} / €${goal.target.toFixed(2)}</div>
            <div class="goal-progress">
                <div class="goal-progress-bar ${progressBarClass}" style="width: ${percentage}%"></div>
            </div>
            <div class="goal-details">
                <span>${percentage.toFixed(1)}% bereikt</span>
                <span>${goal.monthlyAmount ? `€${goal.monthlyAmount.toFixed(2)} per maand` : ''}</span>
            </div>
            <div class="goal-description">${goal.description}</div>
            <div class="goal-actions">
                <button class="edit-btn" onclick="editGoal(${goal.id})"><i class="fas fa-edit"></i> Bewerken</button>
                <button class="delete-btn" onclick="deleteGoal(${goal.id})"><i class="fas fa-trash"></i> Verwijderen</button>
            </div>
        `;
        container.appendChild(goalCard);
    });
}

// Update dashboard with total incomes, expenses, savings, debts, and net worth
function updateDashboard() {
    const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const totalBudgets = budgets.reduce((total, budget) => total + budget.used, 0);
    const totalGoals = goals.reduce((total, goal) => total + goal.saved, 0);
    const totalDebts = debts.reduce((total, debt) => total + debt.amount, 0);
    const totalRepayments = repayments.reduce((total, repayment) => total + repayment.amount, 0);
    const netWorth = totalIncome - totalExpenses - totalDebts + totalRepayments;
    
    document.getElementById('total-income').textContent = `€${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `€${totalExpenses.toFixed(2)}`;
    document.getElementById('total-budgets').textContent = `€${totalBudgets.toFixed(2)}`;
    document.getElementById('total-goals').textContent = `€${totalGoals.toFixed(2)}`;
    document.getElementById('total-debts').textContent = `€${totalDebts.toFixed(2)}`;
    document.getElementById('total-repayments').textContent = `€${totalRepayments.toFixed(2)}`;
    document.getElementById('net-worth').textContent = `€${netWorth.toFixed(2)}`;
}

// Update reports with income, expense, budget, goal, debt, and repayment data
function updateReports() {
    const period = document.getElementById('report-period').value;
    const startDate = new Date(document.getElementById('report-start-date').value);
    const endDate = new Date(document.getElementById('report-end-date').value);
    
    // Filter data based on period and date range
    const filteredIncomes = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return (period === 'custom' && incomeDate >= startDate && incomeDate <= endDate) ||
               (period === 'yearly' && incomeDate.getFullYear() === startDate.getFullYear()) ||
               (period === 'monthly' && incomeDate.getFullYear() === startDate.getFullYear() && incomeDate.getMonth() === startDate.getMonth()) ||
               (period === 'weekly' && incomeDate.getFullYear() === startDate.getFullYear() && incomeDate.getMonth() === startDate.getMonth() && incomeDate.getDate() >= startDate.getDate() - (startDate.getDay() || 7) + 1 && incomeDate.getDate() <= startDate.getDate() - (startDate.getDay() || 7) + 7);
    });
    
    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return (period === 'custom' && expenseDate >= startDate && expenseDate <= endDate) ||
               (period === 'yearly' && expenseDate.getFullYear() === startDate.getFullYear()) ||
               (period === 'monthly' && expenseDate.getFullYear() === startDate.getFullYear() && expenseDate.getMonth() === startDate.getMonth()) ||
               (period === 'weekly' && expenseDate.getFullYear() === startDate.getFullYear() && expenseDate.getMonth() === startDate.getMonth() && expenseDate.getDate() >= startDate.getDate() - (startDate.getDay() || 7) + 1 && expenseDate.getDate() <= startDate.getDate() - (startDate.getDay() || 7) + 7);
    });
    
    const filteredBudgets = budgets.filter(budget => {
        const budgetDate = new Date();
        return (period === 'custom' && budgetDate >= startDate && budgetDate <= endDate) ||
               (period === 'yearly' && budgetDate.getFullYear() === startDate.getFullYear()) ||
               (period === 'monthly' && budgetDate.getFullYear() === startDate.getFullYear() && budgetDate.getMonth() === startDate.getMonth()) ||
               (period === 'weekly' && budgetDate.getFullYear() === startDate.getFullYear() && budgetDate.getMonth() === startDate.getMonth() && budgetDate.getDate() >= startDate.getDate() - (startDate.getDay() || 7) + 1 && budgetDate.getDate() <= startDate.getDate() - (startDate.getDay() || 7) + 7);
    });
    
    const filteredGoals = goals.filter(goal => {
        const goalDate = new Date();
        return (period === 'custom' && goalDate >= startDate && goalDate <= endDate) ||
               (period === 'yearly' && goalDate.getFullYear() === startDate.getFullYear()) ||
               (period === 'monthly' && goalDate.getFullYear() === startDate.getFullYear() && goalDate.getMonth() === startDate.getMonth()) ||
               (period === 'weekly' && goalDate.getFullYear() === startDate.getFullYear() && goalDate.getMonth() === startDate.getMonth() && goalDate.getDate() >= startDate.getDate() - (startDate.getDay() || 7) + 1 && goalDate.getDate() <= startDate.getDate() - (startDate.getDay() || 7) + 7);
    });
    
    const filteredDebts = debts.filter(debt => {
        const debtDate = new Date(debt.startDate);
        return (period === 'custom' && debtDate >= startDate && debtDate <= endDate) ||
               (period === 'yearly' && debtDate.getFullYear() === startDate.getFullYear()) ||
               (period === 'monthly' && debtDate.getFullYear() === startDate.getFullYear() && debtDate.getMonth() === startDate.getMonth()) ||
               (period === 'weekly' && debtDate.getFullYear() === startDate.getFullYear() && debtDate.getMonth() === startDate.getMonth() && debtDate.getDate() >= startDate.getDate() - (startDate.getDay() || 7) + 1 && debtDate.getDate() <= startDate.getDate() - (startDate.getDay() || 7) + 7);
    });
    
    const filteredRepayments = repayments.filter(repayment => {
        const repaymentDate = new Date(repayment.date);
        return (period === 'custom' && repaymentDate >= startDate && repaymentDate <= endDate) ||
               (period === 'yearly' && repaymentDate.getFullYear() === startDate.getFullYear()) ||
               (period === 'monthly' && repaymentDate.getFullYear() === startDate.getFullYear() && repaymentDate.getMonth() === startDate.getMonth()) ||
               (period === 'weekly' && repaymentDate.getFullYear() === startDate.getFullYear() && repaymentDate.getMonth() === startDate.getMonth() && repaymentDate.getDate() >= startDate.getDate() - (startDate.getDay() || 7) + 1 && repaymentDate.getDate() <= startDate.getDate() - (startDate.getDay() || 7) + 7);
    });
    
    // Calculate totals for the filtered data
    const totalIncome = filteredIncomes.reduce((total, income) => total + income.amount, 0);
    const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalBudgets = filteredBudgets.reduce((total, budget) => total + budget.used, 0);
    const totalGoals = filteredGoals.reduce((total, goal) => total + goal.saved, 0);
    const totalDebts = filteredDebts.reduce((total, debt) => total + debt.amount, 0);
    const totalRepayments = filteredRepayments.reduce((total, repayment) => total + repayment.amount, 0);
    const netWorth = totalIncome - totalExpenses - totalDebts + totalRepayments;
    
    // Update the report section with the calculated totals
    document.getElementById('report-total-income').textContent = `€${totalIncome.toFixed(2)}`;
    document.getElementById('report-total-expenses').textContent = `€${totalExpenses.toFixed(2)}`;
    document.getElementById('report-total-budgets').textContent = `€${totalBudgets.toFixed(2)}`;
    document.getElementById('report-total-goals').textContent = `€${totalGoals.toFixed(2)}`;
    document.getElementById('report-total-debts').textContent = `€${totalDebts.toFixed(2)}`;
    document.getElementById('report-total-repayments').textContent = `€${totalRepayments.toFixed(2)}`;
    document.getElementById('report-net-worth').textContent = `€${netWorth.toFixed(2)}`;
}

// Edit income
function editIncome(id) {
    const income = incomes.find(income => income.id === id);
    if (!income) return;
    
    // Show the income form
    toggleForm(incomeFormContainer);
    
    // Fill the form with income data
    document.getElementById('income-description').value = income.description;
    document.getElementById('income-amount').value = income.amount;
    document.getElementById('income-category').value = income.category;
    document.getElementById('income-date').value = income.date;
    document.getElementById('income-frequency').value = income.frequency;
    document.getElementById('income-source').value = income.source || '';
    
    // Store the original ID for updating
    incomeForm.dataset.editingId = id;
    
    // Change form submit handler to update instead of add
    incomeForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Get the editing ID
        const editingId = incomeForm.dataset.editingId;
        
        // Find the income to update
        const incomeToUpdate = incomes.find(income => income.id === editingId);
        if (!incomeToUpdate) return;
        
        // Get updated values
        const newDescription = document.getElementById('income-description').value;
        const newAmount = parseFloat(document.getElementById('income-amount').value);
        const newCategory = document.getElementById('income-category').value;
        const newDate = document.getElementById('income-date').value;
        const newFrequency = document.getElementById('income-frequency').value;
        const newSource = document.getElementById('income-source').value;
        
        // Update income data
        incomeToUpdate.description = newDescription;
        incomeToUpdate.amount = newAmount;
        incomeToUpdate.category = newCategory;
        incomeToUpdate.date = newDate;
        incomeToUpdate.frequency = newFrequency;
        incomeToUpdate.source = newSource;
        
        saveToLocalStorage();
        updateIncomeTable();
        updateDashboard();
        
        // Reset form and hide it
        incomeForm.reset();
        document.getElementById('income-date').value = new Date().toISOString().split('T')[0];
        delete incomeForm.dataset.editingId;
        toggleForm(incomeFormContainer);
        
        // Restore original submit handler
        incomeForm.onsubmit = handleIncomeSubmit;
    };
}

// Edit expense
function editExpense(id) {
    const expense = expenses.find(expense => expense.id === id);
    if (!expense) return;
    
    // Show the expense form
    toggleForm(expenseFormContainer);
    
    // Fill the form with expense data
    document.getElementById('expense-description').value = expense.description;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-category').value = expense.category;
    document.getElementById('expense-date').value = expense.date;
    document.getElementById('expense-payment-method').value = expense.paymentMethod;
    
    // Store the original ID for updating
    expenseForm.dataset.editingId = id;
    
    // Change form submit handler to update instead of add
    expenseForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Get the editing ID
        const editingId = expenseForm.dataset.editingId;
        
        // Find the expense to update
        const expenseToUpdate = expenses.find(expense => expense.id === editingId);
        if (!expenseToUpdate) return;
        
        // Get updated values
        const newDescription = document.getElementById('expense-description').value;
        const newAmount = parseFloat(document.getElementById('expense-amount').value);
        const newCategory = document.getElementById('expense-category').value;
        const newDate = document.getElementById('expense-date').value;
        const newPaymentMethod = document.getElementById('expense-payment-method').value;
        
        // Update expense data
        expenseToUpdate.description = newDescription;
        expenseToUpdate.amount = newAmount;
        expenseToUpdate.category = newCategory;
        expenseToUpdate.date = newDate;
        expenseToUpdate.paymentMethod = newPaymentMethod;
        
        saveToLocalStorage();
        updateExpenseTable();
        updateDashboard();
        
        // Reset form and hide it
        expenseForm.reset();
        document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
        delete expenseForm.dataset.editingId;
        toggleForm(expenseFormContainer);
        
        // Restore original submit handler
        expenseForm.onsubmit = handleExpenseSubmit;
    };
}

// Edit budget
function editBudget(id) {
    const budget = budgets.find(budget => budget.id === id);
    if (!budget) return;
    
    // Show the budget form
    toggleForm(budgetFormContainer);
    
    // Fill the form with budget data
    document.getElementById('budget-name').value = budget.name;
    document.getElementById('budget-amount').value = budget.amount;
    document.getElementById('budget-category').value = budget.category;
    document.getElementById('budget-period').value = budget.period;
    
    // Store the original ID for updating
    budgetForm.dataset.editingId = id;
    
    // Change form submit handler to update instead of add
    budgetForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Get the editing ID
        const editingId = budgetForm.dataset.editingId;
        
        // Find the budget to update
        const budgetToUpdate = budgets.find(budget => budget.id === editingId);
        if (!budgetToUpdate) return;
        
        // Get updated values
        const newName = document.getElementById('budget-name').value;
        const newAmount = parseFloat(document.getElementById('budget-amount').value);
        const newCategory = document.getElementById('budget-category').value;
        const newPeriod = document.getElementById('budget-period').value;
        
        // Update budget data
        budgetToUpdate.name = newName;
        budgetToUpdate.amount = newAmount;
        budgetToUpdate.category = newCategory;
        budgetToUpdate.period = newPeriod;
        
        // Recalculate used amount based on existing expenses in this category
        const categoryExpenses = expenses.filter(expense => expense.category === budgetToUpdate.category);
        budgetToUpdate.used = categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
        
        saveToLocalStorage();
        updateBudgetsList();
        updateDashboard();
        
        // Reset form and hide it
        budgetForm.reset();
        delete budgetForm.dataset.editingId;
        toggleForm(budgetFormContainer);
        
        // Restore original submit handler
        budgetForm.onsubmit = handleBudgetSubmit;
    };
}

// Edit goal
function editGoal(id) {
    const goal = goals.find(goal => goal.id === id);
    if (!goal) return;
    
    // Show the goal form
    toggleForm(goalFormContainer);
    
    // Fill the form with goal data
    document.getElementById('goal-name').value = goal.name;
    document.getElementById('goal-target').value = goal.target;
    document.getElementById('goal-deadline').value = goal.deadline;
    document.getElementById('goal-monthly-amount').value = goal.monthlyAmount;
    document.getElementById('goal-description').value = goal.description;
    
    // Store the original ID for updating
    goalForm.dataset.editingId = id;
    
    // Change form submit handler to update instead of add
    goalForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Get the editing ID
        const editingId = goalForm.dataset.editingId;
        
        // Find the goal to update
        const goalToUpdate = goals.find(goal => goal.id === editingId);
        if (!goalToUpdate) return;
        
        // Get updated values
        const newName = document.getElementById('goal-name').value;
        const newTarget = parseFloat(document.getElementById('goal-target').value);
        const newDeadline = document.getElementById('goal-deadline').value;
        const newMonthlyAmount = parseFloat(document.getElementById('goal-monthly-amount').value) || 0;
        const newDescription = document.getElementById('goal-description').value;
        
        // Update goal data
        goalToUpdate.name = newName;
        goalToUpdate.target = newTarget;
        goalToUpdate.deadline = newDeadline;
        goalToUpdate.monthlyAmount = newMonthlyAmount;
        goalToUpdate.description = newDescription;
        
        saveToLocalStorage();
        updateGoalsList();
        updateDashboard();
        
        // Reset form and hide it
        goalForm.reset();
        delete goalForm.dataset.editingId;
        toggleForm(goalFormContainer);
        
        // Restore original submit handler
        goalForm.onsubmit = handleGoalSubmit;
    };
}

// Edit debt
function editDebt(id) {
    const debt = debts.find(debt => debt.id === id);
    if (!debt) return;
    
    // Show the debt form
    toggleForm(debtFormContainer);
    
    // Fill the form with debt data
    document.getElementById('debt-name').value = debt.name;
    document.getElementById('debt-amount').value = debt.amount;
    document.getElementById('debt-creditor').value = debt.creditor;
    document.getElementById('debt-interest').value = debt.interest;
    document.getElementById('debt-start-date').value = debt.startDate;
    document.getElementById('debt-end-date').value = debt.endDate;
    document.getElementById('debt-monthly-payment').value = debt.monthlyPayment;
    
    // Store the original ID for updating
    debtForm.dataset.editingId = id;
    
    // Change form submit handler to update instead of add
    debtForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Get the editing ID
        const editingId = debtForm.dataset.editingId;
        
        // Find the debt to update
        const debtToUpdate = debts.find(debt => debt.id === editingId);
        if (!debtToUpdate) return;
        
        // Get updated values
        const newName = document.getElementById('debt-name').value;
        const newAmount = parseFloat(document.getElementById('debt-amount').value);
        const newCreditor = document.getElementById('debt-creditor').value;
        const newInterest = parseFloat(document.getElementById('debt-interest').value) || 0;
        const newStartDate = document.getElementById('debt-start-date').value;
        const newEndDate = document.getElementById('debt-end-date').value;
        const newMonthlyPayment = parseFloat(document.getElementById('debt-monthly-payment').value);
        
        // Update debt data
        debtToUpdate.name = newName;
        debtToUpdate.amount = newAmount;
        debtToUpdate.creditor = newCreditor;
        debtToUpdate.interest = newInterest;
        debtToUpdate.startDate = newStartDate;
        debtToUpdate.endDate = newEndDate;
        debtToUpdate.monthlyPayment = newMonthlyPayment;
        
        saveToLocalStorage();
        updateDebtsList();
        updateDashboard();
        
        // Reset form and hide it
        debtForm.reset();
        document.getElementById('debt-start-date').value = new Date().toISOString().split('T')[0];
        delete debtForm.dataset.editingId;
        toggleForm(debtFormContainer);
        
        // Restore original submit handler
        debtForm.onsubmit = handleDebtSubmit;
    };
}

// Edit repayment
function editRepayment(id) {
    const repayment = repayments.find(repayment => repayment.id === id);
    if (!repayment) return;
    
    // Show the repayment form
    toggleForm(repaymentFormContainer);
    
    // Fill the form with repayment data
    document.getElementById('repayment-person').value = repayment.person;
    document.getElementById('repayment-amount').value = repayment.amount;
    document.getElementById('repayment-date').value = repayment.date;
    document.getElementById('repayment-type').value = repayment.type;
    document.getElementById('repayment-description').value = repayment.description;
    
    // Store the original ID for updating
    repaymentForm.dataset.editingId = id;
    
    // Change form submit handler to update instead of add
    repaymentForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Get the editing ID
        const editingId = repaymentForm.dataset.editingId;
        
        // Find the repayment to update
        const repaymentToUpdate = repayments.find(repayment => repayment.id === editingId);
        if (!repaymentToUpdate) return;
        
        // Get updated values
        const newPerson = document.getElementById('repayment-person').value;
        const newAmount = parseFloat(document.getElementById('repayment-amount').value);
        const newDate = document.getElementById('repayment-date').value;
        const newType = document.getElementById('repayment-type').value;
        const newDescription = document.getElementById('repayment-description').value;
        
        // Update repayment data
        repaymentToUpdate.person = newPerson;
        repaymentToUpdate.amount = newAmount;
        repaymentToUpdate.date = newDate;
        repaymentToUpdate.type = newType;
        repaymentToUpdate.description = newDescription;
        
        saveToLocalStorage();
        updateRepaymentsList();
        updateDashboard();
        
        // Reset form and hide it
        repaymentForm.reset();
        document.getElementById('repayment-date').value = new Date().toISOString().split('T')[0];
        delete repaymentForm.dataset.editingId;
        toggleForm(repaymentFormContainer);
        
        // Restore original submit handler
        repaymentForm.onsubmit = handleRepaymentSubmit;
    };
}

// Delete income
function deleteIncome(id) {
    if (confirm('Weet je zeker dat je deze inkomsten wilt verwijderen?')) {
        incomes = incomes.filter(income => income.id !== id);
        saveToLocalStorage();
        updateIncomeTable();
        updateDashboard();
    }
}

// Delete expense
function deleteExpense(id) {
    if (confirm('Weet je zeker dat je deze uitgaven wilt verwijderen?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveToLocalStorage();
        updateExpenseTable();
        updateDashboard();
    }
}

// Delete budget
function deleteBudget(id) {
    if (confirm('Weet je zeker dat je dit budget wilt verwijderen?')) {
        budgets = budgets.filter(budget => budget.id !== id);
        saveToLocalStorage();
        updateBudgetsList();
        updateDashboard();
    }
}

// Delete goal
function deleteGoal(id) {
    if (confirm('Weet je zeker dat je dit doel wilt verwijderen?')) {
        goals = goals.filter(goal => goal.id !== id);
        saveToLocalStorage();
        updateGoalsList();
        updateDashboard();
    }
}

// Delete debt
function deleteDebt(id) {
    if (confirm('Weet je zeker dat je deze schuld wilt verwijderen?')) {
        debts = debts.filter(debt => debt.id !== id);
        saveToLocalStorage();
        updateDebtsList();
        updateDashboard();
    }
}

// Delete repayment
function deleteRepayment(id) {
    if (confirm('Weet je zeker dat je deze terugbetaling wilt verwijderen?')) {
        repayments = repayments.filter(repayment => repayment.id !== id);
        saveToLocalStorage();
        updateRepaymentsList();
        updateDashboard();
    }
}

// Make a payment towards a debt
function makePayment(debtId) {
    const debt = debts.find(debt => debt.id === debtId);
    if (!debt) return;
    
    const amount = parseFloat(prompt('Hoeveel wilt je betalen?'));
    if (isNaN(amount) || amount <= 0) {
        alert('Voer een geldig bedrag in.');
        return;
    }
    
    if (amount > debt.amount - debt.paid) {
        alert('Je kunt niet meer betalen dan de openstaande schuld.');
        return;
    }
    
    debt.paid += amount;
    saveToLocalStorage();
    updateDebtsList();
    updateDashboard();
}

// Mark a repayment as paid
function markAsPaid(repaymentId) {
    const repayment = repayments.find(repayment => repayment.id === repaymentId);
    if (!repayment) return;
    
    if (confirm('Weet je zeker dat je deze terugbetaling als betaald wilt markeren?')) {
        repayments = repayments.filter(repayment => repayment.id !== repaymentId);
        saveToLocalStorage();
        updateRepaymentsList();
        updateDashboard();
    }
}

// Mark an expense as paid
function markExpenseAsPaid(expenseId) {
    const expense = expenses.find(expense => expense.id === expenseId);
    if (!expense) return;
    
    if (confirm('Weet je zeker dat je deze uitgave als betaald wilt markeren?')) {
        expense.paymentStatus = 'paid';
        saveToLocalStorage();
        updateExpenseTable();
        updateDashboard();
    }
}

// Get category name from ID
function getCategoryName(id) {
    let category = categories.income.find(cat => cat.id === id) || categories.expense.find(cat => cat.id === id);
    return category ? category.name : 'Onbekend';
}

// Get payment method name from ID
function getPaymentMethodName(id) {
    switch(id) {
        case 'cash':
            return 'Contant';
        case 'creditcard':
            return 'Creditkaart';
        case 'debitcard':
            return 'Debitkaart';
        case 'banktransfer':
            return 'Bankoverschrijving';
        case 'paypal':
            return 'PayPal';
        case 'other':
            return 'Anders';
        default:
            return 'Onbekend';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL');
}

// Save data to local storage
function saveToLocalStorage() {
    localStorage.setItem('finsight_incomes', JSON.stringify(incomes));
    localStorage.setItem('finsight_expenses', JSON.stringify(expenses));
    localStorage.setItem('finsight_budgets', JSON.stringify(budgets));
    localStorage.setItem('finsight_goals', JSON.stringify(goals));
    localStorage.setItem('finsight_debts', JSON.stringify(debts));
    localStorage.setItem('finsight_repayments', JSON.stringify(repayments));
    localStorage.setItem('finsight_categories', JSON.stringify(categories));
    localStorage.setItem('finsight_monthClosures', JSON.stringify(monthClosures));
}

// Load data from local storage
function loadFromLocalStorage() {
    incomes = JSON.parse(localStorage.getItem('finsight_incomes')) || [];
    expenses = JSON.parse(localStorage.getItem('finsight_expenses')) || [];
    budgets = JSON.parse(localStorage.getItem('finsight_budgets')) || [];
    goals = JSON.parse(localStorage.getItem('finsight_goals')) || [];
    debts = JSON.parse(localStorage.getItem('finsight_debts')) || [];
    repayments = JSON.parse(localStorage.getItem('finsight_repayments')) || [];
    categories = JSON.parse(localStorage.getItem('finsight_categories')) || {
        income: [
            { id: 'salary', name: 'Salaris', description: '', icon: '' },
            { id: 'freelance', name: 'Freelance', description: '', icon: '' },
            { id: 'investment', name: 'Investeringen', description: '', icon: '' },
            { id: 'gift', name: 'Geschenken', description: '', icon: '' },
            { id: 'other', name: 'Overige', description: '', icon: '' }
        ],
        expense: [
            { id: 'groceries', name: 'Boodschappen', description: '', icon: '' },
            { id: 'rent', name: 'Huur', description: '', icon: '' },
            { id: 'utilities', name: 'Nutsvoorzieningen', description: '', icon: '' },
            { id: 'transport', name: 'Vervoer', description: '', icon: '' },
            { id: 'entertainment', name: 'Entertainment', description: '', icon: '' },
            { id: 'healthcare', name: 'Gezondheidszorg', description: '', icon: '' },
            { id: 'education', name: 'Onderwijs', description: '', icon: '' },
            { id: 'other', name: 'Overige', description: '', icon: '' }
        ]
    };
    monthClosures = JSON.parse(localStorage.getItem('finsight_monthClosures')) || [];
}

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
    
    // Update month closures
    updateMonthClosures();
}

// Update month closures on dashboard
function updateMonthClosures() {
    const container = document.getElementById('closures-list');
    
    if (monthClosures.length === 0) {
        container.innerHTML = '<p class="no-data">Geen maandafsluitingen gevonden</p>';
        return;
    }
    
    // Sort closures by date (newest first)
    const sortedClosures = [...monthClosures].sort((a, b) => new Date(b.closedDate) - new Date(a.closedDate));
    
    container.innerHTML = '';
    sortedClosures.forEach(closure => {
        const closureItem = document.createElement('div');
        closureItem.className = 'closure-item';
        
        // Get month name
        const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                           'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
        const monthName = monthNames[closure.month];
        
        closureItem.innerHTML = `
            <div class="closure-info">
                <div class="closure-date">${monthName} ${closure.year}</div>
                <div class="closure-details">${formatDate(closure.closedDate)} - ${closure.transferredExpenses} uitgaven overgedragen</div>
            </div>
        `;
        container.appendChild(closureItem);
    });
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
    // First check custom categories
    for (const type in categories) {
        const found = categories[type].find(cat => cat.id === category);
        if (found) {
            return found.name;
        }
    }
    
    // Fallback to default categories (for backward compatibility)
    const defaultCategories = {
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
    
    return defaultCategories[category] || category;
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
    try {
        if (confirm('Weet je zeker dat je deze inkomst wilt verwijderen?')) {
            // Ensure id is a number
            const incomeId = Number(id);
            
            // Validate that we have a valid number
            if (isNaN(incomeId)) {
                console.error('Invalid income ID:', id);
                alert('Er is een fout opgetreden bij het verwijderen van de inkomst.');
                return;
            }
            
            // Filter out the income with the matching id
            const originalLength = incomes.length;
            incomes = incomes.filter(income => Number(income.id) !== incomeId);
            
            // Check if an item was actually removed
            if (incomes.length === originalLength) {
                console.warn('No income found with ID:', incomeId);
            }
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Update the UI
            updateIncomeTable();
            updateDashboard();
        }
    } catch (error) {
        console.error('Error deleting income:', error);
        alert('Er is een fout opgetreden bij het verwijderen van de inkomst.');
    }
}
}

function editExpense(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}

function deleteExpense(id) {
    try {
        if (confirm('Weet je zeker dat je deze uitgave wilt verwijderen?')) {
            // Ensure id is a number
            const expenseId = Number(id);
            
            // Validate that we have a valid number
            if (isNaN(expenseId)) {
                console.error('Invalid expense ID:', id);
                alert('Er is een fout opgetreden bij het verwijderen van de uitgave.');
                return;
            }
            
            // Filter out the expense with the matching id
            const originalLength = expenses.length;
            expenses = expenses.filter(expense => Number(expense.id) !== expenseId);
            
            // Check if an item was actually removed
            if (expenses.length === originalLength) {
                console.warn('No expense found with ID:', expenseId);
                alert('Uitgave niet gevonden.');
            } else {
                // Save to localStorage
                saveToLocalStorage();
                
                // Update the UI
                updateExpenseTable();
                updateDashboard();
            }
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Er is een fout opgetreden bij het verwijderen van de uitgave.');
    }
}

function editBudget(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}
            saveToLocalStorage();
            
            // Update the UI
            updateBudgetsList();
            updateDashboard();
        }
    } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Er is een fout opgetreden bij het verwijderen van het budget.');
    }
}

function editGoal(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}

function deleteGoal(id) {
    try {
        if (confirm('Weet je zeker dat je dit doel wilt verwijderen?')) {
            // Ensure id is a number
            const goalId = Number(id);
            
            // Validate that we have a valid number
            if (isNaN(goalId)) {
                console.error('Invalid goal ID:', id);
                alert('Er is een fout opgetreden bij het verwijderen van het doel.');
                return;
            }
            
            // Filter out the goal with the matching id
            const originalLength = goals.length;
            goals = goals.filter(goal => Number(goal.id) !== goalId);
            
            // Check if an item was actually removed
            if (goals.length === originalLength) {
                console.warn('No goal found with ID:', goalId);
            }
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Update the UI
            updateGoalsList();
            updateDashboard();
        }
    } catch (error) {
        console.error('Error deleting goal:', error);
        alert('Er is een fout opgetreden bij het verwijderen van het doel.');
    }
}

function editDebt(id) {
    alert('Bewerken functie nog niet geïmplementeerd');
}

function deleteDebt(id) {
    try {
        if (confirm('Weet je zeker dat je deze schuld wilt verwijderen?')) {
            // Ensure id is a number
            const debtId = Number(id);
            
            // Validate that we have a valid number
            if (isNaN(debtId)) {
                console.error('Invalid debt ID:', id);
                alert('Er is een fout opgetreden bij het verwijderen van de schuld.');
                return;
            }
            
            // Filter out the debt with the matching id
            const originalLength = debts.length;
            debts = debts.filter(debt => Number(debt.id) !== debtId);
            
            // Check if an item was actually removed
            if (debts.length === originalLength) {
                console.warn('No debt found with ID:', debtId);
            }
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Update the UI
            updateDebtTable();
            updateDashboard();
        }
    } catch (error) {
        console.error('Error deleting debt:', error);
        alert('Er is een fout opgetreden bij het verwijderen van de schuld.');
    }
}

// Mark an expense as paid
function markExpenseAsPaid(expenseId) {
    try {
        const expense = expenses.find(expense => expense.id === expenseId);
        if (expense) {
            if (confirm('Weet je zeker dat je deze uitgave als betaald wilt markeren?')) {
                expense.paymentStatus = 'paid';
                saveToLocalStorage();
                updateExpenseTable();
                updateDashboard();
            }
        } else {
            console.error('Expense not found with ID:', expenseId);
            alert('Uitgave niet gevonden.');
        }
    } catch (error) {
        console.error('Error marking expense as paid:', error);
        alert('Er is een fout opgetreden bij het markeren van de uitgave als betaald.');
    }
}

// Function to close current month
function closeCurrentMonth() {
    try {
        if (confirm('Weet je zeker dat je de huidige maand wilt afsluiten? Alle openstaande uitgaven zullen worden overgedragen naar de volgende maand.')) {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            
            // Find open expenses for current month
            const openExpenses = expenses.filter(expense => 
                expense.paymentStatus === 'open' && 
                expense.month === currentMonth && 
                expense.year === currentYear
            );
            
            // Transfer open expenses to next month
            openExpenses.forEach(expense => {
                // Create a new expense for next month
                const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
                const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
                
                // Calculate the date for next month (keeping the same day)
                const expenseDate = new Date(expense.date);
                const newDate = new Date(nextYear, nextMonth, expenseDate.getDate());
                
                // Handle month overflow (e.g., Jan 31 -> Feb 28/29)
                if (newDate.getMonth() !== nextMonth) {
                    // Set to last day of next month
                    newDate.setDate(0);
                }
                
                const newExpense = {
                    id: Date.now() + Math.floor(Math.random() * 1000), // New unique ID
                    description: `[OVERGEDRAGEN] ${expense.description}`,
                    amount: expense.amount,
                    category: expense.category,
                    date: newDate.toISOString().split('T')[0],
                    paymentMethod: expense.paymentMethod,
                    paymentStatus: 'open',
                    month: nextMonth,
                    year: nextYear
                };
                
                expenses.push(newExpense);
            });
            
            // Record month closure
            monthClosures.push({
                id: Date.now(),
                month: currentMonth,
                year: currentYear,
                closedDate: new Date().toISOString(),
                transferredExpenses: openExpenses.length
            });
            
            saveToLocalStorage();
            
            // Update the UI
            updateExpenseTable();
            updateDashboard();
            
            alert(`Maand afgesloten. ${openExpenses.length} openstaande uitgaven zijn overgedragen naar de volgende maand.`);
        }
    } catch (error) {
        console.error('Error closing month:', error);
        alert('Er is een fout opgetreden bij het afsluiten van de maand.');
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
        alert('Er is een fout opgetreden bij het verwijderen van de terugbetaling.');
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
    localStorage.setItem('finsight_categories', JSON.stringify(categories));
    localStorage.setItem('finsight_monthClosures', JSON.stringify(monthClosures));
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
    
    const storedCategories = localStorage.getItem('finsight_categories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    }
    
    const storedMonthClosures = localStorage.getItem('finsight_monthClosures');
    if (storedMonthClosures) monthClosures = JSON.parse(storedMonthClosures);
}

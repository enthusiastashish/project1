const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('mainContent');

// Set user name
const userName = document.getElementById('userName');
const currentUser = 'Ashish'; // Replace with dynamic user data
userName.textContent = currentUser;

// Open sidebar
hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    mainContent.classList.add('sidebar-open');
});

// Close sidebar
function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    mainContent.classList.remove('sidebar-open');
}

closeSidebarBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Profile dropdown - click based
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('active');
});

// Close profile menu when clicking outside
document.addEventListener('click', () => {
    profileMenu.classList.remove('active');
});

// Prevent closing when clicking inside the menu
profileMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Floating Action Button
const fabBtn = document.getElementById('fabBtn');
const fabMenu = document.getElementById('fabMenu');
const fabOptions = document.querySelectorAll('.fab-option');

fabBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fabBtn.classList.toggle('active');
    fabMenu.classList.toggle('active');
});

// Close FAB menu when option is clicked
fabOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedOption = option.getAttribute('data-option');
        console.log('Selected option:', selectedOption);

        // Close the menu
        fabBtn.classList.remove('active');
        fabMenu.classList.remove('active');
        // Open the expense dialog when clicking the Spending option
        if (selectedOption === 'spending') {
            openExpenseModal();
        }

        // Open the income dialog when clicking the Income option
        if (selectedOption === 'income') {
            openIncomeModal();
        }
    });
});

// Close FAB menu when clicking outside
document.addEventListener('click', (e) => {
    const fabContainer = document.getElementById('fabContainer');
    if (fabContainer && !fabContainer.contains(e.target)) {
        fabBtn.classList.remove('active');
        fabMenu.classList.remove('active');
    }
});

// Nested Dropdown Menu
const primaryBtn = document.getElementById('primaryBtn');
const primaryContent = document.getElementById('primaryContent');
const secondaryBtn = document.getElementById('secondaryBtn');
const secondaryContent = document.getElementById('secondaryContent');
const secondaryMenu = document.querySelector('.nested-menu-secondary');
const nestedOptions = document.querySelectorAll('.nested-option');

// Hide secondary menu by default
secondaryMenu.style.display = 'none';

primaryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    primaryContent.classList.toggle('active');
});

secondaryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    secondaryContent.classList.toggle('active');
});

nestedOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        const menuType = option.getAttribute('data-menu') || 'secondary';
        const selectedText = option.textContent;

        if (menuType === 'primary') {
            primaryBtn.textContent = selectedText;
            primaryContent.classList.remove('active');
            nestedOptions.forEach(opt => {
                if (opt.getAttribute('data-menu') === 'primary') {
                    opt.classList.remove('active');
                }
            });
            option.classList.add('active');

            // Show or hide secondary menu based on selection
            if (selectedText === 'Comparative') {
                secondaryMenu.style.display = 'block';
            } else {
                secondaryMenu.style.display = 'none';
                secondaryContent.classList.remove('active');
            }
        } else {
            secondaryBtn.textContent = selectedText;
            secondaryContent.classList.remove('active');
            nestedOptions.forEach(opt => {
                if (!opt.getAttribute('data-menu')) {
                    opt.classList.remove('active');
                }
            });
            option.classList.add('active');
        }
    });
});

// Close nested menus when clicking outside
document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.nested-dropdown-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        primaryContent.classList.remove('active');
        secondaryContent.classList.remove('active');
    }
});

// Activity list data + rendering + filter by timeframe (Daily/Monthly/Calendar/Yearly)
let activities = [
    { date: '12/4 (Mon)', amount: -120, type: 'expense', period: 'Daily', note: 'Bought groceries', category: 'Groceries' },
    { date: '11/4 (Sun)', amount: 110, type: 'income', period: 'Daily', note: 'Salary (partial)', category: 'Salary' },
    { date: '10/4 (Sat)', amount: -130, type: 'expense', period: 'Monthly', note: 'Dinner out', category: 'Dining' },
    { date: '09/4 (Fri)', amount: 200, type: 'income', period: 'Monthly', note: 'Freelance', category: 'Freelance' },
    { date: '05/4 (Tue)', amount: -90, type: 'expense', period: 'Calendar', note: 'Taxi', category: 'Transport' },
    { date: '01/4 (Wed)', amount: 500, type: 'income', period: 'Yearly', note: 'Bonus', category: 'Bonus' }
];

const activityListEl = document.getElementById('activityList');
const optionButtons = document.querySelectorAll('.option-btn');

// Pagination settings
const PAGE_SIZE = 10;
let activityPage = 1;
let caloriePage = 1;
let currentFilter = null;
function formatAmount(a) {
    const sign = a < 0 ? '-' : '+';
    const abs = Math.abs(a);
    return `${sign} ₹${abs}`;
}

function clearActivities() {
    while (activityListEl.firstChild) activityListEl.removeChild(activityListEl.firstChild);
}

function renderActivities(filterPeriod) {
    if (!activityListEl) return;
    // If a filter is supplied, treat it as a filter change and reset page
    if (filterPeriod !== undefined) {
        currentFilter = filterPeriod || null;
        activityPage = 1;
    }

    clearActivities();

    const items = activities.filter(it => !currentFilter || it.period === currentFilter);
    if (items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'activity-item';
        empty.textContent = 'No entries';
        activityListEl.appendChild(empty);
        return;
    }

    const start = (activityPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = items.slice(start, end);

    pageItems.forEach(it => {
        const el = document.createElement('div');
        el.className = `activity-item ${it.type}`;

        const d = document.createElement('div');
        d.className = 'entry-date';
        d.textContent = it.date;

        const c = document.createElement('div');
        c.className = 'entry-category';
        c.textContent = it.category || '';

        const n = document.createElement('div');
        n.className = 'enry-note';
        n.textContent = it.note || '';

        const a = document.createElement('div');
        a.className = 'entry-amount';
        a.textContent = formatAmount(it.amount);

        el.appendChild(d);
        if (c.textContent) el.appendChild(c);
        if (n.textContent) el.appendChild(n);
        el.appendChild(a);

        // find original index in activities array
        const idx = activities.indexOf(it);
        if (idx >= 0) el.setAttribute('data-idx', String(idx));

        // action buttons (edit/delete)
        const actions = document.createElement('div');
        actions.className = 'activity-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.title = 'Edit';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            const i = Number(el.getAttribute('data-idx'));
            if (i >= 0) startEditActivity(i);
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'action-btn delete-btn';
        delBtn.title = 'Delete';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => {
            const i = Number(el.getAttribute('data-idx'));
            if (i >= 0) deleteActivity(i);
        });

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        el.appendChild(actions);

        activityListEl.appendChild(el);
    });

    // If there are more items, add a "Show more" button
    if (items.length > end) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'show-more-btn';
        moreBtn.textContent = 'Show more';
        moreBtn.addEventListener('click', () => {
            activityPage += 1;
            renderActivities();
        });
        activityListEl.appendChild(moreBtn);
    }
    // update stats after rendering
    updateStats();
}

function deleteActivity(index) {
    if (!Number.isFinite(index)) return;
    const ok = confirm('Delete this entry?');
    if (!ok) return;
    activities.splice(index, 1);
    saveData();
    renderActivities();
}

function startEditActivity(index) {
    const item = activities[index];
    if (!item) return;
    if (item.type === 'expense') {
        expenseEditIndex = index;
        openExpenseModal();
        expenseAmount.value = Math.abs(item.amount);
        expenseCategory.value = item.category || 'Other';
        expenseNote.value = item.note || '';
    } else if (item.type === 'income') {
        incomeEditIndex = index;
        openIncomeModal();
        incomeAmount.value = Math.abs(item.amount);
        incomeCategory.value = item.category || 'Salary';
        incomeNote.value = item.note || '';
    }
}

// Wire option buttons to filter the activity list
optionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        optionButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const period = btn.textContent.trim();
        renderActivities(period);
    });
});

// Initial render using active button (or Daily by default)
const activeBtn = document.querySelector('.option-btn.active');
const initialPeriod = activeBtn ? activeBtn.textContent.trim() : 'Daily';
// (render will happen after calorie data is initialized)

// Calorie Activity List Data + Rendering
let calorieActivities = [
    { expense: 'Pizza', calorie: 280, category: 'Fast Food' },
    { expense: 'Salad', calorie: 120, category: 'Healthy' },
    { expense: 'Burger', calorie: 540, category: 'Fast Food' },
    { expense: 'Smoothie', calorie: 150, category: 'Beverage' },
    { expense: 'Sandwich', calorie: 350, category: 'Lunch' }
];

const calorieActivityListEl = document.getElementById('calorieActivityList');

// persistence keys
const STORAGE_KEY_ACT = 'spendwell_activities_v1';
const STORAGE_KEY_CAL = 'spendwell_calorie_v1';

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY_ACT, JSON.stringify(activities));
        localStorage.setItem(STORAGE_KEY_CAL, JSON.stringify(calorieActivities));
    } catch (e) {
        console.error('Could not save to localStorage', e);
    }
}

function loadData() {
    try {
        const a = localStorage.getItem(STORAGE_KEY_ACT);
        const c = localStorage.getItem(STORAGE_KEY_CAL);
        if (a) activities = JSON.parse(a);
        if (c) calorieActivities = JSON.parse(c);
    } catch (e) {
        console.error('Could not load from localStorage', e);
    }
}

// track edit indexes when opening modals for editing
let expenseEditIndex = null;
let incomeEditIndex = null;
let calorieEditIndex = null;

function clearCalorieActivities() {
    if (!calorieActivityListEl) return;
    while (calorieActivityListEl.firstChild) calorieActivityListEl.removeChild(calorieActivityListEl.firstChild);
}

function renderCalorieActivities() {
    if (!calorieActivityListEl) return;
    clearCalorieActivities();

    const start = (caloriePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = calorieActivities.slice(start, end);

    pageItems.forEach(cal => {
        const el = document.createElement('div');
        el.className = 'calorie-activity-item';

        const exp = document.createElement('div');
        exp.className = 'entry-expense';
        exp.textContent = `${cal.expense} - ${cal.calorie} cal`;

        const cat = document.createElement('div');
        cat.className = 'entry-category';
        cat.textContent = cal.category;

        const calories = document.createElement('div');
        calories.className = 'entry-calorie';
        calories.textContent = cal.calorie;

        el.appendChild(exp);
        el.appendChild(cat);
        el.appendChild(calories);

        // index for actions
        const idx = calorieActivities.indexOf(cal);
        if (idx >= 0) el.setAttribute('data-idx', String(idx));

        const actions = document.createElement('div');
        actions.className = 'activity-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            const i = Number(el.getAttribute('data-idx'));
            if (i >= 0) startEditCalorie(i);
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'action-btn delete-btn';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => {
            const i = Number(el.getAttribute('data-idx'));
            if (i >= 0) deleteCalorie(i);
        });

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        el.appendChild(actions);

        calorieActivityListEl.appendChild(el);
    });

    if (calorieActivities.length > end) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'show-more-btn';
        moreBtn.textContent = 'Show more';
        moreBtn.addEventListener('click', () => {
            caloriePage += 1;
            renderCalorieActivities();
        });
        calorieActivityListEl.appendChild(moreBtn);
    }
    updateStats();
}

function deleteCalorie(index) {
    if (!Number.isFinite(index)) return;
    if (!confirm('Delete this calorie entry?')) return;
    calorieActivities.splice(index, 1);
    saveData();
    renderCalorieActivities();
}

function startEditCalorie(index) {
    const item = calorieActivities[index];
    if (!item) return;
    calorieEditIndex = index;
    const overlay = document.getElementById('calorieEditModalOverlay');
    const nameEl = document.getElementById('calorieName');
    const calEl = document.getElementById('calorieCount');
    const catEl = document.getElementById('calorieCategory');
    if (overlay) overlay.classList.add('active');
    if (nameEl) nameEl.value = item.expense || '';
    if (calEl) calEl.value = item.calorie || '';
    if (catEl) catEl.value = item.category || 'Other';
}

function formatCurrency(n) {
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(Math.round(n));
    return `${sign} ₹${abs.toLocaleString()}`;
}

function updateStats() {
    const incomeStatEl = document.getElementById('incomeStat');
    const expensesStatEl = document.getElementById('expensesStat');
    const totalStatEl = document.getElementById('totalStat');
    const caloriesStatEl = document.getElementById('caloriesStat');

    const incomeSum = activities.reduce((s, it) => s + (it.amount > 0 ? it.amount : 0), 0);
    const expensesSum = activities.reduce((s, it) => s + (it.amount < 0 ? Math.abs(it.amount) : 0), 0);
    const net = incomeSum - expensesSum;
    const caloriesSum = calorieActivities.reduce((s, it) => s + (Number(it.calorie) || 0), 0);

    if (incomeStatEl) incomeStatEl.textContent = formatCurrency(incomeSum);
    if (expensesStatEl) expensesStatEl.textContent = formatCurrency(expensesSum);
    if (totalStatEl) totalStatEl.textContent = formatCurrency(net);
    if (caloriesStatEl) caloriesStatEl.textContent = String(caloriesSum);
}

// Calorie edit modal handlers
const calorieEditModalOverlay = document.getElementById('calorieEditModalOverlay');
const calorieEditModalClose = document.getElementById('calorieEditModalClose');
const calorieEditCancel = document.getElementById('calorieEditCancel');
const calorieEditForm = document.getElementById('calorieEditForm');

if (calorieEditModalClose) calorieEditModalClose.addEventListener('click', () => {
    if (calorieEditModalOverlay) calorieEditModalOverlay.classList.remove('active');
    calorieEditIndex = null;
    if (calorieEditForm) calorieEditForm.reset();
});
if (calorieEditCancel) calorieEditCancel.addEventListener('click', () => {
    if (calorieEditModalOverlay) calorieEditModalOverlay.classList.remove('active');
    calorieEditIndex = null;
    if (calorieEditForm) calorieEditForm.reset();
});
if (calorieEditModalOverlay) calorieEditModalOverlay.addEventListener('click', (e) => {
    if (e.target === calorieEditModalOverlay) {
        calorieEditModalOverlay.classList.remove('active');
        calorieEditIndex = null;
        if (calorieEditForm) calorieEditForm.reset();
    }
});

if (calorieEditForm) {
    calorieEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameEl = document.getElementById('calorieName');
        const calEl = document.getElementById('calorieCount');
        const catEl = document.getElementById('calorieCategory');
        const name = nameEl.value.trim();
        const cal = Number(calEl.value || 0);
        const cat = catEl.value;
        if (!name || !cal) {
            alert('Provide name and calories');
            return;
        }
        if (calorieEditIndex !== null) {
            calorieActivities[calorieEditIndex].expense = name;
            calorieActivities[calorieEditIndex].calorie = cal;
            calorieActivities[calorieEditIndex].category = cat;
            calorieEditIndex = null;
        }
        saveData();
        renderCalorieActivities();
        if (calorieEditModalOverlay) calorieEditModalOverlay.classList.remove('active');
        if (calorieEditForm) calorieEditForm.reset();
    });
}

// Initial render for calorie activities
// load persisted data and render both lists
loadData();
renderActivities(initialPeriod);
renderCalorieActivities();

// -------- Expense modal logic (FAB) --------
const expenseModalOverlay = document.getElementById('expenseModalOverlay');
const expenseModalClose = document.getElementById('expenseModalClose');
const expenseCancel = document.getElementById('expenseCancel');
const expenseForm = document.getElementById('expenseForm');
const expenseAmount = document.getElementById('expenseAmount');
const expenseCategory = document.getElementById('expenseCategory');
const expenseNote = document.getElementById('expenseNote');

function openExpenseModal() {
    if (!expenseModalOverlay) return;
    expenseModalOverlay.classList.add('active');
    expenseModalOverlay.setAttribute('aria-hidden', 'false');
    // focus amount input
    setTimeout(() => { if (expenseAmount) expenseAmount.focus(); }, 80);
}

function closeExpenseModal() {
    if (!expenseModalOverlay) return;
    expenseModalOverlay.classList.remove('active');
    expenseModalOverlay.setAttribute('aria-hidden', 'true');
    if (expenseForm) expenseForm.reset();
}

if (expenseModalClose) expenseModalClose.addEventListener('click', closeExpenseModal);
if (expenseCancel) expenseCancel.addEventListener('click', closeExpenseModal);

// Prevent clicks inside modal from closing other UI unintentionally
if (expenseModalOverlay) {
    expenseModalOverlay.addEventListener('click', (e) => {
        if (e.target === expenseModalOverlay) closeExpenseModal();
    });
}

if (expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amtVal = Number(expenseAmount.value || 0);
        if (!amtVal || isNaN(amtVal)) {
            alert('Please enter a valid amount');
            return;
        }

        const catVal = expenseCategory.value.trim();
        const noteVal = expenseNote.value.trim();

        // Build a simple date string similar to existing entries
        const now = new Date();
        const weekday = now.toLocaleString('en-US', { weekday: 'short' });
        const dateStr = `${now.getDate()}/${now.getMonth() + 1} (${weekday})`;

        // Add as expense (negative amount)
        if (expenseEditIndex !== null) {
            // update existing
            activities[expenseEditIndex].amount = -Math.abs(amtVal);
            activities[expenseEditIndex].category = catVal || '';
            activities[expenseEditIndex].note = noteVal;
            activities[expenseEditIndex].date = dateStr;
            expenseEditIndex = null;
        } else {
            const newEntry = {
                date: dateStr,
                amount: -Math.abs(amtVal),
                type: 'expense',
                period: currentFilter || 'Daily',
                note: noteVal,
                category: catVal || ''
            };
            activities.unshift(newEntry);
        }

        // Reset to first page and re-render
        activityPage = 1;
        saveData();
        renderActivities();

        closeExpenseModal();
    });
}

// -------- Income modal logic (FAB) --------
const incomeModalOverlay = document.getElementById('incomeModalOverlay');
const incomeModalClose = document.getElementById('incomeModalClose');
const incomeCancel = document.getElementById('incomeCancel');
const incomeForm = document.getElementById('incomeForm');
const incomeAmount = document.getElementById('incomeAmount');
const incomeCategory = document.getElementById('incomeCategory');
const incomeNote = document.getElementById('incomeNote');

function openIncomeModal() {
    if (!incomeModalOverlay) return;
    incomeModalOverlay.classList.add('active');
    incomeModalOverlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => { if (incomeAmount) incomeAmount.focus(); }, 80);
}

function closeIncomeModal() {
    if (!incomeModalOverlay) return;
    incomeModalOverlay.classList.remove('active');
    incomeModalOverlay.setAttribute('aria-hidden', 'true');
    if (incomeForm) incomeForm.reset();
}

if (incomeModalClose) incomeModalClose.addEventListener('click', closeIncomeModal);
if (incomeCancel) incomeCancel.addEventListener('click', closeIncomeModal);

if (incomeModalOverlay) {
    incomeModalOverlay.addEventListener('click', (e) => {
        if (e.target === incomeModalOverlay) closeIncomeModal();
    });
}

if (incomeForm) {
    incomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amtVal = Number(incomeAmount.value || 0);
        if (!amtVal || isNaN(amtVal)) {
            alert('Please enter a valid amount');
            return;
        }

        const catVal = incomeCategory.value;
        const noteVal = incomeNote.value.trim();

        const now = new Date();
        const weekday = now.toLocaleString('en-US', { weekday: 'short' });
        const dateStr = `${now.getDate()}/${now.getMonth() + 1} (${weekday})`;

        if (incomeEditIndex !== null) {
            activities[incomeEditIndex].amount = Math.abs(amtVal);
            activities[incomeEditIndex].category = catVal || '';
            activities[incomeEditIndex].note = noteVal;
            activities[incomeEditIndex].date = dateStr;
            incomeEditIndex = null;
        } else {
            const newEntry = {
                date: dateStr,
                amount: Math.abs(amtVal),
                type: 'income',
                period: currentFilter || 'Daily',
                note: noteVal,
                category: catVal || ''
            };
            activities.unshift(newEntry);
        }

        activityPage = 1;
        saveData();
        renderActivities();

        closeIncomeModal();
    });
}
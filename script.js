const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('mainContent');

// Month filtering constants
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
let selectedMonth = new Date().getMonth(); // Default to current month (0-11)

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

// Month dropdown - click based
const monthButton = document.getElementById('monthButton');
const monthDropdown = document.getElementById('monthDropdown');
const monthOptions = document.querySelectorAll('#monthDropdown a');

// Set default month button text to current month
if (monthButton) {
    monthButton.textContent = monthNames[selectedMonth];
}

// Make month dropdown click-based instead of hover
if (monthButton && monthDropdown) {
    // Remove hover behavior and add click behavior
    const monthDropdownParent = monthButton.closest('.month-dropdown');
    if (monthDropdownParent) {
        monthDropdownParent.classList.add('click-based');
    }

    monthButton.addEventListener('click', (e) => {
        e.stopPropagation();
        monthDropdown.classList.toggle('active');
    });
}

// Close month menu when clicking outside
document.addEventListener('click', (e) => {
    if (monthDropdown && !monthDropdown.contains(e.target) &&
        monthButton && !monthButton.contains(e.target)) {
        monthDropdown.classList.remove('active');
    }
});

// Prevent closing when clicking inside the menu
if (monthDropdown) {
    monthDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Handle month selection
monthOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        const monthIndex = parseInt(option.getAttribute('data-month'));
        selectedMonth = monthIndex;

        // Update button text
        if (monthButton) {
            monthButton.textContent = monthNames[selectedMonth];
        }

        // Close dropdown
        if (monthDropdown) {
            monthDropdown.classList.remove('active');
        }

        // Reset pages and re-render everything
        activityPage = 1;
        caloriePage = 1;
        const activePeriod = document.querySelector('.option-btn.active')?.textContent.trim() || 'Daily';
        if (activePeriod === 'Monthly') {
            renderMonthlyTable();
        } else if (activePeriod === 'Calendar') {
            renderCalendar();
        } else {
            renderActivities();
        }
        renderCalorieActivities();
        updateStats();

        // Refresh charts if in statistics mode
        if (statisticsMode) {
            renderStatisticsCharts();
        }
    });
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

        // Open the food dialog when clicking the Food option
        if (selectedOption === 'food') {
            openFoodModal();
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
// Note: month is 0-based (0=January, 11=December)
const currentYear = new Date().getFullYear();
let activities = [
    { date: '12/4 (Mon)', amount: -120, type: 'expense', period: 'Daily', note: 'Bought groceries', category: 'Groceries', month: 3, year: currentYear }, // April
    { date: '11/4 (Sun)', amount: 110, type: 'income', period: 'Daily', note: 'Salary (partial)', category: 'Salary', month: 3, year: currentYear }, // April
    { date: '10/4 (Sat)', amount: -130, type: 'expense', period: 'Monthly', note: 'Dinner out', category: 'Dining', month: 3, year: currentYear }, // April
    { date: '09/4 (Fri)', amount: 200, type: 'income', period: 'Monthly', note: 'Freelance', category: 'Freelance', month: 3, year: currentYear }, // April
    { date: '05/4 (Tue)', amount: -90, type: 'expense', period: 'Calendar', note: 'Taxi', category: 'Transport', month: 3, year: currentYear }, // April
    { date: '01/4 (Wed)', amount: 500, type: 'income', period: 'Yearly', note: 'Bonus', category: 'Bonus', month: 3, year: currentYear } // April
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

// Helper function to extract month from date string (format: "12/4 (Mon)")
function getMonthFromDateString(dateStr) {
    if (!dateStr) return null;
    // Date format is "day/month (weekday)" - extract month
    const match = dateStr.match(/\/(\d+)\s*\(/);
    if (match) {
        return parseInt(match[1]) - 1; // Convert to 0-based month index
    }
    return null;
}

// Helper function to get month from activity (checks month property or extracts from date)
function getActivityMonth(activity) {
    if (activity.month !== undefined) {
        return activity.month;
    }
    return getMonthFromDateString(activity.date);
}

// Helper function to get year from activity
function getActivityYear(activity) {
    if (activity.year !== undefined) {
        return activity.year;
    }
    // Extract year from date string or default to current year
    if (activity.date) {
        // Try to extract year from date if available, otherwise use current year
        const currentYear = new Date().getFullYear();
        return currentYear;
    }
    return new Date().getFullYear();
}

// Filter activities by selected month
function filterActivitiesByMonth(items) {
    return items.filter(it => {
        const itemMonth = getActivityMonth(it);
        // If month is null (backward compatibility), include it only if it's the current month
        if (itemMonth === null) {
            return false; // Don't show items without month info when filtering
        }
        return itemMonth === selectedMonth;
    });
}

function renderActivities(filterPeriod) {
    if (!activityListEl) return;
    // If a filter is supplied, treat it as a filter change and reset page
    if (filterPeriod !== undefined) {
        currentFilter = filterPeriod || null;
        activityPage = 1;
    }

    clearActivities();

    // First filter by period, then by month
    let items = activities.filter(it => !currentFilter || it.period === currentFilter);
    items = filterActivitiesByMonth(items);

    if (items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'activity-item';
        empty.textContent = 'No data present';
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

    // Refresh charts if in statistics mode
    if (statisticsMode) {
        renderStatisticsCharts();
    }
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

// Calculate monthly totals for all months across all years
function calculateMonthlyTotals() {
    const monthlyDataMap = new Map(); // Use Map to group by year-month

    // Get all unique year-month combinations from activities
    activities.forEach(act => {
        const actMonth = getActivityMonth(act);
        const actYear = getActivityYear(act);

        if (actMonth === null) return; // Skip if month is invalid

        const key = `${actYear}-${actMonth}`;

        if (!monthlyDataMap.has(key)) {
            monthlyDataMap.set(key, {
                year: actYear,
                month: actMonth,
                monthName: monthNames[actMonth],
                totalIncome: 0,
                totalExpenditure: 0,
                total: 0
            });
        }

        const data = monthlyDataMap.get(key);
        if (act.amount > 0) {
            data.totalIncome += act.amount;
        } else {
            data.totalExpenditure += Math.abs(act.amount);
        }
        data.total = data.totalIncome - data.totalExpenditure;
    });

    // Convert Map to Array and sort by year-month descending (latest first)
    const monthlyData = Array.from(monthlyDataMap.values());
    monthlyData.sort((a, b) => {
        // Sort by year descending, then by month descending
        if (b.year !== a.year) {
            return b.year - a.year;
        }
        return b.month - a.month;
    });

    return monthlyData;
}

// Render monthly summary table
function renderMonthlyTable() {
    if (!activityListEl) return;

    clearActivities();

    const monthlyData = calculateMonthlyTotals();

    // Create table container
    const tableContainer = document.createElement('div');
    tableContainer.className = 'monthly-table-container';

    // Create table
    const table = document.createElement('table');
    table.className = 'monthly-table';

    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Months', 'Total Income', 'Total Expenditure', 'Total'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');

    monthlyData.forEach(data => {
        const row = document.createElement('tr');
        row.className = 'monthly-table-row';

        // Month name with year
        const monthCell = document.createElement('td');
        monthCell.className = 'monthly-table-month';
        monthCell.textContent = `${data.monthName} ${data.year}`;
        row.appendChild(monthCell);

        // Total Income
        const incomeCell = document.createElement('td');
        incomeCell.className = 'monthly-table-income';
        incomeCell.textContent = formatCurrency(data.totalIncome);
        row.appendChild(incomeCell);

        // Total Expenditure
        const expenditureCell = document.createElement('td');
        expenditureCell.className = 'monthly-table-expenditure';
        expenditureCell.textContent = formatCurrency(data.totalExpenditure);
        row.appendChild(expenditureCell);

        // Total (with conditional styling)
        const totalCell = document.createElement('td');
        totalCell.className = 'monthly-table-total';
        totalCell.textContent = formatCurrency(data.total);
        if (data.total < 0) {
            totalCell.classList.add('negative');
        } else if (data.total > 0) {
            totalCell.classList.add('positive');
        }
        row.appendChild(totalCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    activityListEl.appendChild(tableContainer);
}

// Calculate daily totals for the selected month
function calculateDailyTotals() {
    const currentYear = new Date().getFullYear();
    const year = selectedMonth !== null ? currentYear : currentYear;
    const dailyDataMap = new Map();

    // Filter activities for the selected month and year
    const monthActivities = activities.filter(act => {
        const actMonth = getActivityMonth(act);
        const actYear = getActivityYear(act);
        return actMonth === selectedMonth && actYear === year;
    });

    // Group by day
    monthActivities.forEach(act => {
        // Extract day from date string (format: "12/4 (Mon)")
        const dayMatch = act.date.match(/^(\d+)\//);
        if (!dayMatch) return;

        const day = parseInt(dayMatch[1]);
        const key = day;

        if (!dailyDataMap.has(key)) {
            dailyDataMap.set(key, {
                day: day,
                totalIncome: 0,
                totalExpenditure: 0
            });
        }

        const data = dailyDataMap.get(key);
        if (act.amount > 0) {
            data.totalIncome += act.amount;
        } else {
            data.totalExpenditure += Math.abs(act.amount);
        }
    });

    return dailyDataMap;
}

// Render calendar view
function renderCalendar() {
    if (!activityListEl) return;

    clearActivities();

    const currentYear = new Date().getFullYear();
    const year = currentYear;

    // Get first day of month and number of days
    const firstDay = new Date(year, selectedMonth, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();

    // Get daily totals
    const dailyTotals = calculateDailyTotals();

    // Create calendar container
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'calendar-container';

    // Create header with month and year
    const calendarHeader = document.createElement('div');
    calendarHeader.className = 'calendar-header';
    calendarHeader.textContent = `${monthNames[selectedMonth]} ${year}`;
    calendarContainer.appendChild(calendarHeader);

    // Create day labels (Sun, Mon, Tue, etc.)
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayLabelsRow = document.createElement('div');
    dayLabelsRow.className = 'calendar-day-labels';
    dayLabels.forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'calendar-day-label';
        dayLabel.textContent = day;
        dayLabelsRow.appendChild(dayLabel);
    });
    calendarContainer.appendChild(dayLabelsRow);

    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-cell calendar-cell-empty';
        calendarGrid.appendChild(emptyCell);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';

        const dayData = dailyTotals.get(day) || { totalIncome: 0, totalExpenditure: 0 };

        // Date number
        const dateNumber = document.createElement('div');
        dateNumber.className = 'calendar-date';
        dateNumber.textContent = day;
        cell.appendChild(dateNumber);

        // Income (if any)
        if (dayData.totalIncome > 0) {
            const incomeDiv = document.createElement('div');
            incomeDiv.className = 'calendar-income';
            const incomeFormatted = formatCurrency(dayData.totalIncome);
            incomeDiv.textContent = incomeFormatted.startsWith('+') ? incomeFormatted : `+${incomeFormatted}`;
            cell.appendChild(incomeDiv);
        }

        // Expenditure (if any)
        if (dayData.totalExpenditure > 0) {
            const expenditureDiv = document.createElement('div');
            expenditureDiv.className = 'calendar-expenditure';
            const expFormatted = formatCurrency(-dayData.totalExpenditure);
            expenditureDiv.textContent = expFormatted;
            cell.appendChild(expenditureDiv);
        }

        calendarGrid.appendChild(cell);
    }

    calendarContainer.appendChild(calendarGrid);
    activityListEl.appendChild(calendarContainer);
}

// Wire option buttons to filter the activity list
optionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        optionButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const period = btn.textContent.trim();

        // If Monthly is selected, show the monthly table
        if (period === 'Monthly') {
            renderMonthlyTable();
        } else if (period === 'Calendar') {
            // If Calendar is selected, show the calendar view
            renderCalendar();
        } else {
            // Otherwise, show regular activity list
            renderActivities(period);
        }
    });
});

// Initial render using active button (or Daily by default)
const activeBtn = document.querySelector('.option-btn.active');
const initialPeriod = activeBtn ? activeBtn.textContent.trim() : 'Daily';
// (render will happen after calorie data is initialized)

// Calorie Activity List Data + Rendering
let calorieActivities = [
    { expense: 'Pizza', calorie: 280, category: 'Fast Food', month: 3 }, // April
    { expense: 'Salad', calorie: 120, category: 'Healthy', month: 3 }, // April
    { expense: 'Burger', calorie: 540, category: 'Fast Food', month: 3 }, // April
    { expense: 'Smoothie', calorie: 150, category: 'Beverage', month: 3 }, // April
    { expense: 'Sandwich', calorie: 350, category: 'Lunch', month: 3 } // April
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

        // Backward compatibility: add month and year to activities that don't have it
        const currentYear = new Date().getFullYear();
        activities.forEach(act => {
            if (act.month === undefined) {
                act.month = getMonthFromDateString(act.date);
            }
            if (act.year === undefined) {
                act.year = currentYear; // Default to current year for backward compatibility
            }
        });

        // Backward compatibility: add month to calorie activities that don't have it
        calorieActivities.forEach(cal => {
            if (cal.month === undefined) {
                // Default to current month for backward compatibility
                cal.month = new Date().getMonth();
            }
        });
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

    // Filter calorie activities by month
    let filteredCalories = calorieActivities.filter(cal => {
        const calMonth = cal.month !== undefined ? cal.month : null;
        // If no month property, assume current month for backward compatibility
        // In production, you'd want to add month when creating entries
        return calMonth === null || calMonth === selectedMonth;
    });

    if (filteredCalories.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'calorie-activity-item';
        empty.textContent = 'No data present';
        calorieActivityListEl.appendChild(empty);
        return;
    }

    const start = (caloriePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = filteredCalories.slice(start, end);

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

        // index for actions - need to find original index in full array
        const originalIdx = calorieActivities.findIndex(c =>
            c.expense === cal.expense &&
            c.calorie === cal.calorie &&
            c.category === cal.category &&
            (cal.month === undefined || c.month === cal.month)
        );
        if (originalIdx >= 0) el.setAttribute('data-idx', String(originalIdx));

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

    if (filteredCalories.length > end) {
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

    // Refresh charts if in statistics mode
    if (statisticsMode) {
        renderStatisticsCharts();
    }
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

    // Filter activities by selected month
    const monthFilteredActivities = filterActivitiesByMonth(activities);

    // Filter calorie activities by selected month
    const monthFilteredCalories = calorieActivities.filter(cal => {
        const calMonth = cal.month !== undefined ? cal.month : null;
        return calMonth === null || calMonth === selectedMonth;
    });

    const incomeSum = monthFilteredActivities.reduce((s, it) => s + (it.amount > 0 ? it.amount : 0), 0);
    const expensesSum = monthFilteredActivities.reduce((s, it) => s + (it.amount < 0 ? Math.abs(it.amount) : 0), 0);
    const net = incomeSum - expensesSum;
    const caloriesSum = monthFilteredCalories.reduce((s, it) => s + (Number(it.calorie) || 0), 0);

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

        // Refresh charts if in statistics mode
        if (statisticsMode) {
            renderStatisticsCharts();
        }

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
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Add as expense (negative amount)
        if (expenseEditIndex !== null) {
            // update existing
            activities[expenseEditIndex].amount = -Math.abs(amtVal);
            activities[expenseEditIndex].category = catVal || '';
            activities[expenseEditIndex].note = noteVal;
            activities[expenseEditIndex].date = dateStr;
            activities[expenseEditIndex].month = currentMonth;
            activities[expenseEditIndex].year = currentYear;
            expenseEditIndex = null;
        } else {
            const newEntry = {
                date: dateStr,
                amount: -Math.abs(amtVal),
                type: 'expense',
                period: currentFilter || 'Daily',
                note: noteVal,
                category: catVal || '',
                month: currentMonth,
                year: currentYear
            };
            activities.unshift(newEntry);
        }

        // Reset to first page and re-render
        activityPage = 1;
        saveData();
        renderActivities();

        // Refresh charts if in statistics mode
        if (statisticsMode) {
            renderStatisticsCharts();
        }

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
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        if (incomeEditIndex !== null) {
            activities[incomeEditIndex].amount = Math.abs(amtVal);
            activities[incomeEditIndex].category = catVal || '';
            activities[incomeEditIndex].note = noteVal;
            activities[incomeEditIndex].date = dateStr;
            activities[incomeEditIndex].month = currentMonth;
            activities[incomeEditIndex].year = currentYear;
            incomeEditIndex = null;
        } else {
            const newEntry = {
                date: dateStr,
                amount: Math.abs(amtVal),
                type: 'income',
                period: currentFilter || 'Daily',
                note: noteVal,
                category: catVal || '',
                month: currentMonth,
                year: currentYear
            };
            activities.unshift(newEntry);
        }

        activityPage = 1;
        saveData();
        renderActivities();

        // Refresh charts if in statistics mode
        if (statisticsMode) {
            renderStatisticsCharts();
        }

        closeIncomeModal();
    });
}

// -------- Food modal logic (FAB) --------
const foodModalOverlay = document.getElementById('foodModalOverlay');
const foodModalClose = document.getElementById('foodModalClose');
const foodCancel = document.getElementById('foodCancel');
const foodForm = document.getElementById('foodForm');
const foodAmount = document.getElementById('foodAmount');
const foodCategory = document.getElementById('foodCategory');
const foodCalorie = document.getElementById('foodCalorie');
const foodNote = document.getElementById('foodNote');

function openFoodModal() {
    if (!foodModalOverlay) return;
    foodModalOverlay.classList.add('active');
    foodModalOverlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => { if (foodAmount) foodAmount.focus(); }, 80);
}

function closeFoodModal() {
    if (!foodModalOverlay) return;
    foodModalOverlay.classList.remove('active');
    foodModalOverlay.setAttribute('aria-hidden', 'true');
    if (foodForm) foodForm.reset();
}

if (foodModalClose) foodModalClose.addEventListener('click', closeFoodModal);
if (foodCancel) foodCancel.addEventListener('click', closeFoodModal);

if (foodModalOverlay) {
    foodModalOverlay.addEventListener('click', (e) => {
        if (e.target === foodModalOverlay) closeFoodModal();
    });
}

// Disable keyboard input on category select field
if (foodCategory) {
    foodCategory.addEventListener('keydown', (e) => {
        // Allow only arrow keys, Enter, and Escape for navigation
        const allowedKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Tab'];
        if (!allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    });

    // Prevent typing in the select field
    foodCategory.addEventListener('keypress', (e) => {
        e.preventDefault();
    });
}

if (foodForm) {
    foodForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const amountVal = Number(foodAmount.value || 0);
        if (!amountVal || isNaN(amountVal) || amountVal <= 0) {
            alert('Please enter a valid amount (must be greater than 0)');
            return;
        }

        const categoryVal = foodCategory.value.trim();
        if (!categoryVal || !['healthy', 'junk', 'homefood'].includes(categoryVal)) {
            alert('Please select a valid category (healthy, junk, or homefood)');
            return;
        }

        const calorieVal = Number(foodCalorie.value || 0);
        if (!calorieVal || isNaN(calorieVal) || calorieVal <= 0) {
            alert('Please enter a valid calorie value (must be greater than 0)');
            return;
        }

        const noteVal = foodNote.value.trim();

        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Create a new food entry for calorie activities
        const weekday = now.toLocaleString('en-US', { weekday: 'short' });
        const dateStr = `${now.getDate()}/${now.getMonth() + 1} (${weekday})`;

        const newFoodEntry = {
            expense: noteVal || `Food - ${categoryVal}`,
            calorie: calorieVal,
            category: categoryVal.charAt(0).toUpperCase() + categoryVal.slice(1),
            amount: amountVal,
            month: currentMonth,
            year: currentYear,
            date: dateStr
        };

        // Add to calorie activities
        calorieActivities.unshift(newFoodEntry);

        // Also add to left side activity list (expenses/income)

        const newActivityEntry = {
            date: dateStr,
            amount: -Math.abs(amountVal), // Negative because it's an expense
            type: 'expense',
            period: currentFilter || 'Daily',
            note: noteVal || '',
            category: 'Food', // Fixed category for all food entries
            month: currentMonth,
            year: currentYear
        };

        activities.unshift(newActivityEntry);

        // Reset to first page and re-render both lists
        caloriePage = 1;
        activityPage = 1;
        saveData();
        renderCalorieActivities();
        renderActivities();

        // Refresh charts if in statistics mode
        if (statisticsMode) {
            renderStatisticsCharts();
        }

        closeFoodModal();
    });
}

// ============ Statistics Functionality ============
let statisticsMode = false;
let activityCategoryChartInstance = null;
let calorieCategoryChartInstance = null;
let junkFoodBarChartInstance = null;

const statisticsBtn = document.getElementById('statisticsBtn');
const activityStatisticsView = document.getElementById('activityStatisticsView');
const calorieStatisticsView = document.getElementById('calorieStatisticsView');

// Note: activityListEl and calorieActivityListEl are already declared earlier in the file

// Statistics button click handler
if (statisticsBtn) {
    statisticsBtn.addEventListener('click', () => {
        statisticsMode = !statisticsMode;
        toggleStatisticsView();
    });
}

function toggleStatisticsView() {
    const optionButtons = document.querySelectorAll('.option-btn');
    const comparativeLink = document.getElementById('comparativeLink');
    const statsContainer = document.querySelector('.stats-container');
    const mainContent = document.getElementById('mainContent');

    if (statisticsMode) {
        // Show statistics, hide lists
        if (activityListEl) activityListEl.style.display = 'none';
        if (calorieActivityListEl) calorieActivityListEl.style.display = 'none';
        if (activityStatisticsView) activityStatisticsView.style.display = 'block';
        if (calorieStatisticsView) calorieStatisticsView.style.display = 'block';

        // Disable option buttons (Daily, Monthly, Calendar, Yearly)
        optionButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
        });

        // Disable Comparative button
        if (comparativeLink) {
            comparativeLink.style.pointerEvents = 'none';
            comparativeLink.style.opacity = '0.5';
            comparativeLink.classList.add('disabled');
        }

        // Add statistics view class to change background
        if (statsContainer) statsContainer.classList.add('statistics-active');
        if (mainContent) mainContent.classList.add('statistics-active');

        // Render charts
        renderStatisticsCharts();
    } else {
        // Show lists, hide statistics
        if (activityListEl) activityListEl.style.display = '';
        if (calorieActivityListEl) calorieActivityListEl.style.display = '';
        if (activityStatisticsView) activityStatisticsView.style.display = 'none';
        if (calorieStatisticsView) calorieStatisticsView.style.display = 'none';

        // Enable option buttons
        optionButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('disabled');
        });

        // Enable Comparative button
        if (comparativeLink) {
            comparativeLink.style.pointerEvents = '';
            comparativeLink.style.opacity = '';
            comparativeLink.classList.remove('disabled');
        }

        // Remove statistics view class
        if (statsContainer) statsContainer.classList.remove('statistics-active');
        if (mainContent) mainContent.classList.remove('statistics-active');

        // Destroy charts to free memory
        destroyCharts();
    }
}

// Destroy all chart instances
function destroyCharts() {
    if (activityCategoryChartInstance) {
        activityCategoryChartInstance.destroy();
        activityCategoryChartInstance = null;
    }
    // Clear legend
    const legendContainer = document.getElementById('activityChartLegend');
    if (legendContainer) {
        legendContainer.innerHTML = '';
    }
    if (calorieCategoryChartInstance) {
        calorieCategoryChartInstance.destroy();
        calorieCategoryChartInstance = null;
    }
    if (junkFoodBarChartInstance) {
        junkFoodBarChartInstance.destroy();
        junkFoodBarChartInstance = null;
    }
}

// Render all statistics charts
function renderStatisticsCharts() {
    renderActivityCategoryChart();
    renderCalorieCategoryChart();
    renderJunkFoodBarChart();
}

// Generate data for activity category pie chart (left side)
function getActivityCategoryData() {
    // Filter activities by selected month
    const monthFilteredActivities = filterActivitiesByMonth(activities);

    const categoryTotals = {};

    monthFilteredActivities.forEach(activity => {
        const category = activity.category || 'Other';
        const amount = Math.abs(activity.amount);

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    return { labels, data };
}

// Render activity category pie chart
function renderActivityCategoryChart() {
    const ctx = document.getElementById('activityCategoryChart');
    if (!ctx) return;

    // Destroy existing chart if any
    if (activityCategoryChartInstance) {
        activityCategoryChartInstance.destroy();
    }

    const { labels, data } = getActivityCategoryData();

    if (data.length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        // Clear legend
        const legendContainer = document.getElementById('activityChartLegend');
        if (legendContainer) {
            legendContainer.innerHTML = '';
        }
        return;
    }

    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c',
        '#4facfe', '#00f2fe', '#fa709a', '#fee140',
        '#43e97b', '#38f9d7', '#ff6b6b', '#ffa726',
        '#66bb6a', '#ab47bc', '#ec407a'
    ];

    activityCategoryChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide default legend, we'll show custom one below
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ₹${value.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });

    // Render custom legend with totals below the chart
    renderActivityChartLegend(labels, data, colors.slice(0, labels.length));
}

// Render custom legend for activity category chart
function renderActivityChartLegend(labels, data, colors) {
    const legendContainer = document.getElementById('activityChartLegend');
    if (!legendContainer) return;

    legendContainer.innerHTML = '';

    labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[index];

        const labelText = document.createElement('span');
        labelText.className = 'legend-label';
        labelText.textContent = label;

        const valueText = document.createElement('span');
        valueText.className = 'legend-value';
        valueText.textContent = `₹${data[index].toLocaleString()}`;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        legendItem.appendChild(valueText);
        legendContainer.appendChild(legendItem);
    });
}

// Map calorie category to standardized categories (junk/healthy/homefood)
function mapCalorieCategory(category) {
    if (!category) return 'Other';

    const lowerCategory = category.toLowerCase();

    // Map to junk
    if (lowerCategory === 'junk' ||
        lowerCategory === 'fast food' ||
        lowerCategory === 'dessert' ||
        lowerCategory === 'unhealthy') {
        return 'Junk';
    }

    // Map to healthy
    if (lowerCategory === 'healthy' ||
        lowerCategory === 'salad' ||
        lowerCategory === 'fruit' ||
        lowerCategory === 'vegetable') {
        return 'Healthy';
    }

    // Map to homefood
    if (lowerCategory === 'homefood' ||
        lowerCategory === 'home food' ||
        lowerCategory === 'homecooked' ||
        lowerCategory === 'lunch' ||
        lowerCategory === 'dinner') {
        return 'Homefood';
    }

    // Default to Other for unknown categories
    return 'Other';
}

// Generate data for calorie category pie chart (right side)
function getCalorieCategoryData() {
    // Filter calorie activities by selected month
    const monthFilteredCalories = calorieActivities.filter(cal => {
        const calMonth = cal.month !== undefined ? cal.month : null;
        return calMonth === null || calMonth === selectedMonth;
    });

    const categoryTotals = {
        'Junk': 0,
        'Healthy': 0,
        'Homefood': 0
    };

    monthFilteredCalories.forEach(cal => {
        const mappedCategory = mapCalorieCategory(cal.category);
        const calorie = Number(cal.calorie) || 0;

        if (categoryTotals.hasOwnProperty(mappedCategory)) {
            categoryTotals[mappedCategory] += calorie;
        }
    });

    const labels = [];
    const data = [];

    // Only include categories that have data
    Object.keys(categoryTotals).forEach(cat => {
        if (categoryTotals[cat] > 0) {
            labels.push(cat);
            data.push(categoryTotals[cat]);
        }
    });

    return { labels, data };
}

// Render calorie category pie chart
function renderCalorieCategoryChart() {
    const ctx = document.getElementById('calorieCategoryChart');
    if (!ctx) return;

    // Destroy existing chart if any
    if (calorieCategoryChartInstance) {
        calorieCategoryChartInstance.destroy();
    }

    const { labels, data } = getCalorieCategoryData();

    if (data.length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        return;
    }

    // Define colors for each category
    const colorMap = {
        'Junk': '#f5576c',
        'Healthy': '#43e97b',
        'Homefood': '#667eea'
    };

    const backgroundColors = labels.map(label => colorMap[label] || '#999');

    calorieCategoryChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value} cal`;
                        }
                    }
                }
            }
        }
    });
}

// Generate data for junk food calories bar chart by day
function getJunkFoodBarChartData() {
    // Filter calorie activities by selected month
    const monthFilteredCalories = calorieActivities.filter(cal => {
        const calMonth = cal.month !== undefined ? cal.month : null;
        return calMonth === null || calMonth === selectedMonth;
    });

    // Filter only junk food
    const junkFoodEntries = monthFilteredCalories.filter(cal => {
        const mappedCategory = mapCalorieCategory(cal.category);
        return mappedCategory === 'Junk';
    });

    // Group by day - extract day from date or use expense field
    const dailyJunkTotals = {};

    junkFoodEntries.forEach(cal => {
        // Try to extract day from date field if available
        let day = null;
        if (cal.date) {
            const dayMatch = cal.date.match(/^(\d+)\//);
            if (dayMatch) {
                day = parseInt(dayMatch[1]);
            }
        }

        // If no date, try to use a default or skip
        if (!day) {
            // Use current date as fallback or skip
            day = new Date().getDate();
        }

        if (!dailyJunkTotals[day]) {
            dailyJunkTotals[day] = 0;
        }

        const calorie = Number(cal.calorie) || 0;
        dailyJunkTotals[day] += calorie;
    });

    // Sort days and prepare data
    const sortedDays = Object.keys(dailyJunkTotals).map(Number).sort((a, b) => a - b);
    const labels = sortedDays.map(day => `${day}/${selectedMonth + 1}`);
    const data = sortedDays.map(day => dailyJunkTotals[day]);

    return { labels, data };
}

// Render junk food calories bar chart
function renderJunkFoodBarChart() {
    const ctx = document.getElementById('junkFoodBarChart');
    if (!ctx) return;

    // Destroy existing chart if any
    if (junkFoodBarChartInstance) {
        junkFoodBarChartInstance.destroy();
    }

    const { labels, data } = getJunkFoodBarChartData();

    if (data.length === 0) {
        ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
        return;
    }

    junkFoodBarChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Junk Food Calories',
                data: data,
                backgroundColor: 'rgba(245, 87, 108, 0.1)',
                borderColor: '#f5576c',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#f5576c',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Calories'
                    },
                    ticks: {
                        stepSize: 100
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Days'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.parsed.y} cal`;
                        }
                    }
                }
            }
        }
    });
}
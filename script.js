
// Updated JavaScript for Income Expense Calculator with fully functional filters and local storage

let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editId = null;
let currentFilter = 'all';

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const entriesList = document.getElementById('entries-list');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpensesDisplay = document.getElementById('total-expenses');
const netBalanceDisplay = document.getElementById('net-balance');

// Function to add or edit an entry
function addEntry() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (!description || isNaN(amount) || amount <= 0) return;

    if (editId !== null) {
        const entry = entries.find(entry => entry.id === editId);
        entry.description = description;
        entry.amount = amount;
        entry.type = type;
        editId = null;
    } else {
        entries.push({ id: Date.now(), description, amount, type });
    }

    updateLocalStorage();
    displayEntries(currentFilter);
    resetForm();
}

// Function to display entries with optional filter
function displayEntries(filter = 'all') {
    entriesList.innerHTML = '';
    currentFilter = filter;

    const filteredEntries = filter === 'all' ? entries : entries.filter(entry => entry.type === filter);

    let totalIncome = 0;
    let totalExpenses = 0;

    entries.forEach(entry => {
        if (entry.type === 'income') {
            totalIncome += entry.amount;
        } else {
            totalExpenses += entry.amount;
        }
    });

    filteredEntries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'entry';
        entryElement.innerHTML = `
            <span>${entry.description}: ₹${entry.amount.toFixed(2)}</span>
            <button onclick="editEntry(${entry.id})">Edit</button>
            <button onclick="deleteEntry(${entry.id})">Delete</button>
        `;
        entriesList.appendChild(entryElement);
    });

    totalIncomeDisplay.textContent = `₹${totalIncome.toFixed(2)}`;
    totalExpensesDisplay.textContent = `₹${totalExpenses.toFixed(2)}`;
    netBalanceDisplay.textContent = `₹${(totalIncome - totalExpenses).toFixed(2)}`;
}

// Function to edit an existing entry
function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeInput.value = entry.type;
    editId = id;
}

// Function to delete an entry
function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    updateLocalStorage();
    displayEntries(currentFilter);
}

// Function to update local storage
function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Function to reset the input form
function resetForm() {
    descriptionInput.value = '';
    amountInput.value = '';
    typeInput.value = 'income';
    editId = null;
}

// Function to filter entries
function filterEntries(filter) {
    displayEntries(filter);
}

// Event listeners
window.onload = () => {
    document.getElementById('add-entry').addEventListener('click', addEntry);
    document.getElementById('reset').addEventListener('click', resetForm);
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', (e) => filterEntries(e.target.value));
    });
    displayEntries();
};



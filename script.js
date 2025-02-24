let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editId = null;

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const entriesList = document.getElementById('entries-list');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpensesDisplay = document.getElementById('total-expenses');
const netBalanceDisplay = document.getElementById('net-balance');

function addEntry() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

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
    displayEntries();
    resetForm();
}

function displayEntries(filter = 'all') {
    entriesList.innerHTML = '';

    const filteredEntries = filter === 'all' ? entries : entries.filter(entry => entry.type === filter);

    let totalIncome = 0;
    let totalExpenses = 0;

    filteredEntries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'entry';
        entryElement.innerHTML = `
            <span>${entry.description}: ₹${entry.amount.toFixed(2)}</span>
            <button onclick="editEntry(${entry.id})">Edit</button>
            <button onclick="deleteEntry(${entry.id})">Delete</button>
        `;
        entriesList.appendChild(entryElement);

        if (entry.type === 'income') {
            totalIncome += entry.amount;
        } else {
            totalExpenses += entry.amount;
        }
    });

    totalIncomeDisplay.textContent = `₹${totalIncome.toFixed(2)}`;
    totalExpensesDisplay.textContent = `₹${totalExpenses.toFixed(2)}`;
    netBalanceDisplay.textContent = `₹${(totalIncome - totalExpenses).toFixed(2)}`;
}

function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;
    editId = id;
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    updateLocalStorage();
    displayEntries();
}

function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

function resetForm() {
    descriptionInput.value = '';
    amountInput.value = '';
    typeSelect.value = 'income';
    editId = null;
}

function filterEntries(filter) {
    displayEntries(filter);
}

window.onload = () => {
    document.getElementById('add-entry').addEventListener('click', addEntry);
    document.getElementById('reset').addEventListener('click', resetForm);
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', (e) => filterEntries(e.target.value));
    });
    displayEntries();
};
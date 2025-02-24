let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editingId = null;

function addEntry() {
    const description = document.getElementById('description').value;
    let amount = parseFloat(document.getElementById('amount').value);
    if (!description || isNaN(amount)) return;

    const isExpense = document.querySelector('input[name="filter"]:checked').value === 'expense';
    amount = isExpense && amount > 0 ? -amount : amount;

    if (editingId !== null) {
        const index = entries.findIndex(entry => entry.id === editingId);
        if (index !== -1) {
            entries[index].description = description;
            entries[index].amount = amount;
            editingId = null;
        }
    } else {
        const entry = { description, amount, id: Date.now() };
        entries.push(entry);
    }

    updateLocalStorage();
    displayEntries();
    resetFields();
}

function resetFields() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    editingId = null;
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    updateLocalStorage();
    displayEntries();
}

function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
        document.getElementById('description').value = entry.description;
        document.getElementById('amount').value = Math.abs(entry.amount);
        editingId = id;
    }
}

function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

function displayEntries() {
    const list = document.getElementById('entries-list');
    list.innerHTML = '';
    let totalIncome = 0;
    let totalExpenses = 0;
    entries.forEach(entry => {
        const li = document.createElement('li');
        li.classList.add('entry');
        li.innerHTML = `${entry.description}: ₹${entry.amount} <button class="edit-btn" onclick="editEntry(${entry.id})">Edit</button> <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>`;
        list.appendChild(li);
        if (entry.amount > 0) {
            totalIncome += entry.amount;
        } else {
            totalExpenses += Math.abs(entry.amount);
        }
    });
    document.getElementById('total-income').textContent = `₹${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `₹${totalExpenses.toFixed(2)}`;
    document.getElementById('net-balance').textContent = `₹${(totalIncome - totalExpenses).toFixed(2)}`;
}

displayEntries();

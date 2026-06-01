let transactions = getFromStorage();
let currentEditingId = null;
let settings = getSettings();

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  renderTransactions(transactions, true);
  setupEventListeners();
  setupTheme();
  setupSettings();
  setupTabs();
  setupDatePicker();
}

function setupEventListeners() {
  const form = document.getElementById('transactionForm');
  if (form) {
    form.addEventListener('submit', handleTransactionSubmit);
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', handleSearch);
  }

  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleFilter);
  }

  const sortBy = document.getElementById('sortBy');
  if (sortBy) {
    sortBy.addEventListener('change', handleSort);
  }

  const importInput = document.getElementById('importInput');
  if (importInput) {
    importInput.addEventListener('change', handleImport);
  }
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      const tabs = document.querySelectorAll('.tab-btn');
      const contents = document.querySelectorAll('.tab-content');

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(tabName + 'Tab').classList.add('active');

      if (tabName === 'budget') {
        renderBudgetTab();
      } else if (tabName === 'transactions') {
        renderDetailTransactionsTab();
      }
    });
  });
}

function setupDatePicker() {
  const dateInput = document.getElementById('transactionDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.max = today;
  }
}

function setupTheme() {
  const theme = settings.theme || 'dark';
  if (theme === 'light') {
    document.body.classList.add('light-mode');
  }
  updateThemeButton();
}

function updateThemeButton() {
  const darkBtn = document.getElementById('darkThemeBtn');
  const lightBtn = document.getElementById('lightThemeBtn');
  if (document.body.classList.contains('light-mode')) {
    darkBtn?.classList.remove('active');
    lightBtn?.classList.add('active');
  } else {
    darkBtn?.classList.add('active');
    lightBtn?.classList.remove('active');
  }
}

function setupSettings() {
  const nameInput = document.getElementById('settingName');
  if (nameInput) {
    nameInput.value = settings.userName;
  }
  updateProfileDisplay();
}

function updateProfileDisplay() {
  const profileName = document.getElementById('profileName');
  const profileAvatar = document.getElementById('profileAvatar');
  if (profileName) {
    profileName.textContent = settings.userName;
  }
  if (profileAvatar) {
    profileAvatar.textContent = settings.userName.charAt(0).toUpperCase();
  }
}

function renderSettingPage() {
  setupSettings();
  updateThemeButton();
}

function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
  settings.theme = theme;
  saveSettings(settings);
  updateThemeButton();
  showToast(`Mode ${theme === 'light' ? 'Terang' : 'Gelap'} diaktifkan`);
}

function saveName() {
  const nameInput = document.getElementById('settingName');
  if (nameInput && nameInput.value.trim()) {
    settings.userName = nameInput.value.trim();
    saveSettings(settings);
    updateProfileDisplay();
    showToast('Nama berhasil disimpan');
  } else {
    showToast('Nama tidak boleh kosong');
  }
}

function handleTransactionSubmit(e) {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const type = document.getElementById('type').value;
  const date = document.getElementById('transactionDate').value;

  if (!description || !amount || amount <= 0) {
    showToast('Mohon isi semua field dengan benar');
    return;
  }

  if (currentEditingId) {
    const index = transactions.findIndex(tx => tx.id === currentEditingId);
    if (index !== -1) {
      transactions[index].description = description;
      transactions[index].amount = amount;
      transactions[index].category = category;
      transactions[index].type = type;
      transactions[index].date = date;
      showToast('Transaksi berhasil diubah');
      currentEditingId = null;
      document.getElementById('modalTitle').innerText = 'Tambah Transaksi';
      document.getElementById('submitBtn').innerText = 'Simpan Transaksi';
    }
  } else {
    const transaction = new Transaction(description, amount, category, type, date);
    transactions.push(transaction);
    showToast('Transaksi berhasil ditambahkan');
  }

  saveToStorage(transactions);
  renderTransactions(transactions, true);
  closeModal();
  this.reset();
  setupDatePicker();
}

function deleteTransaction(id) {
  if (confirm('Hapus transaksi ini?')) {
    transactions = transactions.filter(item => item.id !== id);
    saveToStorage(transactions);
    renderTransactions(transactions, true);
    showToast('Transaksi berhasil dihapus');
  }
}

function editTransaction(id) {
  const transaction = transactions.find(tx => tx.id === id);
  if (!transaction) return;

  currentEditingId = id;
  document.getElementById('description').value = transaction.description;
  document.getElementById('amount').value = transaction.amount;
  document.getElementById('category').value = transaction.category;
  document.getElementById('type').value = transaction.type;
  document.getElementById('transactionDate').value = transaction.date;

  document.getElementById('modalTitle').innerText = 'Edit Transaksi';
  document.getElementById('submitBtn').innerText = 'Perbarui Transaksi';

  openModal();
}

function handleSearch() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const filtered = transactions.filter(item =>
    item.description.toLowerCase().includes(keyword)
  );
  renderTransactions(filtered, true);
}

function handleFilter() {
  const category = document.getElementById('categoryFilter').value;
  const filtered = category ? transactions.filter(item => item.category === category) : transactions;
  renderTransactions(filtered, true);
}

function handleSort() {
  const sortBy = document.getElementById('sortBy').value;
  const sorted = [...transactions];

  switch (sortBy) {
    case 'date-asc':
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'date-desc':
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'amount-desc':
      sorted.sort((a, b) => b.amount - a.amount);
      break;
    case 'amount-asc':
      sorted.sort((a, b) => a.amount - b.amount);
      break;
  }

  renderTransactions(sorted, true);
}

function openModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('active');
  }
  currentEditingId = null;
  document.getElementById('transactionForm').reset();
  document.getElementById('modalTitle').innerText = 'Tambah Transaksi';
  document.getElementById('submitBtn').innerText = 'Simpan Transaksi';
  setupDatePicker();
}

function exportDataJSON() {
  const data = {
    transactions: getFromStorage(),
    budgets: getBudgets(),
    settings: getSettings(),
    exportedAt: new Date().toISOString()
  };

  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financial-app-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Data berhasil diekspor');
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      if (data.transactions) {
        saveToStorage(data.transactions);
        transactions = data.transactions;
      }
      if (data.budgets) {
        saveBudgets(data.budgets);
      }
      if (data.settings) {
        saveSettings(data.settings);
        settings = data.settings;
        setupSettings();
        setupTheme();
      }

      renderTransactions(transactions, true);
      showToast('Data berhasil diimpor');
    } catch (error) {
      showToast('File tidak valid');
      console.error(error);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function exportPDF() {
  const element = document.querySelector('.page.active');
  if (!element) {
    showToast('Pilih halaman terlebih dahulu');
    return;
  }

  const opt = {
    margin: 10,
    filename: `laporan-keuangan-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(opt).from(element).save();
  showToast('PDF berhasil diunduh');
}

function clearAllData() {
  if (confirm('⚠️ Hapus SEMUA data? Tindakan ini tidak bisa dibatalkan!')) {
    localStorage.clear();
    transactions = [];
    currentEditingId = null;
    location.reload();
  }
}

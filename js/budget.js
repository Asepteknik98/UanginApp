function renderMoneyPage() {
  renderBudgetTab();
  renderDetailTransactionsTab();
}

function renderBudgetTab() {
  const budgets = getBudgets();
  const transactions = getFromStorage();
  const budgetList = document.getElementById('budgetList');

  if (!budgetList) return;

  budgetList.innerHTML = '';

  if (Object.keys(budgets).length === 0) {
    budgetList.innerHTML = '<div class="empty-state"><p>📭 Belum ada budget</p></div>';
    return;
  }

  Object.entries(budgets).forEach(([category, budget]) => {
    const currentSpent = transactions
      .filter(tx => tx.category === category && tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const percentage = (currentSpent / budget.limit) * 100;
    const remaining = budget.limit - currentSpent;
    const isDanger = percentage > 100;

    const div = document.createElement('div');
    div.className = 'budget-item';

    div.innerHTML = `
      <div class="budget-header">
        <h3>${categoryIcons[category] || '💰'} ${category}</h3>
        <button class="budget-delete" onclick="deleteBudget('${category}')">Hapus</button>
      </div>
      <div class="budget-amount">
        <span>Terpakai: ${formatCurrency(currentSpent)}</span>
        <span>Sisa: ${formatCurrency(Math.max(0, remaining))}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill ${isDanger ? 'danger' : ''}" style="width: ${Math.min(percentage, 100)}%"></div>
      </div>
      <p style="font-size: 12px; color: #cbd5e1; margin-top: 8px;">
        Limit: ${formatCurrency(budget.limit)} (${Math.round(percentage)}%)
      </p>
    `;

    budgetList.appendChild(div);
  });
}

function renderDetailTransactionsTab() {
  const transactions = getFromStorage().sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );
  renderDetailTransactions(transactions);
}

function showAddBudgetModal() {
  const modal = document.getElementById('budgetModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeBudgetModal() {
  const modal = document.getElementById('budgetModal');
  if (modal) {
    modal.classList.remove('active');
  }
  document.getElementById('budgetForm').reset();
}

function saveBudget(category, limit) {
  const budgets = getBudgets();
  budgets[category] = { limit: limit, createdAt: new Date().getTime() };
  saveBudgets(budgets);
  renderBudgetTab();
  showToast(`Budget untuk ${category} berhasil ditambahkan`);
}

function deleteBudget(category) {
  if (confirm(`Hapus budget untuk ${category}?`)) {
    const budgets = getBudgets();
    delete budgets[category];
    saveBudgets(budgets);
    renderBudgetTab();
    showToast(`Budget ${category} berhasil dihapus`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const budgetForm = document.getElementById('budgetForm');
  if (budgetForm) {
    budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const category = document.getElementById('budgetCategory').value;
      const amount = parseFloat(document.getElementById('budgetAmount').value);

      if (!category || !amount || amount <= 0) {
        showToast('Kategori dan jumlah harus valid');
        return;
      }

      saveBudget(category, amount);
      closeBudgetModal();
    });
  }
});

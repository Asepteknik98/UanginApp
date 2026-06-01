let financeChart;

const categoryIcons = {
  'Makanan': '🍔',
  'Transportasi': '🚗',
  'Belanja': '🛍️',
  'Tagihan': '📄',
  'Gaji': '💼',
  'Hiburan': '🎮'
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('id-ID', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function renderTransactions(data, editEnabled = false) {
  const list = document.getElementById('transactionList');
  const emptyState = document.getElementById('emptyState');

  if (!list) return;

  list.innerHTML = '';

  if (data.length === 0) {
    emptyState.style.display = 'block';
    document.getElementById('transactionCount').textContent = '0 transaksi';
    return;
  }

  emptyState.style.display = 'none';

  let totalIncome = 0;
  let totalExpense = 0;

  data.forEach(item => {
    if (item.type === 'income') {
      totalIncome += item.amount;
    } else {
      totalExpense += item.amount;
    }

    const icon = categoryIcons[item.category] || '💰';
    const div = document.createElement('div');
    div.className = 'transaction-card';

    const buttonsHTML = editEnabled ? `
      <div class="transaction-buttons">
        <button class="edit-btn" onclick="editTransaction(${item.id})">✏️ Edit</button>
        <button class="delete-btn" onclick="deleteTransaction(${item.id})">🗑️ Hapus</button>
      </div>
    ` : `
      <button class="delete-btn" onclick="deleteTransaction(${item.id})">Hapus</button>
    `;

    div.innerHTML = `
      <div class="transaction-info">
        <h3>${icon} ${item.description}</h3>
        <p>${item.category} • ${formatDate(item.date)}</p>
      </div>
      <div class="transaction-amount">
        <h3 class="${item.type === 'income' ? 'income-text' : 'expense-text'}">
          ${item.type === 'income' ? '+' : '-'} ${formatCurrency(item.amount)}
        </h3>
        ${buttonsHTML}
      </div>
    `;

    list.appendChild(div);
  });

  document.getElementById('totalIncome').innerText = formatCurrency(totalIncome);
  document.getElementById('totalExpense').innerText = formatCurrency(totalExpense);
  document.getElementById('balance').innerText = formatCurrency(totalIncome - totalExpense);
  document.getElementById('transactionCount').textContent = `${data.length} transaksi`;

  renderChart(totalIncome, totalExpense);
}

function renderChart(income, expense) {
  const ctx = document.getElementById('financeChart');
  if (!ctx) return;

  if (financeChart) {
    financeChart.destroy();
  }

  financeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pemasukan', 'Pengeluaran'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: ['#16a34a', '#dc2626'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: '#cbd5e1',
            font: { size: 14 }
          }
        }
      }
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function renderDetailTransactions(data) {
  const list = document.getElementById('detailTransactionList');
  if (!list) return;

  list.innerHTML = '';

  if (data.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>📭 Belum ada transaksi</p></div>';
    return;
  }

  data.forEach(item => {
    const icon = categoryIcons[item.category] || '💰';
    const div = document.createElement('div');
    div.className = 'transaction-card';

    div.innerHTML = `
      <div class="transaction-info">
        <h3>${icon} ${item.description}</h3>
        <p>${item.category} • ${formatDate(item.date)}</p>
      </div>
      <div class="transaction-amount">
        <h3 class="${item.type === 'income' ? 'income-text' : 'expense-text'}">
          ${item.type === 'income' ? '+' : '-'} ${formatCurrency(item.amount)}
        </h3>
      </div>
    `;

    list.appendChild(div);
  });
}

let chartIncome, chartCategory, chartTrend;

function renderChartPage() {
  const transactions = getFromStorage();

  if (transactions.length === 0) {
    showToast('Belum ada data transaksi');
    return;
  }

  updateStats(transactions);
  renderIncomeChart(transactions);
  renderCategoryChart(transactions);
  renderTrendChart(transactions);
}

function updateStats(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  let maxAmount = 0;
  const categoryExpenses = {};

  transactions.forEach(tx => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
      categoryExpenses[tx.category] = (categoryExpenses[tx.category] || 0) + tx.amount;
    }
    maxAmount = Math.max(maxAmount, tx.amount);
  });

  const average = transactions.length > 0 ? (totalIncome + totalExpense) / transactions.length : 0;
  const mostCommon = Object.keys(categoryExpenses).length > 0
    ? Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0][0]
    : 'N/A';

  document.getElementById('statTotalIncome').innerText = formatCurrency(totalIncome);
  document.getElementById('statTotalExpense').innerText = formatCurrency(totalExpense);
  document.getElementById('statAverage').innerText = formatCurrency(average);
  document.getElementById('statBiggest').innerText = formatCurrency(maxAmount);
}

function renderIncomeChart(transactions) {
  const ctx = document.getElementById('chartIncome');
  if (!ctx) return;

  if (chartIncome) {
    chartIncome.destroy();
  }

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(tx => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
    }
  });

  chartIncome = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Pemasukan', 'Pengeluaran'],
      datasets: [{
        label: 'Jumlah',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'y',
      plugins: {
        legend: {
          labels: { color: '#cbd5e1' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        y: {
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }
  });
}

function renderCategoryChart(transactions) {
  const ctx = document.getElementById('chartCategory');
  if (!ctx) return;

  if (chartCategory) {
    chartCategory.destroy();
  }

  const categoryData = {};
  transactions.forEach(tx => {
    if (tx.type === 'expense') {
      categoryData[tx.category] = (categoryData[tx.category] || 0) + tx.amount;
    }
  });

  const labels = Object.keys(categoryData);
  const data = Object.values(categoryData);

  const colors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'
  ];

  chartCategory = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#1e293b',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#cbd5e1', font: { size: 12 } }
        }
      }
    }
  });
}

function renderTrendChart(transactions) {
  const ctx = document.getElementById('chartTrend');
  if (!ctx) return;

  if (chartTrend) {
    chartTrend.destroy();
  }

  const monthlyData = {};

  transactions.forEach(tx => {
    const date = new Date(tx.date + 'T00:00:00');
    const monthKey = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (tx.type === 'income') {
      monthlyData[monthKey].income += tx.amount;
    } else {
      monthlyData[monthKey].expense += tx.amount;
    }
  });

  const labels = Object.keys(monthlyData);
  const incomeData = labels.map(label => monthlyData[label].income);
  const expenseData = labels.map(label => monthlyData[label].expense);

  chartTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Pemasukan',
          data: incomeData,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#22c55e'
        },
        {
          label: 'Pengeluaran',
          data: expenseData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ef4444'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#cbd5e1' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        y: {
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }
  });
}

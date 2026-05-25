let financeChart;

function renderTransactions(data) {

  const list = document.getElementById("transactionList");

  if (!list) {
    console.error("transactionList tidak ditemukan di HTML");
    return;
  }

  list.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  data.forEach(item => {

    if (item.type === "income") {
      totalIncome += item.amount;
    } else {
      totalExpense += item.amount;
    }

    const div = document.createElement("div");
    div.className = "transaction-card";

    div.innerHTML = `
      <div class="transaction-info">
        <h3>${item.description}</h3>
        <p>${item.category} • ${item.date}</p>
      </div>

      <div class="transaction-amount">
        <h3 class="${item.type === "income" ? "income-text" : "expense-text"}">
          ${item.type === "income" ? "+" : "-"} Rp ${item.amount.toLocaleString()}
        </h3>

        <button class="delete-btn" onclick="deleteTransaction(${item.id})">
          Hapus
        </button>
      </div>
    `;

    list.appendChild(div);

  });

  // UPDATE SUMMARY
  document.getElementById("totalIncome").innerText =
    "Rp " + totalIncome.toLocaleString();

  document.getElementById("totalExpense").innerText =
    "Rp " + totalExpense.toLocaleString();

  document.getElementById("balance").innerText =
    "Rp " + (totalIncome - totalExpense).toLocaleString();

  // UPDATE CHART
  renderChart(totalIncome, totalExpense);
}

function renderChart(income, expense) {

  const ctx = document.getElementById("financeChart");

  if (!ctx) return;

  if (financeChart) {
    financeChart.destroy();
  }

  financeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Pemasukan", "Pengeluaran"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      }
    }
  });
}
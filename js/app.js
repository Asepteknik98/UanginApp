let transactions = getFromStorage();

renderTransactions(transactions);

/* =========================
SUBMIT TRANSAKSI (FIXED)
========================= */

document.getElementById("transactionForm")
  .addEventListener("submit", function (e) {

    e.preventDefault();

    const description =
      document.getElementById("description").value;

    const amount =
      document.getElementById("amount").value;

    const category =
      document.getElementById("category").value;

    const type =
      document.getElementById("type").value;

    if (description === "" || amount === "") {
      alert("Data tidak boleh kosong!");
      return;
    }

    const transaction = new Transaction(
      description,
      amount,
      category,
      type
    );

    transactions.push(transaction);

    saveToStorage(transactions);

    renderTransactions(transactions);

    this.reset();

    closeModal(); // penting: tutup modal setelah sukses

  });

/* =========================
DELETE TRANSACTION
========================= */

function deleteTransaction(id) {

  transactions = transactions.filter(
    item => item.id !== id
  );

  saveToStorage(transactions);

  renderTransactions(transactions);

}

/* =========================
SEARCH
========================= */

document.getElementById("searchInput")
  .addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const filtered = transactions.filter(item =>
      item.description.toLowerCase().includes(keyword)
    );

    renderTransactions(filtered);

  });

/* =========================
MODAL CONTROL (FIXED)
========================= */

function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
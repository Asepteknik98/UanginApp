class Transaction {
  constructor(description, amount, category, type, date = null) {
    this.id = Date.now() + Math.random();
    this.description = description;
    this.amount = parseFloat(amount);
    this.category = category;
    this.type = type;
    this.date = date || new Date().toISOString().split('T')[0];
    this.createdAt = new Date().getTime();
  }
}

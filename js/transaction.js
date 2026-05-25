class Transaction{

  constructor(
    description,
    amount,
    category,
    type
  ){

    this.id = Date.now();

    this.description = description;

    this.amount = parseInt(amount);

    this.category = category;

    this.type = type;

    this.date = new Date()
      .toLocaleDateString("id-ID");

  }

}
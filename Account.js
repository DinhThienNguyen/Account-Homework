class Account {
    constructor(credit, debit, accountNumber) {
      this.credit = credit;
      this.debit = debit;
      this.accountNumber = accountNumber;
    }

    getCredit(){
        return this.credit;
    }
  }
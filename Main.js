class Account {
  constructor(credit, debit, accountNumber) {
    this.credit = credit;
    this.debit = debit;
    this.accountNumber = accountNumber;
  }

  getAccountNumber() {
    return this.accountNumber;
  }

  isCreditAccount() {
    return (this.credit !== undefined && this.debit === undefined) ? true : false;
  }

  isDebitAccount() {
    return (this.credit === undefined && this.debit !== undefined) ? true : false;
  }

  isUnidentifiedAccount() {
    return (this.credit === undefined && this.debit === undefined) ? true : false;
  }
}

function sortAccountByAccountNumber(accountArray) {
  accountArray.sort(function(accountA, accountB) {
    return accountA.getAccountNumber() - accountB.getAccountNumber();
  })
}

function sortAccounts(accountArray) {
  let creditAccounts = [];
  let debitAccounts = [];
  let unidentifiedAccounts = [];

  accountArray.forEach(function(item, index) {
    if (item.isCreditAccount()) {
      creditAccounts = [...creditAccounts, item];
    } else if (item.isDebitAccount()) {
      debitAccounts = [...debitAccounts, item];
    } else if (item.isUnidentifiedAccount()) {
      unidentifiedAccounts = [...unidentifiedAccounts, item];
    }
  });

  sortAccountByAccountNumber(creditAccounts);
  sortAccountByAccountNumber(debitAccounts);
  sortAccountByAccountNumber(unidentifiedAccounts);
  accountArray = [...creditAccounts, ...debitAccounts, ...unidentifiedAccounts];
}

var creditAccount1 = new Account(1, undefined, 1);
var creditAccount2 = new Account(2, undefined, 2);
var creditAccount3 = new Account(3, undefined, 3);

var debitAccount1 = new Account(undefined, 1, 4);
var debitAccount2 = new Account(undefined, 2, 5);
var debitAccount3 = new Account(undefined, 3, 6);

var unidentifiedAccount1 = new Account(undefined, undefined, 7);
var unidentifiedAccount2 = new Account(undefined, undefined, 8);
var unidentifiedAccount3 = new Account(undefined, undefined, 9);

var accounts = [debitAccount2, debitAccount1, creditAccount1, debitAccount3, creditAccount3, unidentifiedAccount1, creditAccount2, unidentifiedAccount3, unidentifiedAccount2];

sortAccountByAccountNumber(accounts);
console.log(accounts);
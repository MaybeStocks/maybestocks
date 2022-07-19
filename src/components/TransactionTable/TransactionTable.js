import * as React from "react";

function TransactionTable(props) {
  
  const { transactions, setTransactions } = props;

  return (
    <>
      <div>
        <h2>Stocks</h2>
        {transactions.length > 0 ? (
          <TransactionList
            transactions={transactions}
            setTransactions={setTransactions}
          />
        ) : (
          <p>No transactions yet! Add one above!</p>
        )}
      </div>
    </>
  );
}

function TransactionList(props) {
  const { transactions } = props;

  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Symbol</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
          <th>Buy/Sell</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          // We should specify key here to help react identify
          // what has updated
          // https://reactjs.org/docs/lists-and-keys.html#keys
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{transaction.symbol}</td>
            <td>{transaction.quantity}</td>
            <td>{transaction.price}</td>
            <td>{transaction.total}</td>
            <td>{transaction.buysell}</td>
            <td>{transaction.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;

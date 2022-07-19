import * as React from "react";
import { useState } from "react";
import Popup from "../Popup/Popup";

function BuyInput(props) {
  const {
    transactions,
    setTransactions,
    portfoliosMap,
    setPortfoliosMap,
    wallet,
    setWallet,
    data,
  } = props;

  const [newBuyTransactionText, setNewBuyTransactionText] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
  const [failurePopup, setFailurePopup] = useState(false);

  function handleAddBuyTransaction(event) {
    // React honours default browser behavior and the
    // default behaviour for a form submission is to
    // submit AND refresh the page. So we override the
    // default behaviour here as we don't want to refresh
    event.preventDefault();
    addBuyTransaction(newBuyTransactionText);
  }

  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return (Math.round(m) / 100) * Math.sign(num);
  }

  function addBuyTransaction(strquantity) {
    const quantity = Number(strquantity);
    const sum = data?.latestPrice * quantity;
    if (sum <= wallet) {
      const newBuyTransactions = [
        // the ... operator is called the spread operator
        // what we are doing is creating a brand new array of
        // tasks, that is different from the previous array
        // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        ...transactions,
        {
          symbol: data?.symbol,
          quantity: quantity,
          price: data?.latestPrice,
          total: round(quantity * data?.latestPrice),
          buysell: "Buy",
          date: data?.latestTime,
        },
      ];
      setTransactions(newBuyTransactions);
      addBuyPortfoliosMap(quantity);
      const amount = wallet - sum;
      setWallet(amount);
      setSuccessPopup(true);
    } else {
      console.log("Not enough money.");
      setFailurePopup(true);
    }
  }

  function addBuyPortfoliosMap(strquantity) {
    const quantity = Number(strquantity);
    if (data?.symbol in portfoliosMap) {
      const symbol = data?.symbol;
      const previousValue = portfoliosMap[symbol];
      const pap = previousValue.avgprice; // previousAvgPrice
      const pq = previousValue.quantity; // previousQuantity
      const cap = (data?.latestPrice * quantity + pap * pq) / (pq + quantity); // currentAvgPrice
      const newSymbol = {
        avgprice: cap,
        gainloss: ((data?.latestPrice - cap) * 100) / data?.latestPrice,
        quantity: quantity + pq,
        symbol: previousValue.symbol,
      };
      portfoliosMap[symbol] = newSymbol;
    } else {
      const symbol = data?.symbol;
      const newSymbol = {
        avgprice: data?.latestPrice,
        gainloss: 0,
        quantity: quantity,
        symbol: data?.symbol,
      };
      portfoliosMap[symbol] = newSymbol;
    }
    setPortfoliosMap(portfoliosMap);
  }

  // console.log(typeof(portfoliosMap));

  return (
    <>
      <div>
        <h2>Quantity</h2>
        <form onSubmit={handleAddBuyTransaction}>
          <input
            label="Quantity"
            type="number"
            value={newBuyTransactionText}
            onChange={(event) => setNewBuyTransactionText(event.target.value)}
          />
          <button type="submit" variant="contained" color="primary">
            Buy
          </button>
        </form>
      </div>

      <Popup trigger={successPopup} setTrigger={setSuccessPopup}>
        <h2>Success</h2>
        <div>Buy Transaction Succesful</div>
      </Popup>

      <Popup trigger={failurePopup} setTrigger={setFailurePopup}>
        <h2>Failure</h2>
        <div>Not enough money.</div>
      </Popup>
    </>
  );
}

export default BuyInput;

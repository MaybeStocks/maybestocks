import * as React from "react";
import { useState } from "react";
import Popup from "../Popup/Popup";

function SellInput(props) {
  const {
    transactions,
    setTransactions,
    portfoliosMap,
    setPortfoliosMap,
    wallet,
    setWallet,
    data,
  } = props;

  const [newSellTransactionText, setNewSellTransactionText] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
  const [failurePopup, setFailurePopup] = useState(false);
  const [failurePopupText, setFailurePopupText] = useState("");

  function handleAddSellTransaction(event) {
    // React honours default browser behavior and the
    // default behaviour for a form submission is to
    // submit AND refresh the page. So we override the
    // default behaviour here as we don't want to refresh
    event.preventDefault();
    addSellPortfoliosMap(newSellTransactionText);
  }

  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return (Math.round(m) / 100) * Math.sign(num);
  }

  function addSellTransaction(strquantity) {
    const quantity = Number(strquantity);
    const sum = data?.latestPrice * quantity;
    const newSellTransactions = [
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
        buysell: "Sell",
        date: data?.latestTime,
      },
    ];
    setTransactions(newSellTransactions);
    console.log("Wallet before selling");
    console.log(wallet);
    const amount = wallet + sum;
    console.log("Amount added to wallet");
    console.log(sum);
    setWallet(amount);
  }

  async function addSellPortfoliosMap(strquantity) {
    const quantity = Number(strquantity);
    const symbol = data?.symbol;
    if (data?.symbol in portfoliosMap) {
      const previousValue = portfoliosMap[symbol];
      const pq = previousValue.quantity; // previousQuantity
      if (pq - quantity > 0) {
        const pap = previousValue.avgprice; // previousAvgPrice
        const newSymbol = {
          avgprice: pap,
          gainloss: ((data?.latestPrice - pap) * 100) / data?.latestPrice,
          quantity: pq - quantity,
          symbol: previousValue.symbol,
        };
        portfoliosMap[symbol] = newSymbol;
        addSellTransaction(strquantity);
        setSuccessPopup(true);
      } else if (pq === quantity) {
        delete portfoliosMap[symbol];
        addSellTransaction(strquantity);
        setSuccessPopup(true);
      } else {
        console.log("Not enough stocks to sell");
        setFailurePopupText("Not enough stocks to sell");
        setFailurePopup(true);
      }
    } else {
      console.log("You do not own any of this stock currently");
      setFailurePopupText("You do not own any of this stock currently");
      setFailurePopup(true);
    }
    setPortfoliosMap(portfoliosMap);
  }

  return (
    <>
      <div>
        <h2>Quantity</h2>
        <form onSubmit={handleAddSellTransaction}>
          <input
            label="Quantity"
            type="number"
            value={newSellTransactionText}
            onChange={(event) => setNewSellTransactionText(event.target.value)}
          />
          <button type="submit" variant="contained" color="primary">
            Sell
          </button>
        </form>
      </div>

      <Popup trigger={successPopup} setTrigger={setSuccessPopup}>
        <h2>Success</h2>
        <div>Sell Transaction Succesful</div>
      </Popup>

      <Popup trigger={failurePopup} setTrigger={setFailurePopup}>
        <h2>Failure</h2>
        <div>{failurePopupText}</div>
      </Popup>
    </>
  );
}

export default SellInput;

import * as React from "react";

function PortfolioTable(props) {
  
  const { portfoliosMap, setPortfoliosMap } = props;

  var size = Object.keys(portfoliosMap).length;

  return (
    <>
      <div>
        <h2>Portfolio</h2>
        {size > 0 ?
          (
            <PortfolioList
              portfoliosMap={portfoliosMap}
              setPortfoliosMap={setPortfoliosMap}
            />
          ) 
          : 
          (
          <p>No stocks yet! Buy some on the top left bar!</p>
          )
        } 
      </div>
    </>
  );
}

function PortfolioList(props) {
  const { portfoliosMap } = props;

  const array = [];
  let i = 0;
  for (const key in portfoliosMap) {
    array[i] = portfoliosMap[key];
    i++;
  }

  function roundToFour(num) {
    var m = Number((Math.abs(num) * 10000).toPrecision(15));
    return (Math.round(m) / 10000) * Math.sign(num);
  }

  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Symbol</th>
          <th>Quantity</th>
          <th>Average Price</th>
          <th>Gain/Loss</th>
        </tr>
      </thead>
      <tbody>
        {array.map((p, index) => (
          // We should specify key here to help react identify
          // what has updated
          // https://reactjs.org/docs/lists-and-keys.html#keys
          <tr key={p.symbol}>
            <td>{index + 1}</td>
            <td>{p.symbol}</td>
            <td>{p.quantity}</td>
            <td>{p.avgprice}</td>
            <td>{roundToFour(p.gainloss)}</td> 
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PortfolioTable;
import React from "react";

class DataFetch extends React.Component {
  state = {
    loading: true,
    price: -1,
    companyName: null
  };

  async componentDidMount() {
    const url =
      "https://sandbox.iexapis.com/stable/stock/AAPL/quote?token=Tpk_a1ecdafbdf2442f8a8fed66b8eedda5a";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ price: data.close, loading: false, companyName: data.companyName });
    // console.log(data);
  }

  render() {
    return (
      <div>
        {this.state.loading || !this.state.price === -1 ? (
          <div>Loading...</div>
        ) : (
          <div>
          <div>{this.state.companyName}</div>
          <div>{this.state.price}</div>
          </div>
        )}
      </div>
    );
  }
}

export default DataFetch;

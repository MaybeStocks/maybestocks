import { useState, useEffect, useRef } from "react";
import { useAuth, db } from "../hooks/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import SellInput from "../components/SellInput/SellInput";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Popup from "../components/Popup/Popup";

function SellPage() {
  const [transactions, setTransactionsState] = useState([]);

  const [portfoliosMap, setPortfoliosMapState] = useState({});

  const [wallet, setWalletState] = useState(0);

  const [NILPopup, setNILPopup] = useState(false);

  const { user } = useAuth();

  function setSellTransactions(newSellTransactions) {
    setTransactionsState(newSellTransactions);
    setDoc(doc(db, "Transactions", user?.uid), {
      transactions: newSellTransactions,
    });
  }

  function setPortfoliosMap(newBuyPortfoliosMap) {
    setPortfoliosMapState(newBuyPortfoliosMap);
    setDoc(doc(db, "PortfoliosMap", user?.uid), newBuyPortfoliosMap);
  }

  function setWallet(amount) {
    setWalletState(amount);
    setDoc(doc(db, "Wallet", user?.uid), { amount });
  }

  useEffect(() => {
    async function fetchData() {
      const docSnapshot = await getDoc(doc(db, "Transactions", user?.uid));
      if (docSnapshot.exists()) {
        setTransactionsState(docSnapshot.data().transactions);
      } else {
        setTransactionsState([]);
      }
    }
    fetchData();
  }, [user.uid]);

  useEffect(() => {
    async function fetchData() {
      const docSnapshot = await getDoc(doc(db, "PortfoliosMap", user?.uid));
      if (docSnapshot.exists()) {
        setPortfoliosMapState(docSnapshot.data());
      } else {
        setPortfoliosMapState({});
      }
    }
    fetchData();
  }, [user.uid]);

  useEffect(() => {
    async function fetchData() {
      const docSnapshot = await getDoc(doc(db, "Wallet", user?.uid));
      if (docSnapshot.exists()) {
        setWalletState(docSnapshot.data().amount);
      } else {
        setWalletState(100000);
      }
    }
    fetchData();
  }, [user.uid]);

  const inputRef = useRef(null);
  const [data, setData] = useState({
    companyName: "Enter Symbol Below",
    latestPrice: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleClick(event) {
    //To prevent the clearing of the input fields at each click
    event.preventDefault();
    setLoading(true);

    axios
      .get(
        `https://sandbox.iexapis.com/stable/stock/${inputRef.current.value}/quote?token=Tpk_a1ecdafbdf2442f8a8fed66b8eedda5a`
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError(err);
        setNILPopup(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  //const {data, loading} = useFetch("https://sandbox.iexapis.com/stable/stock/BA/quote?token=Tpk_a1ecdafbdf2442f8a8fed66b8eedda5a");

  //if (loading) return <h1>Loading...</h1>

  return (
    <>
      <h1>Sell Page</h1>
      <h1>
        {data?.companyName} : {data?.latestPrice}
      </h1>

      <form>
        <div>Enter Stock Symbol</div>
        <TextField
          label="Symbol"
          id="standard-size-normal"
          variant="standard"
          type="text"
          placeholder="e.g AAPL"
          inputRef={inputRef}
          sx={{ m: 1 }}
        ></TextField>
        
        <Button variant="contained"
          onClick={handleClick}
          type="submit"
          padding="20px"
          sx={{ m: 1 }}>
          Search
        </Button>
      </form>

      <div>
        <SellInput
          transactions={transactions}
          setTransactions={setSellTransactions}
          portfoliosMap={portfoliosMap}
          setPortfoliosMap={setPortfoliosMap}
          wallet={wallet}
          setWallet={setWallet}
          data={data}
        />
      </div>

      <Popup trigger={NILPopup} setTrigger={setNILPopup}>
        <h2>Error</h2>
        <div>Symbol does not exist.</div>
      </Popup>
    </>
  );
}

export default SellPage;

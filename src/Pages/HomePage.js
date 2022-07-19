import { useAuth, db } from "../hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import WatchlistTable from "../components/WatchlistTable/WatchlistTable";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import RefreshIcon from "@mui/icons-material/Refresh";
import Popup from "../components/Popup/Popup";
import axios from "axios";

function HomePage() {
  const { user } = useAuth();

  const [watchlist, setWatchlistState] = useState({});

  const [wallet, setWalletState] = useState(0);

  const [refresh, setRefreshState] = useState(true);

  const [dupePopup, setDupePopup] = useState(false);

  const [NILPopup, setNILPopup] = useState(false);

  function setWatchlist(newWatchlist) {
    setWatchlistState(newWatchlist);
    setDoc(doc(db, "Watchlist", user?.uid), newWatchlist);
  }

  useEffect(() => {
    async function fetchData() {
      const docSnapshot = await getDoc(doc(db, "Watchlist", user?.uid));
      if (docSnapshot.exists()) {
        setWatchlistState(docSnapshot.data());
      } else {
        setWatchlistState({});
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
  }, [user?.uid, wallet]);

  const inputRef = useRef(null);
  let data = {};

  const [error, setError] = useState(null);

  async function handleSubmitClick(event) {
    //To prevent the re rendering of entire page
    event.preventDefault();
    if (inputRef.current.value === "") {
      console.log("Invalid stock");
    } else {
      const uppercaseSymbol = inputRef.current.value.toUpperCase();
      axios
        .get(
          `https://sandbox.iexapis.com/stable/stock/${uppercaseSymbol}/quote?token=Tpk_a1ecdafbdf2442f8a8fed66b8eedda5a`
        )
        .then((response) => {
          data = response.data;
          addWatchlist(uppercaseSymbol);
        })
        .catch((err) => {
          setError(err);
          setNILPopup(true);
        }).finally(() => {
          setRefreshState(!refresh);
        });
    }
  }

  function addWatchlist(symbol) {
    if (symbol in watchlist) {
      setDupePopup(true);
    } else {
      const roundedYTD = roundToFour(data?.ytdChange);
      const newWatchlist = {
        symbol: symbol,
        companyName: data?.companyName,
        latestPrice: data?.latestPrice,
        dailyPercentChange: data?.changePercent,
        // Price to earning ratio
        peRatio: data?.peRatio,
        // Year to date change
        ytdChange: roundedYTD,
      };
      watchlist[symbol] = newWatchlist;
      setWatchlist(watchlist);
    }
  }


  // Bug doesnt referesh all the stocks cos we are sending too many requests at 
  // one time to the API, causing 429 error
  // AxiosError {message: 'Request failed with status code 429'}
  async function handleRefresh(e) {
    e.preventDefault();
    
 
    function apiRequestDelay(ms)  {
      return new Promise( resolve => { setTimeout(resolve, ms); });
    }

    for (let stock in watchlist) {
      axios
        .get(
          `https://sandbox.iexapis.com/stable/stock/${stock}/quote?token=Tpk_a1ecdafbdf2442f8a8fed66b8eedda5a`
        )
        .then((response) => {
          watchlist[stock].latestPrice = response.data.latestPrice;
          watchlist[stock].dailyPercentChange = response.data.changePercent;
          watchlist[stock].peRatio = response.data.peRatio;
          watchlist[stock].ytdChange = roundToFour(response.data.ytdChange);
        })
        .catch((err) => {
          console.log(stock);
          console.log(err);
        }).finally(() => {
          setRefreshState(!refresh);
        });
      
      // Prevents 429 error as API is called too quickly. Just a short delay before each call
      await apiRequestDelay(100);
    }
    setWatchlist(watchlist);
  }

  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return (Math.round(m) / 100) * Math.sign(num);
  }

  function roundToFour(num) {
    var m = Number((Math.abs(num) * 10000).toPrecision(15));
    return (Math.round(m) / 10000) * Math.sign(num);
  }

  return (
    <>
      <h1>HomePage</h1>
      <h1>You currently have</h1>
      <h1>${round(wallet)}</h1>

      <IconButton color="primary" onClick={handleRefresh} aria-label="refresh">
        <RefreshIcon />
      </IconButton>

      {/* We did this because we want the watchlist table to refresh everytime we click the refresh button or add button*/}
      {refresh 
      ? <WatchlistTable watchlist={watchlist} setWatchlist={setWatchlist} refresh={refresh} setRefreshState={setRefreshState}/> 
      : <WatchlistTable watchlist={watchlist} setWatchlist={setWatchlist} refresh={refresh} setRefreshState = {setRefreshState}/>}
      
      <form>
        <div>Enter Stock Symbol</div>
        <TextField
          label="Symbol"
          id="outlined-basic"
          variant="outlined"
          type="text"
          placeholder="e.g AAPL"
          inputRef={inputRef}
          sx={{ m: 1 }}
        ></TextField>
        <Button
          variant="contained"
          onClick={handleSubmitClick}
          type="submit"
          padding="20px"
          sx={{ m: 1 }}
        >
          Add Stock
        </Button>
      </form>

      <Popup trigger={dupePopup} setTrigger={setDupePopup}>
        <h2>Error</h2>
        <div>Symbol already in watchlist.</div>
      </Popup>

      <Popup trigger={NILPopup} setTrigger={setNILPopup}>
        <h2>Error</h2>
        <div>Symbol does not exist.</div>
      </Popup>
    </>
  );
}

export default HomePage;

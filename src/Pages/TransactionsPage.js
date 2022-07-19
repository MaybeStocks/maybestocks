import { useState, useEffect } from "react";
import { useAuth, db } from "../hooks/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import TransactionTable from "../components/TransactionTable/TransactionTable";

function TransactionsPage() {

    const [transactions, setTransactionsState] = useState([]);

    const { user } = useAuth();

    function setTransactions(newTransactions) {
        setTransactionsState(newTransactions);
        setDoc(doc(db, "Transactions", user?.uid), { transactions: newTransactions });
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

    //const {data, loading} = useFetch("https://sandbox.iexapis.com/stable/stock/BA/quote?token=Tpk_a1ecdafbdf2442f8a8fed66b8eedda5a");
    // console.log(data);

    //if (loading) return <h1>Loading...</h1>
    
    return (
    <>
    <h1>Transaction Page</h1>
    <h1>
      Transaction History
    </h1>

    <div>
      <TransactionTable transactions={transactions} setTransactions={setTransactions} />   
    </div>
    </>
  )
}

export default TransactionsPage
import React from "react";
import { useState, useEffect } from "react";
import { useAuth, db } from "../hooks/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import PortfolioTable from "../components/PortfolioTable/PortfolioTable"

function PortfolioPage() {
  const [name, setName] = useState("Loading name...");

  const [portfoliosMap, setPortfoliosMapState] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  function setPortfoliosMap(newPortfoliosMap) {
    setPortfoliosMapState(newPortfoliosMap);
    setDoc(doc(db, "PortfoliosMap", user?.uid), { newPortfoliosMap });
  }

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

  return (
    <>
      <h1>Portfolio Page</h1>
      <h1>Portfolio of {name}.</h1>

      <div>
        <PortfolioTable
          portfoliosMap={portfoliosMap}
          setPortfoliosMap={setPortfoliosMap}
        />
      </div>
    </>
  );
}

export default PortfolioPage;

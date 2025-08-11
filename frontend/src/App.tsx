import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
  const [data, setData] = useState<string>("");
  console.log("Backend URL:", URL);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/api`);
        alert("Fetching data from backend...");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const text = await response.text();
        setData(text);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [URL]);

  return (
    <>
      <h1>{data}</h1>
    </>
  );
}

export default App;

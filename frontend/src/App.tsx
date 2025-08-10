import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
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
  }, []);
  return (
    <>
      <h1>{data}</h1>
    </>
  );
}

export default App;

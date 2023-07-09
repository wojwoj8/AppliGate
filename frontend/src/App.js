import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() =>{
    fetchData()
  },[])

  const fetchData = async () =>{
    try {
      const response = await axios.get('./api/reacts/');
      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div>

        <h1>Test</h1>
      </div>
    </div>
  );
}

export default App;

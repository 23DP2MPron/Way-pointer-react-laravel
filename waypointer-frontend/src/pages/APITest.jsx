import { useState } from 'react';
import axios from 'axios';

export default function APITest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2,capital,region,population,flags');
      setResult(`Success! Loaded ${response.data.length} countries. First country: ${response.data[0].name.common}`);
    } catch (error) {
      setResult(`Error: ${error.message}. Details: ${JSON.stringify(error.response?.data || 'No details')}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <button onClick={testAPI} disabled={loading} className="btn-primary mb-4">
        {loading ? 'Testing...' : 'Test REST Countries API'}
      </button>
      {result && (
        <div className="card p-4">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}

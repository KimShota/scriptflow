import { useEffect, useState } from 'react'; 

export default function App(){
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    fetch('http://localhost:8080/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, []); 

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  )
}
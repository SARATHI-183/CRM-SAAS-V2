import { useState } from 'react'
import './index.css'
import './App.css'
import { Toaster } from "sonner";
import AppRouter from "./router/AppRouter";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <AppRouter />;
      <Toaster position="top-right" richColors /> {/* shows toast */}
    </>
  )
}

export default App

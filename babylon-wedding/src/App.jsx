import { useState } from 'react'
import UploadForm from './components/UploadForm'
import Success from './components/Success'
import Admin from './components/Admin'
import './App.css'

const isAdmin = window.location.pathname === '/admin'

export default function App() {
  const [submitted, setSubmitted] = useState(false)
  const [resultData, setResultData] = useState(null)

  if (isAdmin) return <Admin />

  const handleSuccess = (data) => {
    setResultData(data)
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    setResultData(null)
  }

  return (
    <div className="app">
      <div className="bg-pattern" />
      {submitted
        ? <Success data={resultData} onReset={handleReset} />
        : <UploadForm onSuccess={handleSuccess} />
      }
    </div>
  )
}

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Landing from '../pages/Landing'
import VideoPage from '../pages/VideoPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
      <Route path='*' element={<Landing/>} />
      <Route path='/' element={<Landing/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/landing' element={<Landing/>} />
      <Route path='/video/:course/:video' element={<VideoPage/>}/>
      </Routes>
    </>
  )
}

export default App

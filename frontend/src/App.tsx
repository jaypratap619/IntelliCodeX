import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sandbox from './pages/Sandbox'
import NotFound from './pages/NotFound'
import type React from 'react'
const App : React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/sandbox/:project_id' element={<Sandbox />}/>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
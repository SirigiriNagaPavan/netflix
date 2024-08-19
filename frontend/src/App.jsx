import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/home/HomePage'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path = '/' element = {</>}/>*/}
        {/* <Route path = '/' element = {</>}/>*/}
        {/* <Route path = '/' element = {</>}/>*/}
        {/* <Route path = '/' element = {</>}/>*/}
      </Routes>
    </>
  )
}

export default App

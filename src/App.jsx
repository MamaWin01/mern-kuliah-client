import { BrowserRouter } from "react-router-dom";
import Web from "./routes/web"
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Web/>
    </BrowserRouter>
  )
}

export default App

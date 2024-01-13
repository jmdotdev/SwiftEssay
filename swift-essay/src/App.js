import './App.css';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';
import {NotFound} from './components/notfound/NotFound'
import { Dashboard } from './components/dashboard/Dashboard';
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Routes>
      <Route exact path='' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;

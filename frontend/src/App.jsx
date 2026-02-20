import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "./firebase";
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';


// function Dashboard() { return <h1>Dashboard on going</h1>}

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to='/login'/>
}

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  if (user === undefined) return <div>Loading ....</div>

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/dashboard' element={
            <PrivateRoute user={user}> <Dashboard /> </PrivateRoute>
          } />
          <Route path='*' element={
            <Navigate to={user ? "/dashboard" : "/login "} /> 
          }/>
          <Toaster position='top-right' richColors />
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App

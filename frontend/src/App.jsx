import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

            {/* public */}
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>

          {/* protectedRoute - employee */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>

          {/* protected routes - admin*/}
          {/* <ProtectedRoute allowedRules={['admin']}>
            <adminPanel />
          </ProtectedRoute> */}

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
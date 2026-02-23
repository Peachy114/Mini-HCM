import React from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "sonner";

import AdminLayout from "./components/AdminLayout";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/adminDashboard";
import EmployeeList from "./pages/admin/EmployeeList";
import EditEmployee from "./pages/admin/EditEmployee";

//reports
import DailyReport from "./pages/admin/reports/DailyReport";
import WeeklyReport from "./pages/admin/reports/WeeklyReport";



export default function App() {
  return (
    <>
    <BrowserRouter>
      <AuthProvider>
        <Routes>

            {/* public */}
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>

          {/*EMPLOYEEE===========================*/}
          <Route element={
            <ProtectedRoute allowedRoles={["employee", "admin"]}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>


          {/*ADMIN===============================*/}
          <Route path="/admin/" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
          > 
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/:uid" element={<EditEmployee />} />
            <Route path="reports/daily"  element={<DailyReport />} />
            <Route path="reports/weekly" element={<WeeklyReport />} />
          </Route>

          {/* UNAuthorized======================= */}
          <Route path="/unathorized" element={<p>Access denied.</p>}/>

          {/* BACK TO LOGIN */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>

    <Toaster richColors position="top-right" />
    </>
    

  );
}
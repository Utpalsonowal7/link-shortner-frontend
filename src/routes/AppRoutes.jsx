import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp.jsx";
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import Landing from "../pages/Landing.jsx";

const AppRoutes = () => {
     const { user } = useSelector((state) => state.auth);

     return (
          <Routes>
               {/* Public routes — redirect to dashboard if already logged in */}
               <Route path="/" element={<Landing />} />
               <Route
                    path="/login"
                    element={
                         user ? <Navigate to="/dashboard" replace /> : <Login />
                    }
               />
               <Route
                    path="/register"
                    element={
                         user ? (
                              <Navigate to="/dashboard" replace />
                         ) : (
                              <Register />
                         )
                    }
               />
               <Route
                    path="/verify-otp"
                    element={
                         user ? (
                              <Navigate to="/dashboard" replace />
                         ) : (
                              <VerifyOtp />
                         )
                    }
               />
               <Route
                    path="/forgot-password"
                    element={
                         user ? (
                              <Navigate to="/dashboard" replace />
                         ) : (
                              <ForgotPassword />
                         )
                    }
               />
               <Route
                    path="/reset-password"
                    element={
                         user ? (
                              <Navigate to="/dashboard" replace />
                         ) : (
                              <ResetPassword />
                         )
                    }
               />

               {/* Protected routes */}
               <Route
                    path="/dashboard"
                    element={
                         <ProtectedRoute>
                              <Dashboard />
                         </ProtectedRoute>
                    }
               />

             
               <Route
                    path="*"
                    element={
                         <Navigate
                              to={user ? "/dashboard" : "/"}
                              replace
                         />
                    }
               />
          </Routes>
     );
};

export default AppRoutes;

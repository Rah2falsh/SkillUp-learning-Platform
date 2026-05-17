import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

//  الصفحات العامة
import WelcomePage from "./WelcomePage.jsx";
import RoleSelection from "./RoleSelection.jsx";
import SignUp from "./SignUp.jsx";
import LogIn from "./LogIn.jsx";
import ForgotPassword from "./ForgotPassword.jsx";

//  صفحات الموظف
import EmployeeHome from "./employee/EmployeeHome.jsx";
import PersonalInfo from "./employee/PersonalInfo.jsx";
import FavoriteCourses from "./employee/FavoriteCourses.jsx";
import CompletedCourses from "./employee/CompletedCourses.jsx";
import LearningJourney from "./employee/LearningJourney.jsx"; // كان اسمه EmployeePerformance

// صفحات الادمن
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminSignUp from "./admin/AdminSignUp.jsx";
import AdminHome from "./admin/AdminHome.jsx"; // الصفحة الجديدة للمدير
import ViewTrainings from "./admin/ViewTrainings.jsx";
import AdminPersonalInfo from "./admin/AdminPersonalInfo.jsx";

// مهمممة حماية المسارات
import ProtectedRoute from "./ProtectedRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/*  الصفحات العامة */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/role" element={<RoleSelection />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* صفحات الموظف */}
        <Route path="/employee-home" element={
          <ProtectedRoute allowedRole="employee">
            <EmployeeHome />
          </ProtectedRoute>
        } />

        <Route path="/personal-info" element={
          <ProtectedRoute allowedRole="employee">
            <PersonalInfo />
          </ProtectedRoute>
        } />
        
        <Route path="/favorites" element={
          <ProtectedRoute allowedRole="employee">
            <FavoriteCourses />
          </ProtectedRoute>
        } />
<Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/completed" element={
          <ProtectedRoute allowedRole="employee">
            <CompletedCourses />
          </ProtectedRoute>
        } />

        <Route path="/learning-journey" element={
          <ProtectedRoute allowedRole="employee">
            <LearningJourney />
          </ProtectedRoute>
        } />

        {/*  صفحات الـadmin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignUp />} />

        <Route path="/admin-home" element={
          <ProtectedRoute allowedRole="admin">
            <AdminHome />
          </ProtectedRoute>
        } />

<Route path="/view-trainings" element={
  <ProtectedRoute allowedRole="admin">
    <ViewTrainings />
  </ProtectedRoute>
} />
<Route
  path="/admin-personal"
  element={<AdminPersonalInfo />}
/>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
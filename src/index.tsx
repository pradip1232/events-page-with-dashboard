import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LandingPage } from "./screens/LandingPage";

// Pages for dashboard routes
import Dashboard from "./dashbaord/Dashbaord";
import DashboardPage from "./dashbaord/pages/DashboardPage";
import UsersPage from "./dashbaord/pages/UsersPage";
import EventsPage from "./dashbaord/pages/EventsPage";
import YourEventsPage from "./dashbaord/pages/YourEventsPage";
import YourFormsPage from "./dashbaord/pages/YourFormsPage";
import VolunteerPage from "./dashbaord/pages/VolunteerPage";
import SupportPage from "./dashbaord/pages/SupportPage";
import LogoutPage from "./dashbaord/pages/LogoutPage";
import LoginPage from "./screens/LandingPage/LoginPage";
import PrivateRoute from "./components/ui/PrivateRoute";
import SignUpPage from "./screens/SignUpPage";
import ProfilePage from "./dashbaord/pages/ProfilePage";
import { SettingsIcon } from "lucide-react";
import SettingsPage from "./dashbaord/pages/SettingsPage";
import YourTokenPage from "./dashbaord/pages/YourTokenPage";
import PrivacyPolicy from "./screens/LandingPage/PrivacyPolicy";
import TermsAndConditions from "./screens/LandingPage/TermsAndConditions";
import RefundPolicy from "./screens/LandingPage/RefundPolicy";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="privacy-and-policy" element={<PrivacyPolicy />} />
        <Route path="term-and-conditions" element={<TermsAndConditions />} />
        <Route path="refund-policy" element={<RefundPolicy />} />




        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="your-events" element={<YourEventsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="your-token" element={<YourTokenPage />} />
            <Route path="your-forms" element={<YourFormsPage />} />
            <Route path="volunteer" element={<VolunteerPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="logout" element={<LogoutPage />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{ backgroundColor: '#2c2c2e', color: 'white' }}
      />
    </BrowserRouter>
  </StrictMode>
);
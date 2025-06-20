
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Layout Route */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardPage />} />
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/events" element={<EventsPage />} />
          <Route path="/dashboard/your-events" element={<YourEventsPage />} />
          <Route path="/dashboard/your-forms" element={<YourFormsPage />} />
          <Route path="/dashboard/volunteer" element={<VolunteerPage />} />
          <Route path="/dashboard/support" element={<SupportPage />} />
          <Route path="/dashboard/logout" element={<LogoutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
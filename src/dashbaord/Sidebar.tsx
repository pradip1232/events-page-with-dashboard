import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaUsers,
    FaCalendarAlt,
    FaWpforms,
    FaHandsHelping,
    FaHeadset,
    FaSignOutAlt,
    FaTachometerAlt,
} from "react-icons/fa";

interface NavItemProps {
    to: string;
    icon: React.ReactElement;
    text: string;
}

const NavButton: React.FC<NavItemProps & { active: boolean }> = ({ to, icon, text, active }) => (
    <Link
        to={to}
        className={`w-full flex items-center text-left p-2 rounded font-medium transition duration-150 ${active ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "text-white hover:bg-gray-700"
            }`}
    >
        <span className="mr-2">{icon}</span>
        <span>{text}</span>
    </Link>
);

const Sidebar: React.FC = () => {
    const location = useLocation();

    const navItems: NavItemProps[] = [
        { to: "/dashboard", icon: <FaTachometerAlt />, text: "Dashboard" },
        { to: "/dashboard/users", icon: <FaUsers />, text: "Users" },
        { to: "/dashboard/events", icon: <FaCalendarAlt />, text: "Events" },
        { to: "/dashboard/your-events", icon: <FaCalendarAlt />, text: "Your Events" },
        { to: "/dashboard/your-forms", icon: <FaWpforms />, text: "Your Forms" },
        { to: "/dashboard/volunteer", icon: <FaHandsHelping />, text: "Volunteer" },
        { to: "/dashboard/support", icon: <FaHeadset />, text: "Support" },
        { to: "/dashboard/logout", icon: <FaSignOutAlt />, text: "Logout" },
    ];

    return (
        <aside className="bg-gray-800 w-64 hidden md:block h-screen p-4">
            <h2 className="text-2xl font-bold text-pink-500 mb-6">
                Click <span className="text-white">n</span> <span className="text-purple-400">Go</span>
            </h2>
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <NavButton
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        text={item.text}
                        active={location.pathname === item.to}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;

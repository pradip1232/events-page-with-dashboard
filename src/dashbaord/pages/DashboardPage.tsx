import React from "react";
import './Style.css';

const Card = ({ title, count }: { title: string; count: string }) => (
    <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <p className="text-gray-300 text-lg">{title}</p>
        <p className="text-pink-500 text-2xl font-bold">{count}</p>
    </div>
);

const DashboardPage: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Total Forms:" count="150" />
            <Card title="Total Registrations:" count="12,000" />
        </div>
    );
};

export default DashboardPage;

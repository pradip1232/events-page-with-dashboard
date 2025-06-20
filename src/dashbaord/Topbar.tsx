import React from "react";

const Topbar = () => {
    return (
        <header className="bg-gray-800 p-4 md:hidden flex justify-between items-center">
            <h2 className="text-xl font-bold text-pink-500">
                Click <span className="text-white">n</span>{" "}
                <span className="text-purple-400">Go</span>
            </h2>
            <button className="text-white bg-pink-600 px-3 py-1 rounded">Menu</button>
        </header>
    );
};

export default Topbar;

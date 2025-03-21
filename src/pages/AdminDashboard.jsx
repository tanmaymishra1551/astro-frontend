import React, { useState, useEffect } from "react";
import Layout from "./Layout.jsx";

const AdminDashboard = () => {
    // Set up state variables to store data
    const [data, setData] = useState({
        totalSales: 0,
        userCount: 0,
        activeProjects: 0
    });

    useEffect(() => {
        // Fetch the data from the backend API
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/v1/users/usercount");
                const result = await response.json();
                setData(result);  // Update state with the fetched data
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();  // Call fetchData when the component mounts
    }, []);  // Empty dependency array ensures the effect runs only once when the component mounts

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-[#1e0138] shadow-lg rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">Total Sales</h3>
                    <p className="text-2xl font-bold text-yellow-300">₹{data.totalSales}</p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#1e0138] shadow-lg rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">Total Users</h3>
                    <p className="text-2xl font-bold text-yellow-300">{data.userCount}</p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#1e0138] shadow-lg rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">Active Projects</h3>
                    <p className="text-2xl font-bold text-yellow-300">{data.activeProjects}</p>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;

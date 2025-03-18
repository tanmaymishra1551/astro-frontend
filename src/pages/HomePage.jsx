import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to Our App</h1>
                <p className="text-gray-600 mb-6">Please login or register to continue</p>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

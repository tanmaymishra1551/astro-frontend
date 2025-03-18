import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset previous errors

        try {
            const response = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            // Parse the response only once.
            const data = await response.json();
            const role = data.data.user.role
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            // const loggedIN = JSON.stringify(data)
            // console.log(`Data is ${loggedIN}`)

            // Dispatch login success with the API response data.
            dispatch(loginSuccess(data));

            // Role-based redirection based on the returned user role.
            switch (role) {
                case 'user':
                    navigate('/user-dashboard');
                    break;
                case 'astrologer':
                    navigate('/astrologer-dashboard');
                    break;
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                default:
                    navigate('/dashboard');
                    break;
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            {error && (
                <p className="text-red-500 text-center mb-4">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;

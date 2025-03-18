// src/components/DeleteUserButton.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteUserButton = ({ userId }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete user.');
            }
            navigate('/admin/users');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        setLoading(false);
    };

    return (
        <button onClick={handleDelete} disabled={loading} className="bg-red-500 text-white p-2 rounded">
            {loading ? 'Deleting...' : 'Delete User'}
        </button>
    );
};

export default DeleteUserButton;

// src/components/UserStatusToggle.jsx
import React, { useState } from 'react';

const UserStatusToggle = ({ userId, currentStatus, onStatusChange }) => {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setLoading(true);
        try {
            const response = await fetch(`/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            setStatus(newStatus);
            if (onStatusChange) onStatusChange(newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        }
        setLoading(false);
    };

    return (
        <select
            value={status}
            onChange={handleStatusChange}
            disabled={loading}
            className="border p-2 rounded"
        >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
        </select>
    );
};

export default UserStatusToggle;

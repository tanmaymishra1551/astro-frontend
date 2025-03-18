// src/components/ResetPasswordButton.jsx
import React, { useState } from 'react';

const ResetPasswordButton = ({ userId }) => {
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!window.confirm('Reset password for this user?')) return;
        setLoading(true);
        try {
            const response = await fetch(`/admin/users/${userId}/reset-password`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to reset password.');
            }
            alert('Password reset successfully.');
        } catch (error) {
            console.error('Error resetting password:', error);
        }
        setLoading(false);
    };

    return (
        <button onClick={handleResetPassword} disabled={loading} className="bg-yellow-500 text-white p-2 rounded">
            {loading ? 'Resetting...' : 'Reset Password'}
        </button>
    );
};

export default ResetPasswordButton;

import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

export const useClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/dashboard/users`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setClients(data?.data || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    return { clients, loading, error };
};

import { useState } from 'react';

const useFileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const uploadFile = async (roomId, senderId, socket) => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/chat/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            socket.emit('sendMessage', {
                roomId,
                senderId,
                message: '',
                fileUrl: data.fileUrl,
                timestamp: new Date(),
            });

            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error('File upload error:', error);
        }
    };

    return { selectedFile, previewUrl, handleFileChange, uploadFile };
};

export default useFileUpload;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';


const CalleeVideoPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get('roomId');
    const callerId = searchParams.get('callerId');
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [callStatus, setCallStatus] = useState('waiting');
    const [incomingCall, setIncomingCall] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const socketRef = useRef(null);
    const localStream = useRef(null);
    const screenStream = useRef(null);
    const timerRef = useRef(null);

    const loggedIn = useSelector((state) => state.auth);
    const loggedInToken = loggedIn.loggedIn.accessToken;
    const loggedInUser = loggedIn.loggedIn.id;
    const loggedInUserName = loggedIn.loggedIn.username;

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
            path: "/ws/chat",
            auth: { loggedInToken },
            transports: ["websocket"],
        });

        // Create peer connection
        peerConnection.current = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        // Handle ICE candidates
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', {
                    candidate: event.candidate,
                    roomId
                });
            }
        };

        // Handle remote stream
        peerConnection.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // Get local media stream and create offer
        const initializeCall = async () => {
            try {
                localStream.current = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                localVideoRef.current.srcObject = localStream.current;

                // Add local tracks to peer connection
                localStream.current.getTracks().forEach(track => {
                    peerConnection.current.addTrack(track, localStream.current);
                });

                // Create a promise to collect all ICE candidates
                const collectIceCandidates = new Promise((resolve) => {
                    const iceCandidates = [];
                    peerConnection.current.onicecandidate = (event) => {
                        if (event.candidate) {
                            iceCandidates.push(event.candidate);
                        } else {
                            // No more candidates
                            resolve(iceCandidates);
                        }
                    };
                });

                // Create and set local description
                const offer = await peerConnection.current.createOffer();
                await peerConnection.current.setLocalDescription(offer);

                // Wait for ICE gathering to complete and collect all candidates
                const iceCandidates = await collectIceCandidates;
                console.log(`type of iceCandidates is ${typeof (iceCandidates)}`)
                // Send offer with ICE candidates
                console.log(`Offer is ${offer} and roomId is ${roomId} and callerId is ${loggedInUser}`);
                socketRef.current.emit('offer', {
                    offer: peerConnection.current.localDescription,
                    iceCandidates,
                    roomId,
                    callerId,
                    calleeId: loggedInUser
                });

                setIsCallActive(true);
                setCallStatus('connected');
                startTimer();
            } catch (error) {
                console.error('Error initializing call:', error);
                setCallStatus('error');
            }
        };

        // Wait for socket connection before joining room and initializing call
        socketRef.current.on('connect', () => {
            console.log('Socket connected, joining room and initializing call');
            socketRef.current.emit('join-room', { roomId, recipientId: callerId, loggedInUserName });
            initializeCall();
        });

        // Listen for answer
        socketRef.current.on('answer', async ({ answer, iceCandidates, from }) => {
            console.log(`Received answer ${answer} with ICE candidates ${iceCandidates} from ${from}`);
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
            
            // Process ICE candidates sent with the answer
            if (iceCandidates && iceCandidates.length > 0) {
                console.log(`Processing ${iceCandidates.length} ICE candidates from answer`);
                for (const candidate of iceCandidates) {
                    try {
                        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (err) {
                        console.error("❌ Failed to add ICE (from answer)", err);
                    }
                }
            }
        }); 

        // Listen for chat messages
        socketRef.current.on('chat-message', ({ message }) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            if (peerConnection.current) peerConnection.current.close();
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop());
            }
            if (screenStream.current) {
                screenStream.current.getTracks().forEach(track => track.stop());
            }
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [roomId]);

    const acceptCall = async () => {
        try {
            // Get local media stream
            localStream.current = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localVideoRef.current.srcObject = localStream.current;

            // Create peer connection
            peerConnection.current = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ]
            });

            // Add local tracks to peer connection
            localStream.current.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, localStream.current);
            });

            // Handle remote stream
            peerConnection.current.ontrack = (event) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };

            // Handle ICE candidates
            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current.emit('ice-candidate', {
                        candidate: event.candidate,
                        roomId
                    });
                }
            };

            // Create and send answer
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socketRef.current.emit('answer', { answer, roomId });

            setIsCallActive(true);
            setIncomingCall(false);
            setCallStatus('connected');
            startTimer();

        } catch (error) {
            console.error('Error accepting call:', error);
            setCallStatus('error');
        }
    };

    const rejectCall = () => {
        setIncomingCall(false);
        setCallStatus('rejected');
        navigate('/');
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
    };

    const toggleMute = () => {
        if (localStream.current) {
            localStream.current.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream.current) {
            localStream.current.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                screenStream.current = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });

                // Replace video track
                const videoTrack = screenStream.current.getVideoTracks()[0];
                const sender = peerConnection.current.getSenders().find(s => s.track.kind === 'video');
                sender.replaceTrack(videoTrack);

                setIsScreenSharing(true);
            } else {
                // Switch back to camera
                const videoTrack = localStream.current.getVideoTracks()[0];
                const sender = peerConnection.current.getSenders().find(s => s.track.kind === 'video');
                sender.replaceTrack(videoTrack);

                screenStream.current.getTracks().forEach(track => track.stop());
                setIsScreenSharing(false);
            }
        } catch (error) {
            console.error('Error toggling screen share:', error);
        }
    };

    const endCall = () => {
        if (peerConnection.current) {
            peerConnection.current.close();
        }
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop());
        }
        if (screenStream.current) {
            screenStream.current.getTracks().forEach(track => track.stop());
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setIsCallActive(false);
        setCallStatus('ended');
        setCallDuration(0);
        navigate('/');
    };

    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                text: newMessage,
                sender: loggedInUser,
                timestamp: new Date().toISOString()
            };
            socketRef.current.emit('chat-message', { roomId, message });
            setMessages(prev => [...prev, message]);
            setNewMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {incomingCall && !isCallActive ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h2 className="text-2xl mb-4">Incoming Call</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={acceptCall}
                            className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
                        >
                            Accept
                        </button>
                        <button
                            onClick={rejectCall}
                            className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Video Area */}
                    <div className="flex-1 relative">
                        {/* Remote Video */}
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />

                        {/* Local Video */}
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="absolute bottom-4 right-4 w-48 h-36 rounded-lg object-cover"
                        />

                        {/* Call Status */}
                        <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                            Status: {callStatus}
                        </div>

                        {/* Call Duration */}
                        <div className="absolute top-4 right-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                            {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                            <button
                                onClick={toggleMute}
                                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
                            >
                                {isMuted ? '🔇' : '🎤'}
                            </button>
                            <button
                                onClick={toggleVideo}
                                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
                            >
                                {isVideoOff ? '📷' : '📹'}
                            </button>
                            <button
                                onClick={toggleScreenShare}
                                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
                            >
                                {isScreenSharing ? '🖥️' : '📱'}
                            </button>
                            <button
                                onClick={endCall}
                                className="bg-red-600 p-2 rounded-full hover:bg-red-700"
                            >
                                📞
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="w-80 bg-gray-800 flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 p-2 rounded-lg ${message.sender === loggedInUser
                                        ? 'bg-blue-600 ml-auto'
                                        : 'bg-gray-700'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 bg-gray-700 rounded-l-lg px-4 py-2"
                                    placeholder="Type a message..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CalleeVideoPage; 
import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const VoicePage = () => {
    const roomId = "test-room";
    const socketRef = useRef(null);
    const peerConnection = useRef(null);
    const localStream = useRef(null);

    useEffect(() => {
        const init = async () => {
            try {
                // STEP 1: Get microphone access
                localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log("🎤 Microphone access granted");

                // Attach to local audio element
                const localAudio = document.getElementById("localAudio");
                if (localAudio) {
                    localAudio.srcObject = localStream.current;
                }

                // STEP 2: Connect to signaling socket
                socketRef.current = io(`${import.meta.env.VITE_PUBLIC_API_BASE_URL}/call`, {
                    path: "/ws/call",
                    transports: ["websocket"],
                });

                const socket = socketRef.current;

                socket.on("connect", () => {
                    console.log("✅ Connected to Call Socket:", socket.id);
                    socket.emit("join-room", roomId);
                });

                socket.on("user-joined", async (userId) => {
                    console.log("🔔 User joined:", userId);
                    await startCall(userId);
                });

                socket.on("offer", async ({ offer, from }) => {
                    console.log("📨 Offer received");
                    await createPeer(false, from);
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peerConnection.current.createAnswer();
                    await peerConnection.current.setLocalDescription(answer);
                    socket.emit("answer", { answer, to: from });
                });

                socket.on("answer", async ({ answer }) => {
                    console.log("📨 Answer received");
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                });

                socket.on("ice-candidate", async ({ candidate }) => {
                    try {
                        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                        console.log("📡 ICE Candidate added");
                    } catch (error) {
                        console.error("❌ Error adding ICE candidate", error);
                    }
                });
            } catch (err) {
                console.error("🚫 Microphone access denied:", err);
                alert("Microphone access is required for voice calls.");
            }
        };

        init();

        return () => {
            socketRef.current?.disconnect();
            peerConnection.current?.close();
        };
    }, []);

    const startCall = async (remoteSocketId) => {
        await createPeer(true, remoteSocketId);
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socketRef.current.emit("offer", { offer, to: remoteSocketId });
        console.log("📤 Offer sent");
    };

    const createPeer = async (isInitiator, remoteSocketId) => {
        peerConnection.current = new RTCPeerConnection();

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit("ice-candidate", {
                    candidate: event.candidate,
                    to: remoteSocketId,
                });
            }
        };

        peerConnection.current.ontrack = (event) => {
            const remoteAudio = document.getElementById("remoteAudio");
            if (remoteAudio && event.streams[0]) {
                remoteAudio.srcObject = event.streams[0];
                // Let autoPlay handle it naturally (no manual play() call)
                // remoteAudio.play().catch((err) => console.error("❌ Failed to play remote audio", err));
            }
        };

        // Add local tracks
        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => {
                peerConnection.current.addTrack(track, localStream.current);
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-between h-screen bg-purple-800 text-white px-4 py-8">
            <div className="text-center mt-6">
                <h2 className="text-lg font-medium">Astrotalk</h2>
                <h1 className="text-2xl font-semibold mt-4">Liam Livingstone</h1>
                <p className="text-sm mt-1">05:30</p>
            </div>

            <div className="w-40 h-40 rounded-full overflow-hidden mt-10">
                <img
                    src="../../public/asto1.png"
                    alt="User"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col items-center space-y-6 mb-6">
                <div className="flex justify-center space-x-8">
                    <ControlButton icon="🎤" label="Mute" />
                    <ControlButton icon="💬" label="Message" />
                    <ControlButton icon="🔊" label="Speaker" />
                </div>

                <button className="bg-red-600 w-16 h-16 rounded-full text-2xl">📞</button>
            </div>

            {/* Local and Remote Audio */}
            <audio id="localAudio" autoPlay muted controls hidden />
            <audio id="remoteAudio" autoPlay controls hidden />
        </div>
    );
};

const ControlButton = ({ icon, label }) => (
    <div className="flex flex-col items-center">
        <button className="w-14 h-14 bg-white text-black rounded-full text-xl">
            {icon}
        </button>
        <span className="mt-1 text-sm">{label}</span>
    </div>
);

export default VoicePage;

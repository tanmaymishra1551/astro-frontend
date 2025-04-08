import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const VideoPage = () => {
    const roomId = "video-room";

    const socketRef = useRef(null);
    const peerConnection = useRef(null);
    const localStream = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const remoteDescSet = useRef(false);
    const pendingCandidates = useRef([]);

    useEffect(() => {
        const init = async () => {
            try {
                // Get camera & mic
                localStream.current = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStream.current;
                }
            } catch (err) {
                console.error("🚫 Camera/Mic access denied", err);
                alert("Camera and mic are required");
                return;
            }

            // Connect to socket
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
                await createPeer(false, from);
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                remoteDescSet.current = true;

                for (const candidate of pendingCandidates.current) {
                    try {
                        await peerConnection.current.addIceCandidate(candidate);
                    } catch (err) {
                        console.error("❌ Failed to add ICE (buffered)", err);
                    }
                }
                pendingCandidates.current = [];

                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                socket.emit("answer", { answer, to: from });
            });

            socket.on("answer", async ({ answer }) => {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                remoteDescSet.current = true;

                for (const candidate of pendingCandidates.current) {
                    try {
                        await peerConnection.current.addIceCandidate(candidate);
                    } catch (err) {
                        console.error("❌ Failed to add ICE (buffered)", err);
                    }
                }
                pendingCandidates.current = [];
            });

            socket.on("ice-candidate", async ({ candidate }) => {
                const iceCandidate = new RTCIceCandidate(candidate);
                if (remoteDescSet.current) {
                    try {
                        await peerConnection.current.addIceCandidate(iceCandidate);
                    } catch (err) {
                        console.error("❌ Failed to add ICE", err);
                    }
                } else {
                    console.log("🕓 Queued ICE Candidate");
                    pendingCandidates.current.push(iceCandidate);
                }
            });
        };

        init();

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            if (peerConnection.current) peerConnection.current.close();
        };
    }, []);

    const startCall = async (remoteSocketId) => {
        await createPeer(true, remoteSocketId);
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socketRef.current.emit("offer", { offer, to: remoteSocketId });
    };

    const createPeer = async (isInitiator, remoteSocketId) => {
        peerConnection.current = new RTCPeerConnection();

        remoteDescSet.current = false;
        pendingCandidates.current = [];

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                if (remoteDescSet.current) {
                    socketRef.current.emit("ice-candidate", {
                        candidate: event.candidate,
                        to: remoteSocketId,
                    });
                } else {
                    pendingCandidates.current.push(event.candidate);
                }
            }
        };

        peerConnection.current.ontrack = (event) => {
            console.log("📽️ Remote track received");
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        if (localStream.current) {
            localStream.current.getTracks().forEach((track) =>
                peerConnection.current.addTrack(track, localStream.current)
            );
        }
    };

    return (
        <div className="relative h-screen bg-black text-white">
            {/* Remote Video */}
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute w-full h-full object-cover"
            ></video>

            {/* Local Video (small preview) */}
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="absolute bottom-20 right-4 w-28 h-36 rounded-md border border-white object-cover z-10"
            ></video>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8 z-20">
                <ControlButton icon="🎤" label="Mute" />
                <ControlButton icon="💬" label="Message" />
                <ControlButton icon="🔊" label="Speaker" />
                <button className="bg-red-600 w-16 h-16 rounded-full text-2xl">📞</button>
            </div>
        </div>
    );
};

const ControlButton = ({ icon, label }) => (
    <div className="flex flex-col items-center">
        <button className="w-14 h-14 bg-white text-black rounded-full text-xl">
            {icon}
        </button>
        <span className="text-xs mt-1">{label}</span>
    </div>
);

export default VideoPage;

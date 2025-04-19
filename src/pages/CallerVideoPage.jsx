import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";


const VideoPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const loggedIn = useSelector((state) => state.auth);
    const loggedInToken = loggedIn.loggedIn.accessToken;
    const loggedInUser = loggedIn.loggedIn.id;
    const loggedInUserName = loggedIn.loggedIn.username;
    // Expect query parameters such as roomId, recipientId, and role
    const roomId = searchParams.get("roomId") || "video-room";
    const recipientId = searchParams.get("callee") || "astrologer";
    const role = searchParams.get("role") || "callee"; // "caller" or "callee"

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

            socketRef.current = io(import.meta.env.VITE_PUBLIC_API_BASE_URL, {
                path: "/ws/chat",
                auth: { loggedInToken },
                transports: ["websocket"],
            });
            const socket = socketRef.current;

            socket.on("connect", () => {
                console.log(`✅ Connected to Call Socket with ${socket.id} of loggInUser:${loggedInUserName}`);
                // All peers join the same room
                socket.emit("join-room", { roomId, recipientId, loggedInUserName });
                // Send video call request if you are the caller
                    console.log("📞 Sending video call request to", recipientId);
                    socket.emit("video-call-request", {
                        roomId,
                        from: socket.id,
                        to: recipientId,
                        username: loggedInUserName
                    });
            });


            socket.on("offer", async ({ offer,iceCandidates, roomId, calleeId }) => {
                console.log(`Received offer from ${calleeId} in room ${roomId}`);
                console.log(`type of iceCandidates is ${typeof (iceCandidates)}`)
                await createPeer(false, calleeId);
                await peerConnection.current.setRemoteDescription(offer);
                remoteDescSet.current = true;

                // Add all received ICE candidates
                for (const candidate of iceCandidates) {
                    try {
                        await peerConnection.current.addIceCandidate(candidate);
                    } catch (err) {
                        console.error("❌ Failed to add ICE candidate", err);
                    }
                }

                // Create answer and gather ICE candidates
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);

                // Wait for ICE gathering to complete
                const answerIceCandidates = [];
                await new Promise(resolve => {
                    peerConnection.current.onicecandidate = (event) => {
                        if (event.candidate) {
                            answerIceCandidates.push(event.candidate);
                        } else {
                            // Null candidate means ICE gathering is complete
                            resolve();
                        }
                    };
                });

                // Send answer with all gathered ICE candidates
                socket.emit("answer", { 
                    answer, 
                    iceCandidates: answerIceCandidates,
                    to: calleeId 
                });
            });

            socket.on("answer", async ({ answer, from }) => {
                // Only the caller will get an answer
                console.log(`Got ${answer} from ${from}`);
                if (role === "caller") {
                    await peerConnection.current.setRemoteDescription(answer);
                    remoteDescSet.current = true;
                    for (const candidate of pendingCandidates.current) {
                        try {
                            await peerConnection.current.addIceCandidate(candidate);
                        } catch (err) {
                            console.error("❌ Failed to add ICE (buffered)", err);
                        }
                    }
                    pendingCandidates.current = [];
                }
            });

            socket.on("ice-candidate", async ({ candidate }) => {
                console.log("🧊 ICE Candidate received:", candidate);
                const iceCandidate = candidate;
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
    }, [roomId, recipientId, role]);

    const startCall = async (remoteSocketId) => {
        await createPeer(true, remoteSocketId);
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        
        // Wait for ICE gathering to complete
        const iceCandidates = [];
        await new Promise(resolve => {
            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    iceCandidates.push(event.candidate);
                } else {
                    // Null candidate means ICE gathering is complete
                    resolve();
                }
            };
        });

        // Send offer with all gathered ICE candidates
        socketRef.current.emit("offer", { 
            offer,
            candidates: iceCandidates,
            to: remoteSocketId 
        });
    };

    const createPeer = async (isInitiator, remoteSocketId) => {
        peerConnection.current = new RTCPeerConnection();
        remoteDescSet.current = false;
        pendingCandidates.current = [];

        // Only set up ice candidate handling for callee
        if (!isInitiator) {
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
        }

        peerConnection.current.ontrack = (event) => {
            const remoteStream = event.streams[0];
            if (remoteVideoRef.current && remoteStream) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
        };

        // Add local tracks to the connection
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
                className="absolute w-full h-full object-cover border-4 border-green-400 z-20"
            ></video>

            {/* Local Video (small preview) */}
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="absolute bottom-20 right-4 w-28 h-36 rounded-md border border-white object-cover z-10"
            ></video>

            {/* Call Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8 z-30">
                <ControlButton icon="🎤" label="Mute" />
                <ControlButton icon="💬" label="Message" />
                <ControlButton icon="🔊" label="Speaker" />
                <button className="bg-red-600 w-16 h-16 rounded-full text-2xl">
                    📞
                </button>
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

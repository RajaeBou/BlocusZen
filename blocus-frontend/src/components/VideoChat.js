import React, { useEffect, useRef, useState } from "react";

export default function VideoChat({ session, userName }) {
  const localVideoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;
        setMediaStream(stream);
      } catch (error) {
        console.error("Erreur média :", error);
      }
    };

    startStream();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleCamera = () => {
    const videoTrack = mediaStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setCameraOn(videoTrack.enabled);
  };

  const toggleMic = () => {
    const audioTrack = mediaStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      const videoSender = mediaStream.getVideoTracks()[0];
      mediaStream.removeTrack(videoSender);
      mediaStream.addTrack(screenTrack);
      localVideoRef.current.srcObject = new MediaStream([screenTrack, ...mediaStream.getAudioTracks()]);
      setScreenSharing(true);

      screenTrack.onended = () => {
        // Revenir à la caméra
        navigator.mediaDevices.getUserMedia({ video: true }).then((newStream) => {
          const newVideoTrack = newStream.getVideoTracks()[0];
          mediaStream.removeTrack(screenTrack);
          mediaStream.addTrack(newVideoTrack);
          localVideoRef.current.srcObject = new MediaStream([newVideoTrack, ...mediaStream.getAudioTracks()]);
          setScreenSharing(false);
        });
      };
    } catch (err) {
      console.error("Partage d'écran annulé ou échoué :", err);
    }
  };

  return (
    <div className="mt-8 border border-gray-300 p-4 rounded-xl bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-2">🎥 Appel vidéo – Session publique</h3>
      <video ref={localVideoRef} autoPlay playsInline muted className="rounded-md w-full max-w-md" />

      <div className="flex gap-4 mt-4">
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-lg ${cameraOn ? "bg-red-200" : "bg-green-200"}`}
        >
          {cameraOn ? "🎥 Couper caméra" : "🎥 Activer caméra"}
        </button>
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded-lg ${micOn ? "bg-red-200" : "bg-green-200"}`}
        >
          {micOn ? "🎤 Couper micro" : "🎤 Activer micro"}
        </button>
        <button
          onClick={shareScreen}
          disabled={screenSharing}
          className="px-4 py-2 bg-blue-200 rounded-lg"
        >
          🖥️ Partager écran
        </button>
      </div>
    </div>
  );
}

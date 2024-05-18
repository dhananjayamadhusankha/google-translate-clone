"use client";

import { MicIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

function Recorder({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) {
  const [permission, setPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("Your browser does not support the MediaRecorder API");
    }
  };

  return (
    <div>
      <MicIcon size={20} />
      {!permission && (
        <button onClick={getMicrophonePermission}>Get Microphone</button>
      )}
      
      {pending && (
        <p>
          {recordingStatus === "recording" ? "Recording" : "Stop recording..."}
        </p>
      )}
    </div>
  );
}

export default Recorder;

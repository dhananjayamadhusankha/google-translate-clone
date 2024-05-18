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

  const startRecording = () => {};
  const stopRecording = () => {};

  return (
    <div
      className={`flex items-center group text-blue-500 cursor-pointer border rounded-md w-fit px-3 py-2 mb-5 ${
        recordingStatus === "recording"
          ? "bg-red-500 text-white"
          : "hover:bg-[#E7F0FE]"
      }`}
    >
      <MicIcon size={20} className="group-hover:underline" />
      {!permission && (
        <button onClick={getMicrophonePermission}>Get Microphone</button>
      )}

      {pending && (
        <p className="text-sm font-medium group-hover:underline ml-2">
          {recordingStatus === "recording" ? "Recording" : "Stop recording..."}
        </p>
      )}

      {permission && recordingStatus === "inactive" && !pending && (
        <button
          onClick={startRecording}
          className="text-sm font-medium group-hover:underline ml-2"
        >
          Speak
        </button>
      )}

      {recordingStatus === "recording" && (
        <button
          onClick={stopRecording}
          className="text-sm font-medium group-hover:underline ml-2 mt-2"
        >
          Speak
        </button>
      )}
    </div>
  );
}

export default Recorder;

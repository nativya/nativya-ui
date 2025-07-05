import React, { useRef, useState, useEffect } from "react";

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob, audioUrl: string, recordingTime: number) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
        onAudioReady(blob, url, recordingTime);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleReset = () => {
    setAudioBlob(null);
    setAudioUrl("");
    setRecordingTime(0);
  };

  return (
    <div className="mb-6">
      <div className="text-center">
        {!isRecording && !audioBlob && (
          <button
            type="button"
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-colors"
          >
            🎤 Start Recording
          </button>
        )}

        {isRecording && (
          <div className="space-y-4">
            <div className="text-xl sm:text-2xl font-mono text-red-500">
              {formatTime(recordingTime)}
            </div>
            <button
              type="button"
              onClick={stopRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-colors"
            >
              ⏹️ Stop Recording
            </button>
          </div>
        )}

        {audioBlob && audioUrl && (
          <div className="space-y-4">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <div className="text-xs sm:text-sm text-gray-600">
              Recording duration: {formatTime(recordingTime)}
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Record Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;

import { useState } from "react";
import axios from "axios";

export default function UploadForm({ onClipData }) {
  const [videoFile, setVideoFile] = useState(null);
  const [clipLength, setClipLength] = useState(15);
  const [loading, setLoading] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  async function handleUpload(e){
    e.preventDefault();
    if(!videoFile) return alert("Select a video file");
    const fd = new FormData();
    fd.append("video", videoFile);
    fd.append("clipLength", clipLength);
    setLoading(true);
    try {
      const res = await axios.post(`${api}/api/cut`, fd, { headers: { "Content-Type":"multipart/form-data" }, timeout: 120000 });
      onClipData(res.data);
    } catch(err){
      console.error(err);
      alert("Upload failed: " + (err?.response?.data?.error || err.message));
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleUpload} className="bg-gray-800 p-6 rounded-xl space-y-4">
      <input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files[0])} className="w-full text-sm text-gray-300" />
      <input type="number" value={clipLength} onChange={e=>setClipLength(e.target.value)} className="w-full bg-gray-700 p-2 rounded" />
      <button type="submit" disabled={loading} className="w-full bg-indigo-600 p-2 rounded font-semibold">
        {loading ? "Processing..." : "Upload & Cut"}
      </button>
    </form>
  );
}

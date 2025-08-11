import { useState } from "react";
import UploadForm from "../components/UploadForm";
import ClipPreview from "../components/ClipPreview";

export default function Home() {
  const [clipData, setClipData] = useState(null);
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🎬 Clip Agent</h1>
      <div className="w-full max-w-3xl">
        <UploadForm onClipData={(d)=>setClipData(d)} />
        {clipData && <div className="mt-6"><ClipPreview clipUrl={clipData.clipUrl} score={clipData.viralityScore} /></div>}
      </div>
    </div>
  );
}

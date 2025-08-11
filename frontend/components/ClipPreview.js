import ReactPlayer from "react-player";

export default function ClipPreview({ clipUrl, score }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold">Clip Preview</h2>
      {clipUrl ? <ReactPlayer url={clipUrl} controls width="100%" height="360px" /> : <div>No clip yet</div>}
      {score !== undefined && <div className="text-green-400">Virality Score: {score}</div>}
    </div>
  );
}

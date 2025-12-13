import { useState } from "react";
import Showallvideos from "./showallvideos";
import Playlist from "../dashboard/playlistshow/playlist";
import Homeprofile from "./homeprofile";

function Profiledatashow({ userId }) {
  const [active, setActive] = useState("home");

  const tabs = [
    { id: "home", label: "Home" },
    { id: "videos", label: "Videos" },
    { id: "playlists", label: "Playlists" },
  ];

  return (
    <div className="mt-8">
      <div className="flex gap-10 border-b border-gray-700 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`pb-2 text-lg cursor-pointer font-medium transition-all ${
              active === tab.id
                ? "text-black border-b-2 border-black"
                : "text-black hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 text-black text-xl">
        {active === "home" && <Homeprofile userId={userId} />}
        {active === "videos" && <Showallvideos userId={userId} />}
        {active === "playlists" && <Playlist />}
      </div>
    </div>
  );
}

export default Profiledatashow;

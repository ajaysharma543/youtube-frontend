import React from "react";
import Playlist from "./playlistshow/playlist";
import Liked from "./playlistshow/liked";

function Playlistdashboard() {
  return (
    <>
      <div className="flex p-4 gap-12 ">
        <Playlist />
        {/* <Liked /> */}
      </div>
    </>
  );
}

export default Playlistdashboard;

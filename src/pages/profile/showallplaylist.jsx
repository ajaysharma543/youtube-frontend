import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Playlist from "../dashboard/playlistshow/playlist";

function Showallplaylist() {
  // const { list = [] } = useSelector((state) => state.playlist || {});

  useEffect(() => {
    // console.log(list);
  });

  return (
    <div className="w-full flex p-3 justify-start items-start">
      <Playlist />
    </div>
  );
}

export default Showallplaylist;

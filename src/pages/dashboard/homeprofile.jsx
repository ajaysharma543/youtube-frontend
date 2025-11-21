import React from "react";
import Showallvideos from "./showallvideos";

function Homeprofile({ userId }) {
  
  return (
    <div className="text-white">
      <div className="border-b border-gray-500 pb-10">
        <p className="text-lg font-semibold mb-2">Popular Videos</p>
        <Showallvideos
          userId={userId}
          limit={4}
          sortBy="views"
          sortType="desc"
        />
      </div>
      <div className="border-b border-gray-500 pb-10">
        <p className="text-lg font-semibold mt-6 mb-2">Latest Videos</p>
        <Showallvideos userId={userId} limit={4} />
      </div>
    </div>
  );
}

export default Homeprofile;

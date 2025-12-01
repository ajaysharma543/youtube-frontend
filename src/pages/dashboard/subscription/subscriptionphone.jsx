import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import authApi from "../../../api/userapi";
import Allsubscriptions from "./allsubscriptions";
import Showallvideos from "../showallvideos";
import { useNavigate } from "react-router-dom";

function Subscriptionphone() {
  const { data: user } = useSelector((state) => state.user);
  const [subs, setSubs] = useState([]);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const getsubs = async () => {
      if (!user?.username) return;

      const res = await authApi.getUserChannelProfile(user.username);
      setSubs(res.data.data.mysubscribedchannels || []);
    };

    getsubs();
  }, [user]);

  return (
    <>
      <div className="sm:hidden bg-black w-full px-4">
        {/* MOBILE ONLY */}

        {/* IMAGE SCROLL ROW */}
        <div className="w-full mt-4">
          <div className="flex gap-4 overflow-x-auto scroll-smooth pb-4">
            {subs.map((ch) => (
              <div
                key={ch._id}
                className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl ${
                  selectedUser?._id === ch._id
                    ? "bg-[#393232e2] scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={ch.avatar?.url || "/default-avatar.png"}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover cursor-pointer transition-all"
                  onClick={() => setSelectedUser(ch)}
                />
              </div>
            ))}
          </div>

          {/* VISIT CHANNEL BUTTON */}
          {selectedUser && (
            <div className="w-full flex justify-end mt-3">
              <button
                onClick={() => navigate(`/c/${selectedUser.username}`)}
                className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700"
              >
                Visit Channel
              </button>
            </div>
          )}
        </div>

        {/* VIDEOS WHEN USER SELECTED */}
        {selectedUser && (
          <div className="mt-4 w-full">
            <Showallvideos
              userId={selectedUser._id}
              sortBy="createdAt"
              sortType="desc"
            />
          </div>
        )}

        {/* IF NO USER SELECTED → SHOW ALL SUBSCRIPTIONS */}
        {!selectedUser && (
          <div className="mt-4">
            <Allsubscriptions />
          </div>
        )}
      </div>
    </>
  );
}

export default Subscriptionphone;

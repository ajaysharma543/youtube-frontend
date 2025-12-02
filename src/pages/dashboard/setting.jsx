import React from "react";
import { useDispatch, useSelector } from "react-redux";
import LogoutButton from "../auth/logout";

function Setings() {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  // console.log(user);

  return (
    <div className=" bg-black text-white p-6 flex justify-center">
      <div className="w-full max-w-xl bg-gray-900 p-6 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>

        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar?.url || "/default-avatar.png"}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{user.fullname}</h2>
                <p className="text-gray-400">@{user.username}</p>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl space-y-2">
              <p>
                <span className="font-semibold">Account ID:</span> {user._id}
              </p>
            </div>

            <LogoutButton />
            {/* thast neow */}
          </div>
        ) : (
          <p className="text-gray-400">User data not found.</p>
        )}
      </div>
    </div>
  );
}

export default Setings;

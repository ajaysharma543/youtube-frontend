import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import authApi from '../../../api/userapi';
import Allsubscriptions from './allsubscriptions';
import Showallvideos from '../showallvideos';
import { useNavigate } from 'react-router-dom';

function Subscriptionphone() {
  const { data: user } = useSelector((state) => state.user);
  const [subs, setSubs] = useState([]);
  const navigate = useNavigate()
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
      <div className="flex flex-col items-end w-full">

       <div className="flex flex-col w-full">

  {/* TOP — IMAGE ROW */}
  <div className="flex gap-4 overflow-x-auto pb-4 w-full pl-5 sm:flex-row flex-nowrap">
    {subs.map((ch) => (
      <div
        key={ch._id}
        className={`flex flex-col mt-5 p-3 items-center ${
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

        <p className="text-white mt-2">{ch.username}</p>
      </div>
    ))}
  </div>

  {selectedUser && (
      <div className="p-4 rounded-xl flex justify-end items-center">
        <button
          onClick={() => navigate(`/c/${selectedUser.username}`)}
          className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700"
        >
          Visit Channel
        </button>
      </div>
  )}
</div>


        {selectedUser && (
          <div className="w-full">
            <Showallvideos
              userId={selectedUser._id}
              sortBy="createdAt"
              sortType="desc"
            />
          </div>
        )}

      </div>

      {!selectedUser && (
        <div className="sm:hidden">
          <Allsubscriptions />
        </div>
      )}
    </>
  );
}

export default Subscriptionphone;

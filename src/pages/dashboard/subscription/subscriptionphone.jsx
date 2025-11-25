import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/userapi';

function Subscriptionphone() {
      const { data: user } = useSelector((state) => state.user);
  const [subs, setSubs] = useState([]);
  // const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const getsubs = async () => {
      if (!user?.username) return;

      const res = await authApi.getUserChannelProfile(user.username);
      console.log("Subscribed Channels:", res.data.data.mysubscribedchannels);

      setSubs(res.data.data.mysubscribedchannels || []);
      console.log(res.data.data.mysubscribedchannels || []);
    };

    getsubs();
  }, [user]);
  return (
    <div>Subscriptionphone</div>
  )
}

export default Subscriptionphone
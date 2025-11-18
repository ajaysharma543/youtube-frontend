import axiosclient from "./api";

const subscriberApi = {
  subscribe: (channelId) =>
    axiosclient.post(`subscription/subscribe/${channelId}`),
  channelsubscriber: (channelId) =>
    axiosclient.get(`subscription/channel/${channelId}`),
  subscribedchannel: (subscriberId) =>
    axiosclient.get(`subscription/subscriber/${subscriberId}`),
};

export default subscriberApi;

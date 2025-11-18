import axiosclient from "./api";

const OtpApi = {
  sendOtp: (email) => axiosclient.post("/otp/send-otp", { email }),
  verifyOtp: ({ email, otp }) =>
    axiosclient.post("/otp/verify-otp", { email, otp }),
  sendresetotp: (email) => axiosclient.post("/otp/reset/send", { email }),
  verifyresetOtp: (data) => axiosclient.post("/otp/reset/verify", data),
  sendChangeEmailOtp: (data) => axiosclient.post("/otp/reset/emailsend", data),
};

export default OtpApi;

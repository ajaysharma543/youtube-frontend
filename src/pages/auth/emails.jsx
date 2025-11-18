import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setEmail } from "../../redux/features/singupslice";
import { signupStart, signupFailure } from "../../redux/features/authslice";
import FormContainer from "../../components/form-container";
import InputField from "../../components/inputfiled";
import Button from "../../components/button";
import OtpApi from "../../api/otp.jsx";

const SignupStep2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: globalError } = useSelector((state) => state.auth);

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [localError, setLocalError] = useState("");

  // ✅ Local loading states
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const handleSendOtp = async () => {
    const email = getValues("email");
    if (!email) return setLocalError("Please enter an email first");

    setSendingOtp(true);
    setLocalError("");
    try {
      dispatch(signupStart());
      const res = await OtpApi.sendOtp(email);
      console.log("OTP sent:", res.data);
      dispatch(setEmail({ email }));
      setOtpSent(true);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send OTP";
      dispatch(signupFailure(message));
      setLocalError(message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (data) => {
    const { email } = data;
    setVerifyingOtp(true);
    setLocalError("");

    try {
      dispatch(signupStart());
      const res = await OtpApi.verifyOtp({ email, otp: enteredOtp });
      console.log("Verification:", res.data);

      if (res.data?.data?.verified) {
        navigate("/set-password");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid or expired OTP";
      dispatch(signupFailure(message));
      setLocalError(message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <FormContainer
      title="Create Account - Step 2"
      toggle={
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(handleVerifyOtp)}>
        <div className="flex items-end gap-3 mb-4">
          <div className="flex flex-col flex-[0.7]">
            <label className="text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex-[0.3] flex items-end">
            <Button
              type="button"
              text={sendingOtp ? "Sending..." : "Send OTP"}
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="w-full"
            />
          </div>
        </div>

        <InputField
          label="Enter OTP"
          type="text"
          placeholder="Enter 6-digit OTP"
          value={enteredOtp}
          onChange={(e) => setEnteredOtp(e.target.value)}
          className="mt-4"
          required
        />

        {(localError || globalError) && (
          <p className="text-red-500 text-sm mt-2">
            {localError || globalError}
          </p>
        )}

        <Button
          type="submit"
          text={verifyingOtp ? "Verifying..." : "Verify OTP"}
          className="w-full mt-4"
          disabled={verifyingOtp}
        />
      </form>
    </FormContainer>
  );
};

export default SignupStep2;

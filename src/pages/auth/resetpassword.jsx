import React, { useState } from "react";
import FormContainer from "../../components/form-container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginFailure, loginStart } from "../../redux/features/authslice";
import OtpApi from "../../api/otp";
import { CheckCircle } from "lucide-react";
import InputField from "../../components/inputfiled";
import Inputfields from "../profile/channel_customize/inputfields";

function Resetpassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [isLoading, setLoading] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    dispatch(loginStart());
    const email = watch("email");

    if (!email) {
      dispatch(loginFailure("Please enter your email first"));
      return;
    }

    try {
      setLoading(true);
      const res = await OtpApi.sendresetotp(email);
      console.log("✅ OTP sent:", res);
      setOtpSent(true);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      dispatch(loginFailure(message));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const email = watch("email");
    try {
      const res = await OtpApi.verifyresetOtp({ email, otp: enteredOtp });
      console.log("✅ Verification:", res.data);
      setIsOtpVerified(true);

      navigate("/login/newpassword", { state: { email } });
    } catch (error) {
      const message = error.response?.data?.message || "Invalid or expired OTP";
      dispatch(loginFailure(message));
      setIsOtpVerified(false);
    }
  };

  const onSubmit = () => {
    if (!isOtpVerified) {
      alert("Please verify OTP before resetting password");
      return;
    }
  };

  return (
    <FormContainer
      title="Reset Password"
      toggle={
        <p>
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field with OTP Button */}
        <Inputfields
          label="Email"
          register={register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email",
            },
          })}
          showOtpButton={true}
          onSendOtp={handleSendOtp}
          isSendingOtp={isLoading}
          errors={errors}
        />

        {otpSent && (
          <p className="text-green-600 text-sm mt-2">OTP sent successfully!</p>
        )}

        {/* OTP Verification */}
        {otpSent && (
          <div className="flex items-center mt-4">
            <div className="w-1/2">
              <InputField
                label="Enter OTP"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                required
              />
            </div>

            {isOtpVerified ? (
              <CheckCircle className="text-green-500 w-6 h-6 mt-6 ml-2" />
            ) : (
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={!enteredOtp || isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 ml-2 hover:bg-blue-700"
              >
                Verify
              </button>
            )}
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </FormContainer>
  );
}

export default Resetpassword;

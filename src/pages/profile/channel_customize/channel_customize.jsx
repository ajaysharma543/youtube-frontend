import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ImageUploader from "./imageuploader";
import authApi from "../../../api/userapi";
import { CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Inputfields from "./inputfields";
import OtpApi from "../../../api/otp";
import InputField from "../../../components/inputfiled";

function CustomizeChannel() {
  const { data } = useSelector((state) => state.user);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false); // ✅ new state
  const [originalEmail, setOriginalEmail] = useState("");

  const {
    handleSubmit,
    control,
    watch,
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      banner: null,
      avatar: null,
      fullname: "",
      username: "",
      email: "",
      password: "",
      description: "",
    },
  });
  useEffect(() => {
    if (enteredOtp) setServerError(null);
  }, [enteredOtp]);
  useEffect(() => {
    if (data) {
      setValue("fullname", data.fullname || "");
      setValue("username", data.username || "");
      // setValue("email", data.email || "");
      setValue("password", data.password || "");
      setValue("description", data.description || "");
      setOriginalEmail(data.email || "");
    }
  }, [data, setValue]);

  const navigate = useNavigate();

  const [isloading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const banner = watch("banner");
  const avatar = watch("avatar");
  const fullname = watch("fullname");
  const email = watch("email");
  const password = watch("password");
  const oldPassword = watch("oldPassword");
  const newPassword = watch("newPassword");
  const description = watch("description");

  const [otpSent, setOtpSent] = useState(false);
  const nothingChanged =
    !banner &&
    !avatar &&
    fullname === data.fullname &&
    description === (data.description || "") &&
    email === originalEmail &&
    !password &&
    !otpSent;

  const isPublishDisabled = nothingChanged || isloading;

  const handlesendotp = async () => {
    if (!originalEmail) {
      return setServerError("Current email not found.");
    }
    try {
      const res = await OtpApi.sendChangeEmailOtp();
      setOtpSent(true);
      console.log("OTP sent", res);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      setServerError(message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await OtpApi.verifyOtp({
        email: originalEmail,
        otp: enteredOtp,
      });
      setIsOtpVerified(true);
      setServerError(null);
      clearErrors("api");
      console.log("OTP verified:", res.data);
    } catch (error) {
      const message = error.response?.data?.message || "Invalid or expired OTP";
      setServerError(message);
      setIsOtpVerified(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError(null);
      clearErrors();
      if (email !== originalEmail && !isOtpVerified) {
        setServerError(
          "Please verify OTP from your current email before updating to a new one."
        );
        setLoading(false);
        return;
      }
      if (!isOtpVerified && otpSent) {
        setServerError("Please verify your OTP before publishing.");
        setLoading(false);
        return;
      }

      let avatarResponse = null;
      let bannerResponse = null;
      let nameResponse = null;
      let passwordResponse = null;
      let descriptionresponse = null;
      //  Avatar upload
      if (data.avatar) {
        const avatarData = new FormData();
        avatarData.append("avatar", data.avatar);
        avatarResponse = await authApi.changeavatar(avatarData);
      }

      //  Banner upload
      if (data.banner) {
        const bannerData = new FormData();
        bannerData.append("coverImage", data.banner);
        bannerResponse = await authApi.coverimage(bannerData);
      }

      if (data.oldPassword && data.newPassword) {
        const passwordData = new FormData();
        passwordData.append("oldPassword", data.oldPassword);
        passwordData.append("newPassword", data.newPassword);
        passwordResponse = await authApi.changepassword(passwordData);
      }

      if (data.fullname || data.username || (isOtpVerified && data.email)) {
        const accountData = {
          fullname: data.fullname,
          username: data.username,
          email: data.email,
        };
        nameResponse = await authApi.userdetails(accountData);
      }

      if (data.description) {
        const descriptiondata = new FormData();
        descriptiondata.append("description", data.description);
        if (data.description !== undefined) {
          descriptionresponse = await authApi.description({
            description: data.description,
          });
        }
      }

      console.log("✅ Avatar Response:", avatarResponse?.data);
      console.log("✅ Banner Response:", bannerResponse?.data);
      console.log("✅ Name Response:", nameResponse?.data);
      console.log("✅ password Response:", passwordResponse?.data);
      console.log("✅ description Response:", descriptionresponse?.data);

      //  success message or redirect
      navigate("/profile");
    } catch (error) {
      console.error("❌ Upload error:", error);
      const message =
        error.response?.data?.message ||
        "Failed to upload images. Please try again.";
      setServerError(message);
      setError("api", { message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-10 bg-black text-white flex flex-col">
      {/* Header */}
      <div className="h-[30%] flex items-center justify-between px-10 pb-4 border-b border-gray-800">
        <h1 className="text-3xl font-bold">Customize Channel</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-full font-semibold"
          >
            View Your Channel
          </button>
          <button
            type="button"
            className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-full font-semibold"
          >
            Cancel
          </button>

          <button
            form="channelForm"
            type="submit"
            disabled={isPublishDisabled}
            className={`px-5 py-2 rounded-full font-semibold flex items-center justify-center gap-2 transition-all ${
              isPublishDisabled
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 cursor-pointer"
            }`}
          >
            {isloading && <Loader2 className="animate-spin w-5 h-5" />}
            {isloading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <form
        id="channelForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 p-10 flex flex-col gap-10"
      >
        <Controller
          name="banner"
          control={control}
          render={({ field: { onChange, value } }) => (
            <ImageUploader
              title="Banner Image"
              description="This image will appear at the top of your channel page."
              value={value}
              onChange={onChange}
              des="For best results, use an image at least 2048 x 1152 pixels and 6MB or less."
              recommendedSize="2048x1152px"
            />
          )}
        />
        <Controller
          name="avatar"
          control={control}
          render={({ field: { onChange, value } }) => (
            <ImageUploader
              title="Avatar Image"
              description="This image represents your channel profile picture."
              value={value}
              onChange={onChange}
              des="Use a 98 x 98 pixel PNG or GIF (no animations), 4MB or less."
              recommendedSize="800x800px"
            />
          )}
        />

        <Inputfields
          label="Name"
          description="Choose a channel name that represents you and your content. Changes made to your name and picture are visible only on YouTube and not other Google services. You can change your name twice in 14 days."
          register={register("fullname", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          errors={errors}
        />

        <Inputfields
          label="Username"
          description="Choose your unique handle by adding letters and numbers. You can change your handle back within 14 days. Handles can be changed twice every 14 days. "
          register={register("username", {
            required: "Username is required",
          })}
          errors={errors}
        />

        <Inputfields
          label="description"
          description=""
          register={register("description", {
            required: "description is required",
          })}
          errors={errors}
        />

        <Inputfields
          label="email"
          description="you can't directly change the email id first you need to verify yourself"
          register={register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email",
            },
          })}
          showOtpButton={true}
          onSendOtp={handlesendotp}
          isSendingOtp={isloading}
          errors={errors}
        />
        {serverError && (
          <p className="text-red-500 text-sm font-medium mt-4">{serverError}</p>
        )}
        {errors.api && (
          <p className="text-red-500 text-sm font-medium">
            {errors.api.message}
          </p>
        )}
        {otpSent && (
          <p className="text-green-600 text-sm ">OTP sent successfully!</p>
        )}
        <div className="flex items-center">
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
                  onClick={handleVerifyOtp}
                  disabled={!enteredOtp}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 ml-2 hover:bg-blue-700"
                >
                  Verify
                </button>
              )}
            </div>
          )}
        </div>
        <Inputfields
          label="Current Password"
          description="Enter your current password"
          register={register("oldPassword", {
            validate: (value) => {
              if (newPassword && !value) return "Enter your current password";
              return true;
            },
          })}
          errors={errors}
        />

        <Inputfields
          label="New Password"
          description="Enter a new password"
          register={register("newPassword", {
            validate: (value) => {
              if (oldPassword && !value) return "Enter a new password";
              if (value && value.length < 8)
                return "Password must be at least 8 characters";
              return true;
            },
          })}
          errors={errors}
        />
      </form>
    </div>
  );
}

export default CustomizeChannel;

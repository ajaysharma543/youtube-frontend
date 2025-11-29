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
  const [originalEmail, setOriginalEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [emailStepCompleted, setEmailStepCompleted] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);

  const verifyEmail = async () => {
    try {
      const res = await authApi.checkEmail({ email: tempEmail });

      if (res.data.success) {
        setEmailVerified(true);
        setValue("email", "");
      }
    } catch (err) {
      setError("email", {
        message: err.response?.data?.message || "Email not found",
      });
    }
  };

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
    if (data) {
      setValue("fullname", data.fullname || "");
      setValue("username", data.username || "");
      // setValue("email", data.email || "");
      setValue("email", ""); // new email box empty
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
  const username = watch("username");
  // const email = watch("email");
  const password = watch("password");
  const oldPassword = watch("oldPassword");
  const newPassword = watch("newPassword");
  const description = watch("description");

  const nothingChanged =
    !banner &&
    !avatar &&
    fullname === (data?.fullname || "") &&
    username === (data?.username || "") &&
    description === (data?.description || "") &&
    !emailChanged && // ✅ email changed only when user edited it
    !password;

  const isPublishDisabled = nothingChanged || isloading;

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError(null);
      clearErrors();

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

      if (emailChanged) {
        // email is changed → only then send email update API
        nameResponse = await authApi.userdetails({
          fullname: data.fullname,
          username: data.username,
          email: data.email,
        });
      } else {
        // email unchanged → don't send email
        nameResponse = await authApi.userdetails({
          fullname: data.fullname,
          username: data.username,
        });
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
    <div className="min-h-screen mt-10 bg-black  text-white flex flex-col">
      <div className="h-[30%] max-[640px]:flex-col max-[640px]:text-md max-[640px]:items-center max-[640px]:justify-start flex items-center justify-between px-10 pb-4 border-b border-gray-800">
        <h1 className="text-3xl max-[640px]:text-md max-[640px]:pb-5 font-bold">Customize Channel</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="bg-gray-800 hover:bg-gray-700 px-5 py-2 max-[640px]:px-3 max-[640px]:py-1 rounded-full font-semibold"
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
        className="flex-1 p-10 max-[640px]:p-3 max-[640px]:pb-20 flex flex-col gap-10"
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
          register={register("description")}
          errors={errors}
        />
        <button
          type="button"
          onClick={() => setShowEmailChange(true)}
          className="text-blue-500 underline"
        >
          Change Email
        </button>
        {showEmailChange && (
          <>
            {!emailVerified && !emailStepCompleted && (
              <div>
                <Inputfields
                  label="Enter Current Email"
                  register={register("currentEmail", {
                    required: "Email is required",
                    onChange: (e) => setTempEmail(e.target.value),
                  })}
                  errors={errors}
                />

                <button
                  type="button"
                  onClick={verifyEmail}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Verify Email
                </button>
              </div>
            )}

            {emailVerified && !emailStepCompleted && (
              <div>
                <Inputfields
                  label="New Email"
                  register={register("email", {
                    required: "New email is required",
                    onChange: (e) => {
                      if (e.target.value !== originalEmail)
                        setEmailChanged(true);
                      else setEmailChanged(false);
                    },
                  })}
                  errors={errors}
                />

                <button
                  type="button"
                  onClick={() => {
                    setEmailVerified(false);
                    setEmailStepCompleted(true);
                    // setEmailChanged(false);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  OK
                </button>
              </div>
            )}

            {emailStepCompleted && (
              <div>
                <Inputfields
                  label="Email"
                  register={register("email", {
                    onChange: () => setEmailChanged(true),
                  })}
                  errors={errors}
                />

                {emailChanged && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmailStepCompleted(false);
                      setEmailVerified(false);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                  >
                    Verify Again
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex items-center"></div>
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

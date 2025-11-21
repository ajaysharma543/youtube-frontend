import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetSignup } from "../../redux/features/singupslice";
import {
  signupStart,
  signupFailure,
  signupSuccess,
} from "../../redux/features/authslice";
import FormContainer from "../../components/form-container";
import InputField from "../../components/inputfiled";
import Button from "../../components/button";
import authApi from "../../api/userapi.jsx";

const SignupStep2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fullname, username, avatar, coverImage } = useSelector(
    (state) => state.signup
  );

  const { loading, error: globalError } = useSelector((state) => state.auth);

  const [localError, setLocalError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    dispatch(signupFailure(null));
  }, [dispatch]);

 

const onSubmit = async (data) => {
  dispatch(signupStart());
  setLocalError("");

  try {
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await authApi.signup(formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/");

    dispatch(
      signupSuccess({
        user: response.data.data.user,
        token: response.data.data.accesstoken,
      })
    );

    dispatch(resetSignup());
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(signupFailure(message));
    setLocalError(message);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">Email</label>
          <InputField
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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

        {/* Password */}
        <div className="mb-4">
          <InputField
            label="Password"
            type="password"
            placeholder="Enter Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              validate: (value) =>
                value === getValues("password") ||
                "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Button */}
        <Button
          type="submit"
          text={loading || isSubmitting ? "Creating Account..." : "Sign Up"}
          loading={loading || isSubmitting}
          disabled={loading || isSubmitting}
        />

        {/* Error message */}
        {(localError || globalError) && (
          <p className="text-red-500 text-sm mt-3">
            {localError || globalError}
          </p>
        )}
      </form>
      {loading && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center">
    <div className="text-white text-xl">Creating Account...</div>
  </div>
)}
    </FormContainer>
  );
};

export default SignupStep2;

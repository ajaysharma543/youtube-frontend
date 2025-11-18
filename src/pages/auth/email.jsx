import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { resetSignup, setCredentials } from "../../redux/features/singupslice";
import authApi from "../../api/userapi";
import FormContainer from "../../components/form-container";
import InputField from "../../components/inputfiled";
import Button from "../../components/button";
import {
  signupFailure,
  signupStart,
  signupSuccess,
} from "../../redux/features/authslice";

const SignupStep2 = () => {
  const { fullname, username, avatar, coverImage } = useSelector(
    (state) => state.signup
  );
  const { loading, error } = useSelector((state) => state.auth); // 👈 from Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    dispatch(signupStart());

    try {
      dispatch(setCredentials(data));

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

      dispatch(
        signupSuccess({
          user: response.data.data.user,
          token: response.data.data.accesstoken,
        })
      );
      dispatch(resetSignup());
      console.log(response);

      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch(signupFailure(message));
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
        {/* Email Field */}
        <InputField
          label="Email"
          type="email"
          placeholder="Enter Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm -mt-8px mb-2">
            {errors.email.message}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          text={loading || isSubmitting ? "Creating Account..." : "Sign Up"}
          loading={loading || isSubmitting}
          disabled={loading || isSubmitting}
        />
      </form>
    </FormContainer>
  );
};

export default SignupStep2;

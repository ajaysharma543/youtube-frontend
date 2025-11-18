import React, { useState, useEffect } from "react";
import FormContainer from "../../components/form-container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  signupFailure,
  signupStart,
  signupSuccess,
} from "../../redux/features/authslice";
import { resetSignup, setPassword } from "../../redux/features/singupslice";
import InputField from "../../components/inputfiled";
import Button from "../../components/button";
import authApi from "../../api/userapi";

function Password() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error: globalError } = useSelector((state) => state.auth);
  const { fullname, username, avatar, coverImage, email } = useSelector(
    (state) => state.signup
  );

  const [localError, setLocalError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    dispatch(signupFailure(null)); // clear error
  }, [dispatch]);

  const onSubmit = async (data) => {
    dispatch(signupStart());
    setLocalError("");

    try {
      dispatch(setPassword({ password: data.password }));

      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("username", username);
      formData.append("avatar", avatar);
      if (coverImage) formData.append("coverImage", coverImage);
      formData.append("email", email);
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
      console.log(response);

      dispatch(resetSignup());
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch(signupFailure(message));
      setLocalError(message);
    }
  };

  return (
    <FormContainer
      title="Create Account - Step 3"
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
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        <InputField
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">
            {errors.confirmPassword.message}
          </p>
        )}

        <Button
          type="submit"
          text={loading || isSubmitting ? "Creating Account..." : "Sign Up"}
          loading={loading || isSubmitting}
          disabled={loading || isSubmitting}
        />

        {(localError || globalError) && (
          <p className="text-red-500 text-sm mt-2">
            {localError || globalError}
          </p>
        )}
      </form>
    </FormContainer>
  );
}

export default Password;

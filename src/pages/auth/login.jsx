import React from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import FormContainer from "../../components/form-container";
import InputField from "../../components/inputfiled";
import authApi from "../../api/userapi";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../redux/features/authslice";
import { resetSignup } from "../../redux/features/singupslice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    dispatch(loginStart());

    try {
      const response = await authApi.login(data);
      // console.log("✅ User logged in:", response.data);

      const current = await authApi.getcurrentuser();
      navigate("/");

      if (current) {
        dispatch(
          loginSuccess({
            user: response.data.data.user,
            token: response.data.data.accesstoken,
          })
        );
        dispatch(resetSignup());
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password. Please try again.";
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <>
      <FormContainer
        title="Login Account"
        toggle={
          <p>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <InputField
            label="Email"
            type="email"
            placeholder="Enter Email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <InputField
            label="Password"
            type="password"
            placeholder="Enter Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <Link to="resetpassword">
            {" "}
            <span className="text-white">Forget Password</span>
          </Link>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <Button
            type="submit"
            text="Login"
            loading={loading}
            disabled={loading}
          />
        </form>
      </FormContainer>
    </>
  );
}

export default Login;

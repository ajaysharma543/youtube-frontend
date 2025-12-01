import React from "react";
import FormContainer from "../../components/form-container";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart } from "../../redux/features/authslice";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/userapi";
import InputField from "../../components/inputfiled";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async ({ email }) => {
    dispatch(loginStart());

    try {
      const res = await authApi.checkEmail({ email });
      // console.log(res.data);

      navigate("/login/newpassword", { state: { email } });
    } catch (error) {
      const msg = error.response?.data?.message || "User not found";
      dispatch(loginFailure(msg));
    }
  };

  return (
    <FormContainer title="Reset Password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="text-white">Email</label>
        <InputField
          type="email"
          {...register("email", { required: "Email is required" })}
          className="border w-full p-2 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Verify Email
        </button>
      </form>
    </FormContainer>
  );
}

export default ResetPassword;

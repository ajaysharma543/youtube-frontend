import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormContainer from "../../components/form-container";
import InputField from "../../components/inputfiled";
import Button from "../../components/button";
import authApi from "../../api/userapi";
import { loginFailure } from "../../redux/features/authslice";
import { useDispatch } from "react-redux";

function NewPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = state?.email;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(loginFailure(null)); // clears error and sets loading = false
  }, [dispatch]);
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authApi.resetPassword({ email, newPassword: data.newPassword });
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Set New Password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="New Password"
          type="password"
          placeholder="Enter new password"
          {...register("newPassword", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}

        <Button text="Update Password" type="submit" loading={loading} />
      </form>
    </FormContainer>
  );
}

export default NewPassword;

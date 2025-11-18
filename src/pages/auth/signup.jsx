import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { setBasicInfo } from "../../redux/features/singupslice";
import InputField from "../../components/inputfiled";
import FileUpload from "../../components/Fileupload";
import Button from "../../components/button";
import FormContainer from "../../components/form-container";

function SignupStep1() {
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ Handle file upload normally
  const handleFileChange = (e) => {
    if (e.target.name === "avatar") setAvatar(e.target.files[0]);
    if (e.target.name === "coverImage") setCoverImage(e.target.files[0]);
  };

  // ✅ Submit handler
  const onSubmit = async (data) => {
    if (!avatar) {
      alert("Please upload an avatar!");
      return;
    }

    setLoading(true);
    try {
      dispatch(setBasicInfo({ ...data, avatar, coverImage }));

      navigate("/signup-email");
    } catch (error) {
      console.error("❌ Signup step 1 error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer
      title="Create Account"
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
        <div className="flex justify-around">
          <FileUpload
            label="Avatar"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
          />
          <FileUpload
            label="Cover Image"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <InputField
          label="Full Name"
          type="text"
          placeholder="Enter Name"
          {...register("fullname", { required: "Full name is required" })}
        />
        {errors.fullname && (
          <p className="text-red-500 text-sm">{errors.fullname.message}</p>
        )}

        {/* ✅ Username field */}
        <InputField
          label="Username"
          type="text"
          placeholder="Enter Username"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}

        {/* ✅ File upload fields */}

        {/* ✅ Button with loading state */}
        <Button
          type="submit"
          text={loading ? "Loading..." : "Next"}
          disabled={loading}
        />
      </form>
    </FormContainer>
  );
}

export default SignupStep1;

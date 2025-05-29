import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  uploadUserStart,
  uploadUserSuccess,
  uploadUserFailuer,
  deleteUserStart,
  deleteUserFailuer,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailuer,
  signOutUserSuccess,
} from "../app/user/userSlice";
import { showPopup } from "../app/popup/popupSlice";
import UserInputs from "../components/UserInputs";
import { Icon } from "@iconify/react";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, isLoading } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    username: currentUser?.user?.username || "",
    email: currentUser?.user?.email || "",
    avatar: currentUser?.user?.avatar || "",
    password: "",
    confirmpassword: "",
  });

  const [filePerc, setFilePerc] = useState(0);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });

    try {
      const base64Image = await toBase64(file);
      const imageUrl = await uploadImageToCloudinary(base64Image);
      dispatch(
        showPopup({ message: "Image successfully uploaded", type: "success" }),
      );
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    } catch (error) {
      dispatch(showPopup({ message: "Image upload failed", type: "error" }));
      console.error("Image upload failed:", error);
    }
  };

  const uploadImageToCloudinary = (base64Image) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append("file", base64Image);
      data.append("upload_preset", "Market_Place");

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        "https://api.cloudinary.com/v1_1/dxecfdwzc/image/upload",
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setFilePerc(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (formData.password || formData.confirmpassword) &&
      formData.password !== formData.confirmpassword
    ) {
      dispatch(showPopup({ message: "Passwords do not match", type: "error" }));
      return;
    }

    dispatch(uploadUserStart());

    try {
      const response = await fetch("/api/user/updateUser", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch(uploadUserFailuer(data.msg));
        dispatch(showPopup({ message: data.msg, type: "error" }));
        return;
      }

      dispatch(uploadUserSuccess(data));
      dispatch(
        showPopup({
          message: data.msg || "Profile updated successfully!",
          type: "success",
        }),
      );
    } catch (error) {
      dispatch(uploadUserFailuer(error.message));
      dispatch(showPopup({ message: error.message, type: "error" }));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch("/api/user/deleteUser", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailuer(data.message));
        dispatch(showPopup({ message: data.message, type: "error" }));
        return;
      }

      dispatch(deleteUserSuccess());
      navigate("/signin");
    } catch (error) {
      dispatch(deleteUserFailuer(error.message));
      dispatch(showPopup({ message: error.message, type: "error" }));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/logout", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailuer(data.message));
        dispatch(showPopup({ message: data.message, type: "error" }));
        return;
      }

      dispatch(signOutUserSuccess());
      navigate("/signin");
    } catch (error) {
      dispatch(signOutUserFailuer(error.message));
      dispatch(showPopup({ message: error.message, type: "error" }));
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-3 select-none">
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="mt-2 text-3xl font-semibold">Profile</h1>
          <p className="mb-4 text-sm font-light text-slate-700">
            View, Edit or Delete Your Profile
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={handleSignOut}
            className="md:text-md flex cursor-pointer items-center rounded-md bg-slate-200 p-2 text-sm font-light text-slate-700 hover:opacity-80"
          >
            <Icon
              icon="bx:log-out"
              className="mr-1 h-3 w-3 text-slate-700 md:h-5 md:w-5"
            />{" "}
            Sign out
          </button>
          <button
            onClick={handleDeleteUser}
            className="md:text-md flex cursor-pointer items-center rounded-md bg-slate-200 p-2 text-sm font-light text-red-500 hover:opacity-80"
          >
            <Icon
              icon="bx:trash"
              className="mr-1 h-3 w-3 text-red-500 md:h-5 md:w-5"
            />{" "}
            Delete account
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h2 className="text-slate-600">Personal Information</h2>
        <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-200 p-4 backdrop-blur-sm backdrop-filter">
          <div className="flex w-1/2 flex-col items-center">
            <div className="group relative w-fit self-center">
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
              <img
                src={formData.avatar}
                alt="profile"
                onClick={() => fileRef.current.click()}
                className="h-24 w-24 cursor-pointer rounded-full object-cover"
              />
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Icon icon="bx:pencil" className="h-7 w-7 text-white" />
              </button>
            </div>
            <p className="mt-1 text-center text-sm font-light text-slate-700">
              Avatar
            </p>
            {filePerc > 0 && filePerc < 100 && (
              <div className="relative mt-2 h-2 w-30 rounded-2xl bg-slate-500">
                <div
                  className="absolute h-2 rounded-2xl bg-green-700"
                  style={{
                    width: `${filePerc}%`,
                    transition: "width 0.3s ease",
                  }}
                ></div>
              </div>
            )}
          </div>

          <div className="flex w-1/2 flex-col gap-3">
            <div>
              <p className="mb-0.5 ml-1 text-sm font-light text-slate-700">
                Username
              </p>
              <UserInputs
                type="text"
                placeholder="Username"
                id="username"
                defaultVal={formData.username}
                formData={formData}
                setFormData={setFormData}
              />
            </div>
            <div>
              <p className="mb-0.5 ml-1 text-sm font-light text-slate-700">
                Email
              </p>
              <UserInputs
                type="text"
                placeholder="Email"
                id="email"
                defaultVal={formData.email}
                read
              />
            </div>
          </div>
        </div>

        <h2 className="mb-2 text-slate-600">Password</h2>
        <div className="mb-4 flex items-center rounded-lg bg-slate-200 p-4 backdrop-blur-sm backdrop-filter">
          <div className="flex w-full gap-3">
            <div className="w-1/2">
              <p className="mb-0.5 ml-1 text-sm font-light text-slate-700">
                Password
              </p>
              <UserInputs
                type="password"
                placeholder="Password"
                id="password"
                formData={formData}
                setFormData={setFormData}
                notRequired
              />
            </div>
            <div className="w-1/2">
              <p className="mb-0.5 ml-1 text-sm font-light text-slate-700">
                Confirm Password
              </p>
              <UserInputs
                type="password"
                placeholder="Confirm Password"
                id="confirmpassword"
                formData={formData}
                setFormData={setFormData}
                notRequired
              />
            </div>
          </div>
        </div>

        <button
          disabled={isLoading}
          className="w-29 cursor-pointer rounded-lg bg-slate-800 p-3 text-white uppercase hover:opacity-80 disabled:opacity-80"
        >
          {isLoading ? (
            <svg
              aria-hidden="true"
              role="status"
              className="inline h-4 w-4 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            "update"
          )}
        </button>
      </form>
    </div>
  );
}

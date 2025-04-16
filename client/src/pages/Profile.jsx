import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
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
import { useDispatch } from "react-redux";

// compoentes
import UserInputs from "../components/UserInputs";
// assets
import avatar from "../assets/imgs/profile_avatar.png";

export default function Profile() {
  const { currentUser, isLoading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);

  const [filePerc, setFilePerc] = useState(0);
  const [fileUplaodError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      hanldeFileUplaod(file);
    }
  }, [file]);

  const hanldeFileUplaod = (file) => {
    // with firebase
    // //////////////
    // const storage = getStorage(app);
    // const fileName = new Date().getTime() + file.name;
    // const storageRef = ref(storage, fileName);
    // const upladTask = uploadBytesResumable(storageRef, file);

    // upladTask.on("state_changed", (snapshot) => {
    //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //   setFilePerc(Math.round(progress));
    // });
    // (error) => {
    //   setFileUploadError(true);
    // };
    // () => {
    //   getDownloadURL(upladTask.snapshot.ref).then((downloadURL) => {
    //     setFormData({ ...formData, avatar: downloadURL });
    //   });
    // };
    // //////////
    // with Cloudinary
    // /////////
    const url = "https://api.cloudinary.com/v1_1/dvw08g3fg/image/upload";
    const preset = "market_palce";
    const formDataCloudinary = new FormData();
    formDataCloudinary.append("file", file);
    formDataCloudinary.append("upload_preset", preset);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setFilePerc(Math.round(progress));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setFormData((prev) => ({ ...prev, avatar: res.secure_url }));
        } else {
          setFileUploadError(true);
        }
      };

      xhr.onerror = () => setFileUploadError(true);
      xhr.send(formDataCloudinary);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setFileUploadError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(uploadUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(uploadUserFailuer(data.message));
        return;
      }
      dispatch(uploadUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(uploadUserFailuer(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart);
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(deleteUserFailuer(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailuer(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutUserFailuer(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailuer(error.message));
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3 select-none">
      <h1 className="my-7 text-center text-3xl font-semibold">profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={currentUser ? currentUser.avatar : avatar}
          alt="profile"
          onClick={() => fileRef.current.click()}
          className="h-24 w-24 cursor-pointer self-center rounded-full object-cover"
        />
        <div className="self-center text-sm">
          {fileUplaodError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <div className={`relative -z-10 h-2 w-30 rounded-2xl bg-slate-500`}>
              <div
                className="absolute h-2 rounded-2xl bg-green-700"
                style={{
                  width: `${filePerc}%`,
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Successfuly Uploaded</span>
          ) : (
            " "
          )}
        </div>
        <UserInputs
          type="text"
          placeholder={"username"}
          id={"username"}
          defaultVal={currentUser?.username ? currentUser.username : ""}
          formData={formData}
          setFormData={setFormData}
        />
        <UserInputs
          type="text"
          placeholder={"email"}
          id={"email"}
          defaultVal={currentUser?.email ? currentUser.email : ""}
          formData={formData}
          setFormData={setFormData}
        />
        <UserInputs
          type="password"
          placeholder={"password"}
          id={"password"}
          default={""}
          formData={formData}
          setFormData={setFormData}
        />
        <UserInputs
          type="password"
          placeholder={"confirmpassword"}
          id={"confirmpassword"}
          formData={formData}
          setFormData={setFormData}
        />
        <button
          disabled={isLoading}
          className="cursor-pointer rounded-lg bg-slate-800 p-3 text-white uppercase hover:opacity-80 disabled:opacity-80"
        >
          {isLoading ? (
            <svg
              aria-hidden="true"
              role="status"
              className="me-3 inline h-4 w-4 animate-spin text-white"
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
        <Link to="/create-listing">
          <button className="w-full rounded-lg bg-green-700 p-3 text-white capitalize hover:opacity-80">
            create listing
          </button>
        </Link>
      </form>
      <div className="mt-5 flex justify-between">
        <span
          onClick={handleDeleteUser}
          className="cursor-pointer text-red-700 capitalize"
        >
          delete account
        </span>
        <span
          onClick={handleSignOut}
          className="cursor-pointer text-red-700 capitalize"
        >
          sign out
        </span>
      </div>
      <p className="mt-5 text-sm text-green-700">
        {updateSuccess && "User Is Updated Successfuly "}
      </p>
      <p className="mt-5 text-sm text-red-700">{error ? error : ""}</p>
    </div>
  );
}

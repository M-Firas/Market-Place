import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef } from "react";
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
import { showPopup } from "../app/popup/popupSlice";
// compoentes
import UserInputs from "../components/UserInputs";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, isLoading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    username: currentUser?.user?.username,
    email: currentUser?.user?.email,
    avatar: currentUser?.user?.avatar,
  });

  const [imageFile, setImageFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUplaodError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const hanldeFileUplaod = async (e) => {
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
      setImageFile(imageUrl);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    } catch (error) {
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
    try {
      dispatch(uploadUserStart());

      const response = await fetch(
        "https://market-place-jj5i.onrender.com/api/user/updateUser",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // dispatch(uploadUserFailuer(data.msg));
        dispatch(showPopup({ message: data.msg, type: "error" }));
        return;
      }
      dispatch(uploadUserSuccess(data));
      dispatch(
        showPopup({ message: "info updated successfully", type: "success" }),
      ),
        setUpdateSuccess(true);
    } catch (error) {
      // console.error("Submission error:", error);
      // dispatch(uploadUserFailuer(error.message));
      dispatch(showPopup({ message: error.message, type: "error" }));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart);
      const res = await fetch(
        `https://market-place-jj5i.onrender.com/api/user/deleteUser`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = res.json();
      if (data.success === false) {
        dispatch(deleteUserFailuer(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/signin");
    } catch (error) {
      // dispatch(deleteUserFailuer(error.message));
      dispatch(showPopup({ message: error.message, type: "error" }));
      // console.log(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(
        "https://market-place-jj5i.onrender.com/api/auth/login",
      );
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutUserFailuer(data.message));
        dispatch(showPopup({ message: data.mesg, type: "error" }));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      // dispatch(signOutUserFailuer(error.message));
      dispatch(showPopup({ message: error.message, type: "error" }));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(
        `https://market-place-jj5i.onrender.com/api/listing/my-listings`,
        {
          credentials: "include",
        },
      );
      console.log(res);

      if (!res.ok) {
        // throw new Error("Failed to fetch listing");
        dispatch(showPopup({ message: res.msg, type: "error" }));
      }

      const data = await res.json();
      setUserListing(data.listings);
      dispatch(
        showPopup({
          message: "Listing uploaded successfully",
          type: "success",
        }),
      );
    } catch (error) {
      setShowListingError(true);
      dispatch(showPopup({ message: error.message, type: "error" }));
    }
  };

  const handleDeleteListing = async (listId) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `https://market-place-jj5i.onrender.com/api/listing/delete/${listId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok === false) {
        setDeleteLoading(false);
        console.log(res.msg);
        dispatch(showPopup({ message: res.msg, type: "error" }));
        return;
      }
      dispatch(
        showPopup({ message: "Listing deleted successfully", type: "success" }),
      );
      setDeleteLoading(false);

      setTimeout(() => {
        handleShowListing();
      }, 3500);
    } catch (error) {
      setDeleteLoading(false);
      dispatch(showPopup({ message: error.message, type: "error" }));
      console.log(error);
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
          onChange={hanldeFileUplaod}
        />
        <img
          src={imageFile ? imageFile : currentUser?.user?.avatar}
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
          defaultVal={
            currentUser?.user?.username ? currentUser?.user?.username : ""
          }
          formData={formData}
          setFormData={setFormData}
        />
        <UserInputs
          type="text"
          placeholder={"email"}
          id={"email"}
          defaultVal={currentUser?.user?.email ? currentUser?.user?.email : ""}
          read
        />
        <UserInputs
          type="password"
          placeholder={"password"}
          id={"password"}
          default={""}
          formData={formData}
          setFormData={setFormData}
          notRequired
        />
        <UserInputs
          type="password"
          placeholder={"confirmpassword"}
          id={"confirmpassword"}
          formData={formData}
          setFormData={setFormData}
          notRequired
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
          <button className="w-full cursor-pointer rounded-lg bg-green-700 p-3 text-white capitalize hover:opacity-80">
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
      <button
        onClick={handleShowListing}
        className="w-full cursor-pointer text-green-700"
      >
        Show Listing
      </button>
      {showListingError && (
        <p className="mt-5 text-red-700">Error Showing Listing</p>
      )}
      {deleteLoading ? (
        <p>List Is Updating...</p>
      ) : (
        userListing.length > 0 && (
          <div className="flex flex-col-reverse">
            {userListing.map((list, index) => (
              <div
                key={index}
                className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-[#ddd] p-3"
              >
                <Link to={`/listing/${list._id}`}>
                  <img
                    src={list.imageUrls[0]}
                    className="h-20 w-20 object-contain"
                  />
                </Link>
                <Link
                  to={`/listing/${list._id}`}
                  className="flex-1 truncate font-semibold text-slate-700 hover:opacity-80"
                >
                  <p>{list.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleDeleteListing(list._id)}
                    className="cursor-pointer text-red-700 uppercase"
                  >
                    Delelte
                  </button>
                  <Link to={`/update-lsiting/${list._id}`}>
                    <button className="cursor-pointer text-green-700 uppercase">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

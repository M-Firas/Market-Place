import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

// compoentes
import UserInputs from "../components/UserInputs";
// assets
import avatar from "../assets/imgs/profile_avatar.png";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);

  const [filePerc, setFilePerc] = useState(0);
  const [fileUplaodError, setFileUploadError] = useState(false);

  const [formData, setFormData] = useState({});

  console.log(file);

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

  return (
    <div className="mx-auto max-w-lg p-3 select-none">
      <h1 className="my-7 text-center text-3xl font-semibold">profile</h1>
      <form className="flex flex-col gap-4">
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
        <UserInputs type="text" placeholder={"username"} id={"username"} />
        <UserInputs type="text" placeholder={"email"} id={"email"} />
        <UserInputs type="password" placeholder={"password"} id={"password"} />
        <button className="cursor-pointer rounded-xl bg-slate-800 p-3 text-white uppercase hover:opacity-80 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="mt-5 flex justify-between">
        <span className="cursor-pointer text-red-700 capitalize">
          delete account
        </span>
        <span className="cursor-pointer text-red-700 capitalize">sign out</span>
      </div>
    </div>
  );
}

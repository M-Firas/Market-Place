import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showPopup } from "../app/popup/popupSlice";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import ImagesUploaded from "../components/ImagesUploaded";

export default function UpdateListing() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const [currentListData, setCurrentListData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: true,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageLoadingError, setPageLoadingError] = useState(false);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const imagesId = useMemo(() => images.map((image) => image.id), [images]);

  const [editMode, setEditMode] = useState(false);
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(
    touchSensor,
    useSensor(
      PointerSensor,
      // we have a delete button and the drag we put it from the whole title so when click on the button dosen't work
      // so I put a rule the frag doesn't work untit you drag to 10px and that make the button work as a click event
      { activationConstraint: { distance: 10 } },
    ),
  );

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleImagesFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (formData.imageUrls.length + selectedFiles.length > 6) {
      return setImageUploadError("You can only upload up to 6 images");
    }

    setImageUploadError(false);
    setIsLoading(true);

    const urls = [...images];

    for (let i = 0; i < selectedFiles.length; i++) {
      const currentFile = selectedFiles[i];

      const reader = new FileReader();
      reader.readAsDataURL(currentFile);

      const base64 = await new Promise((reslove) => {
        reader.onloadend = () => reslove(reader.result);
      });

      try {
        const imageUrl = await uploadImageToCloudinary(base64);
        urls.push({
          url: imageUrl,
          id: i + 1,
        });
      } catch (error) {
        console.error(`Image ${file.name} upload failed:`, error);
        setImageUploadError(`Image ${currentFile.name} upload failed`);
      }
    }
    setImages(urls);
    setFormData((prev) => ({
      ...prev,
      imageUrls: urls.map((iamgeUrl) => iamgeUrl.url),
    }));
    setIsLoading(false);
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
      if (formData.imageUrls.length < 1) {
        return setError("You Must Upload At Least One Image");
      }
      if (formData.regularPrice < formData.discountPrice) {
        return setError("Discount Price Must Be Lower Than Regular Price");
      }
      setIsLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      console.log(res);
      const data = await res.json();
      setIsLoading(false);

      if (data.success === false) {
        setError(data.message);
      }

      dispatch(
        showPopup({
          message: "Listing Updated successfully",
          type: "success",
        }),
      );
      setTimeout(() => {
        navigate(`/account`);
      }, 3500);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (urlToDelete) => {
    console.log(urlToDelete);
    const updateFormdUrls = formData.imageUrls.filter(
      (url) => url !== urlToDelete,
    );
    setFormData((prev) => ({ ...prev, imageUrls: updateFormdUrls }));
    const updateImagesUrls = images.filter(
      (image) => image.url !== urlToDelete,
    );
    setImages(updateImagesUrls);
  };

  const onDragStart = (event) => {
    setEditMode(true);
    if (event.active.data.current?.type === "image") {
      setActiveImage(event.active.data.current.image);
      return;
    }
  };

  const onDragEnd = (event) => {
    setEditMode(false);
    setActiveImage(null);
    const { active, over } = event;
    if (!over) return;

    const activeImageId = active.id;
    const overImageId = over.id;

    if (activeImageId === overImageId) return;

    setImages((image) => {
      const activeImageIndex = images.findIndex(
        (image) => image.id === activeImageId,
      );

      const overImageIndex = images.findIndex(
        (image) => image.id === overImageId,
      );
      const updated = arrayMove(image, activeImageIndex, overImageIndex);

      setFormData((prev) => {
        const newFormData = {
          ...prev,
          imageUrls: updated.map((image) => image.url),
        };
        return newFormData;
      });

      return updated;
    });
  };

  const CheckBox = ({ label, id }) => (
    <div className="flex gap-2">
      <input
        type="checkbox"
        id={id}
        className="w-5 cursor-pointer"
        onChange={handleChange}
        checked={formData[id] || formData.type === id}
      />
      <label htmlFor={id} className="cursor-pointer">
        <p>{label}</p>
      </label>
    </div>
  );

  useEffect(() => {
    const fetchCurrentListing = async () => {
      setPageLoading(true);
      try {
        const res = await fetch(
          `/api/listing/getSingleListing/${params.listingId}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        setCurrentListData(data.listing);
        setPageLoading(false);
      } catch (error) {
        setPageLoadingError(error.message);
        setPageLoading(false);
      }
    };
    fetchCurrentListing();
  }, []);

  useEffect(() => {
    if (currentListData && Object.keys(currentListData).length > 0) {
      setFormData({
        imageUrls: currentListData.imageUrls,
        name: currentListData.name,
        description: currentListData.description,
        address: currentListData.address,
        type: currentListData.type,
        bedrooms: currentListData.bedrooms,
        bathrooms: currentListData.bathrooms,
        regularPrice: currentListData.regularPrice,
        discountPrice: currentListData.discountPrice || 0,
        offer: currentListData.offer,
        parking: currentListData.parking,
        furnished: currentListData.furnished,
      });
      const imagesWithId = currentListData.imageUrls.map((url, index) => ({
        id: index, // استخدم أي دالة لتوليد ID، أو uuid
        url,
      }));

      setImages(imagesWithId);
    }
  }, [currentListData]);

  const InfoBox = ({ label, id }) => (
    <div className="flex items-center gap-2">
      <input
        type="number"
        id={id}
        required
        onChange={handleChange}
        value={formData[id]}
        className={` ${(id === "regularPrice" || id === "discountPrice") && "w-40"} rounded-lg border border-gray-300 bg-white p-3 focus:outline-gray-300`}
      />
      <div>
        <p>{label}</p>
        {(id === "regularPrice" || id === "discountPrice") && (
          <p className="text-sm">( $/month )</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {pageLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Cant Fetch Data</p>
      ) : (
        <main className="mx-auto max-w-4xl p-3">
          <h1 className="my-7 text-center text-3xl font-semibold">
            Update A Listing
          </h1>
          <form
            onSubmit={handleSubmit}
            className={"flex flex-col gap-4 sm:flex-row"}
          >
            <div className="flex flex-1 flex-col gap-4 p-2">
              <input
                type="text"
                placeholder="Name"
                id="name"
                maxLength={"62"}
                required
                onChange={handleChange}
                value={formData.name}
                className="rounded-lg bg-white p-3 outline-none focus:border-none"
              />
              <textarea
                type="text"
                placeholder="Description"
                id="description"
                required
                onChange={handleChange}
                value={formData.description}
                className="resize-none rounded-lg bg-white p-3 outline-none focus:border-none"
              />
              <input
                type="text"
                placeholder="Address"
                id="address"
                required
                onChange={handleChange}
                value={formData.address}
                className="rounded-lg bg-white p-3 outline-none focus:border-none"
              />
              <div className="mt-2 flex flex-wrap gap-8">
                <CheckBox label={"Sell"} id={"sale"} />
                <CheckBox label={"Rent"} id={"rent"} />
                <CheckBox label={"Parking Spot"} id={"parking"} />
                <CheckBox label={"Furnished"} id={"furnished"} />
                <CheckBox label={"Offer"} id={"offer"} />
              </div>
              <div className="flex flex-wrap gap-6">
                <InfoBox label={"Beds"} id={"bedrooms"} />
                <InfoBox label={"Baths"} id={"bathrooms"} />
                <InfoBox label={"Regular Price"} id={"regularPrice"} />
                {formData.offer && (
                  <InfoBox label={"Discount Price"} id={"discountPrice"} />
                )}
              </div>
            </div>
            <DndContext
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              sensors={sensors}
            >
              <div className="flex flex-1 flex-col gap-4">
                <p className="font-semibold">Images:</p>
                <span className="ml-2 font-normal text-gray-600">
                  The first image will be the cover (max6)
                </span>
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    id="images"
                    multiple
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="w-full cursor-pointer rounded border border-gray-300 p-3"
                  />
                  <button
                    type="button"
                    onClick={handleImagesFileUpload}
                    disabled={isLoading}
                    className="cursor-pointer rounded border border-green-700 p-3 text-green-700 uppercase hover:shadow-lg disabled:opacity-80"
                  >
                    {isLoading ? (
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="me-3 inline h-4 w-full animate-spin text-white"
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
                      "Upload"
                    )}
                  </button>
                </div>
                <p className="text-red-700">
                  {imageUploadError && imageUploadError}
                </p>
                {formData.imageUrls.length > 0 && (
                  <SortableContext items={imagesId}>
                    {images.map((url) => (
                      <ImagesUploaded
                        key={url.id}
                        url={url}
                        handleDeleteImage={handleDeleteImage}
                      />
                    ))}
                  </SortableContext>
                )}
                <button
                  disabled={isLoading || editMode}
                  className="cursor-pointer rounded-lg bg-slate-700 p-3 text-white uppercase hover:opacity-80 disabled:opacity-80"
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
                    "Update Listing"
                  )}
                </button>
                {error && <p className="mt-7 text-red-700">{error}</p>}
              </div>
            </DndContext>
          </form>
        </main>
      )}
    </>
  );
}

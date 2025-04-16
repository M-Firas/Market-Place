import React from "react";

export default function CreateListing() {
  const CheckBox = ({ label, id }) => (
    <div className="flex gap-2">
      <input type="checkbox" id={id} className="w-5 cursor-pointer" />
      <label htmlFor={id} className="cursor-pointer">
        <p>{label}</p>
      </label>
    </div>
  );

  const InfoBox = ({ label, id }) => (
    <div className="flex items-center gap-2">
      <input
        type="number"
        id={id}
        min="1"
        max="10"
        required
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
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">
        Create A Listing
      </h1>
      <from className={"flex flex-col gap-4 sm:flex-row"}>
        <div className="flex flex-1 flex-col gap-4 p-2">
          <input
            type="text"
            placeholder="Name"
            id="name"
            maxLength={"62"}
            required
            className="rounded-lg bg-white p-3 outline-none focus:border-none"
          />
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            required
            className="resize-none rounded-lg bg-white p-3 outline-none focus:border-none"
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            required
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
            <InfoBox label={"Discount Price"} id={"discountPrice"} />
          </div>
        </div>
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
              className="w-full cursor-pointer rounded border border-gray-300 p-3"
            />
            <button className="cursor-pointer rounded border border-green-700 p-3 text-green-700 uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="cursor-pointer rounded-lg bg-slate-700 p-3 text-white uppercase hover:opacity-80 disabled:opacity-80">
            Creat Listing
          </button>
        </div>
      </from>
    </main>
  );
}

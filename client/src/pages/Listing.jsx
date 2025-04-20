import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://market-place-jj5i.onrender.com/api/listing/getSingleListing/${params.listingId}`,
        );

        if (res.ok === false) {
          setError(true);
          setIsLoading(false);
        }

        const data = await res.json();
        setListing(data);
        console.log(data);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {isLoading && <p className="my-7 text-center text-2xl">Loading...</p>}
      {error && (
        <p className="my-7 text-center text-2xl">Some thing went wrong...</p>
      )}
      {listing && !isLoading && !error && (
        <div>
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
            >
              {listing.listing.imageUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="absolute top-[13%] right-[3%] z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-slate-100">
              <Icon
                icon={"mdi:share-outline"}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
                className="cursor-pointer text-3xl text-slate-500 hover:opacity-80"
              />
            </div>
            {copied && (
              <p className="absolute top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                Link Copied!
              </p>
            )}
          </div>
          <div className="mx-auto my-7 flex max-w-4xl flex-col gap-4 p-3">
            <p className="text-2xl font-semibold">
              {listing.listing.name} - $
              {listing.listing.offer
                ? listing.listing.discountPrice.toLocaleString("en-US")
                : listing.listing.regularPrice.toLocaleString("en-US")}
              {listing.listing.type === "rent" && "/Month"}
            </p>
            <p className="flex items-center gap-6 text-lg text-slate-600">
              <Icon icon={"weui:location-filled"} className="text-green-700" />
              {listing.listing.address}
            </p>

            <div className="flex gap-4">
              <p className="w-full max-w-[200px] rounded-md bg-red-900 p-1 text-center text-white">
                {listing.listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.listing.offer && (
                <p className="w-full max-w-[200px] rounded-md bg-green-900 p-1 text-center text-white">
                  $
                  {+listing.listing.regularPrice -
                    +listing.listing.discountPrice}{" "}
                  OFF
                </p>
              )}
            </div>
            <p className="text-slate-900">
              <span className="text-xl font-bold text-black">
                Description : {""}
              </span>
              {listing.listing.description}
            </p>
            <ul className="flex flex-wrap items-center gap-4 text-lg font-semibold text-green-900 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <Icon icon={"tabler:bed-filled"} className="text-2xl" />
                {listing.listing.bedrooms > 1
                  ? `${listing.listing.bedrooms} Beds`
                  : `${listing.listing.bedrooms} Bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <Icon icon={"fa6-solid:bath"} className="text-xl" />
                {listing.listing.bedrooms > 1
                  ? `${listing.listing.bathrooms} Baths`
                  : `${listing.listing.bathrooms} Bath`}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <Icon icon={"fa-solid:parking"} className="text-2xl" />
                {listing.listing.parking ? "Parking Spot" : "No Parking"}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <Icon icon={"material-symbols:chair"} className="text-2xl" />
                {listing.listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser &&
              listing.listing.userRef !== currentUser.user.userId && (
                <button
                  onClick={() => setContact(true)}
                  className="cursor-pointer rounded-lg bg-slate-700 p-3 text-white uppercase hover:opacity-80"
                >
                  Contact Landlord
                </button>
              )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}

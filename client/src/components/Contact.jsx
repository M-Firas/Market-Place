import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandLord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchLandLord = async () => {
      try {
        const res = await fetch(
          `https://market-place-jj5i.onrender.com/api/user/${
            listing.listing.userRef
          }`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (res.ok === false) {
          setIsLoading(false);
          setError(res.msg);
        }
        const data = await res.json();
        setLandLord(data.user);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    };
    fetchLandLord();
  }, [listing.listing.userRef]);

  return isLoading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>error in fetching</p>
  ) : (
    landlord && (
      <div className="flex flex-col gap-2">
        <p>
          Contact {""}{" "}
          <span className="font-semibold">{landlord.username} </span> for {""}
          <span className="font-semibold lowercase">
            {listing.listing.name}
          </span>
        </p>
        <textarea
          name="message"
          id="message"
          value={message}
          onChange={handleChange}
          rows="2"
          placeholder="Enter your message here..."
          className="w-full resize-none rounded-lg border border-[#ddd] bg-white p-3 focus:outline-none"
        ></textarea>
        <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.listing.name}&body=${message}`}
          className="rounded-lg bg-slate-700 p-3 text-center text-white uppercase hover:opacity-80"
        >
          Send Message
        </Link>
      </div>
    )
  );
}

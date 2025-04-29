import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showPopup } from "../app/popup/popupSlice";
import ListingItem from "../components/ListingItem";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch();

  const handleShowListing = async () => {
    try {
      const res = await fetch(
        `https://market-place-jj5i.onrender.com/api/listing/my-listings`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        dispatch(
          showPopup({
            message: data.msg || "Failed to fetch listings",
            type: "error",
          }),
        );
        return;
      }

      setListings(data.listings);
    } catch (error) {
      dispatch(showPopup({ message: error.message, type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleShowListing();
  }, []);

  const handleDelete = async (listId) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `https://market-place-jj5i.onrender.com/api/listing/delete/${listId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const data = await res.json();
        dispatch(
          showPopup({ message: data.msg || "Failed to delete", type: "error" }),
        );
        setDeleteLoading(false);
        return;
      }

      await handleShowListing();

      dispatch(
        showPopup({ message: "Listing deleted successfully", type: "success" }),
      );

      setDeleteLoading(false);
    } catch (error) {
      setDeleteLoading(false);
      dispatch(showPopup({ message: error.message, type: "error" }));
      console.log(error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-3">
      <h1 className="mt-2 text-3xl font-semibold">My Listings</h1>
      <p className="mb-4 text-sm font-light text-slate-700">
        View, Edit or Delete Your Listings
      </p>
      <div className="flex flex-wrap gap-4 p-7">
        {loading && (
          <p className="w-full text-center text-xl text-slate-700">
            Loading...
          </p>
        )}

        {!loading && listings.length === 0 && (
          <p className="text-xl text-slate-700">No Listings Found!</p>
        )}

        {!loading &&
          listings.length > 0 &&
          listings.map((listing) => (
            <ListingItem
              key={listing._id}
              listing={listing}
              showActions={true}
              onDelete={() => handleDelete(listing._id)}
            />
          ))}
      </div>
    </div>
  );
};

export default MyListings;

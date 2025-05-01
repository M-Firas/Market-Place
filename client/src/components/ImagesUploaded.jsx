import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ImagesUploaded({ url, handleDeleteImage }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: url.id,
    data: { type: "column", url },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex cursor-grab items-center justify-between rounded-lg border border-[#ddd] p-3"
    >
      <img
        src={url.url}
        alt="lisitng image"
        className="h-20 w-20 rounded-lg object-contain"
      />
      <button
        type="button"
        disabled={isDragging}
        onClick={() => handleDeleteImage(url.url)}
        className="cursor-pointer rounded-lg p-3 text-red-700 uppercase hover:opacity-80 disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  );
}

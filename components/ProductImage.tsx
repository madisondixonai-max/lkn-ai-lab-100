"use client";

import { useState } from "react";

export default function ProductImage({
  imageUrl,
  shape,
  large,
}: {
  imageUrl: string;
  shape: string;
  large?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !imageUrl || failed;
  const sizeClass = large ? "w-full h-40" : "w-12 h-12";

  if (showPlaceholder) {
    return (
      <div
        className={`${sizeClass} rounded-lg bg-purple-200 border border-purple-300 flex items-center justify-center text-2xl font-semibold text-purple-600`}
      >
        {shape.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={shape}
      className={`${sizeClass} rounded-lg object-cover border border-purple-300`}
      onError={() => setFailed(true)}
    />
  );
}

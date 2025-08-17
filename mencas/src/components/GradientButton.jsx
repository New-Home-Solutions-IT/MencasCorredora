import React from "react";

export const GradientButton = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`relative inline-flex h-12 overflow-hidden rounded-md p-[1px] ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 transition-opacity group-hover:opacity-100"></span>
      <span className="inline-flex h-full w-full items-center justify-center rounded-md bg-black px-6 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </button>
  );
};

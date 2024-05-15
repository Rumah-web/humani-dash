"use client";

import "react-toastify/dist/ReactToastify.css";
import "../app/globals.css";
import { Bounce, ToastContainer } from "react-toastify";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const contextClass = {
    success: "bg-white text-graydark",
    error: "bg-danger text-white",
    info: "bg-gray text-white",
    warning: "bg-warning text-graydark",
    default: "bg-default text-graydark",
    dark: "bg-graydark text-graydark",
  };

  return (
    <>
      {children}
      <ToastContainer
        toastClassName={(context) =>
          contextClass[context?.type || "default"] +
          " relative border border-gray drop-shadow-lg flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        }
        bodyClassName={() => "flex text-sm font-med block p-3"}
        position="bottom-right"
        autoClose={3000}
        transition={Bounce}
      />
    </>
  );
}
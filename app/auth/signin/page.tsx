'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import { Button } from "@/components/common/Button";
import InputPassword from "@/components/Inputs/Password";

// import { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Signin | Humani Catering Service",
//   description: "Humani Catering Service",
//   // other metadata
// };

export default function LoginForm() {
  const [errorMessage, formAction] = useFormState(authenticate, undefined);

  return (
    <>
      <div className="h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center h-full">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center flex flex-col justify-center items-center">
              <Link className="mb-5.5 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/logo-white.png"}
                  alt="Logo"
                  width={130}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/logo-red.png"}
                  alt="Logo"
                  width={130}
                  height={32}
                />
              </Link>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In
              </h2>

              <form action={formAction}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your username"
                      name="email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <InputPassword placeholder="6+ Characters, 1 Capital letter" />
                  </div>
                </div>

                <div className="mb-5">
                  <LoginButton />
                </div>       
                <div
                  className="flex h-8 items-end space-x-1"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {errorMessage && (
                    <>
                      <div className="h-5 w-5 text-danger">
                        <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"></path>
                        </svg>
                      </div>
                      <p className="text-sm text-danger">{errorMessage}</p>
                    </>
                  )}
                </div>         
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full p-4 focus-visible:outline-danger active:bg-danger hover:bg-danger bg-danger" aria-disabled={pending}>
      Sign In
    </Button>
  );
}
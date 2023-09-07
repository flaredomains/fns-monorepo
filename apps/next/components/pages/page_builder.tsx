import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import X from "../../public/X.svg";
import Image from "next/image";
import SideNavbar from "../SideNavbar";
import Links from "../Links";
import PageBuilder from "../PageBuilder";
import Link from "next/link";

export default function Page_Builder() {
  const [open, setOpen] = useState(false);
  const [selectText, setSelectText] = useState("");
  return (
    <>
      <div className="min-h-screen lg:min-h-full">
        <div className="flex flex-col bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <SideNavbar />

          {/* PageBuilder */}
          <div className="flex flex-col mt-9 pb-8 lg:mx-8 w-full min-h-screen lg:min-h-full lg:w-3/4 justify-between lg:justify-normal">
            <PageBuilder
              setOpen={setOpen}
              selectText={selectText}
              setSelectText={setSelectText}
            />

            {/* Links */}
            <div className="flex flex-row lg:hidden w-full justify-center mt-8 gap-8 ">
              <Links />
            </div>
          </div>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-700 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                      <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                        <button
                          type="button"
                          className="rounded-md bg-trasparent"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close</span>
                          <Image
                            src={X}
                            className="h-4 w-4"
                            alt="X"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <div className="mx-auto flex h-12 w-12 text-5xl items-center justify-center rounded-full bg-trasparent">
                        🎉
                      </div>
                      <div className="mt-6 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className=" font-bold leading-6 text-slate-50 text-xl text-center"
                        >
                          {`Congratulations!`}
                        </Dialog.Title>
                        <Dialog.Title
                          as="h3"
                          className=" font-bold leading-6 text-slate-50 text-xl text-center"
                        >
                          {`You’ve minted a website to`}
                        </Dialog.Title>
                        <Dialog.Title
                          as="h3"
                          className="font-bold leading-6 text-orange-500 text-xl text-center"
                        >
                          {`${selectText}.flr`}
                        </Dialog.Title>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 flex justify-center items-center w-full">
                      <Link
                        href={`${selectText}.flr`}
                        target="_blank"
                        className=" rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold shadow-sm text-justify text-white leading-tight"
                      >
                        Go to Website
                      </Link>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
}

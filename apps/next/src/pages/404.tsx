import React, { useState } from "react";
import { useRouter } from "next/router";
import Logo from "../../public/Logo.png";
import Search from "../../public/Search.png";
import Ellipse_2 from "../../public/Ellipse_2.png";
import Ellipse from "../../public/Ellipse.png";
import Image from "next/image";
import styles from "../../src/styles/Main.module.css";
import Link from "next/link";
import Links from "../../components/Links";

export default function NotFound() {
  return (
    <div className="bg-[#0F172A] min-h-screen relative overflow-hidden">
      {/* Gradient */}
      <Image
        className="absolute top-0 left-0 h-2/5 w-full md:h-1/3 md:w-2/3 pointer-events-none"
        src={Ellipse}
        alt="Gradient Top"
      />

      <Image
        className="absolute bottom-0 right-0 h-5/6 w-8/9 md:h-2/3 md:w-5/6 pointer-events-none"
        src={Ellipse_2}
        alt="Gradient Bottom"
      />

      {/* NavBar */}
      <div className="flex justify-between items-center py-6 px-10 z-10 md:py-14 md:px-28 gap-4">
        {/* Logo */}
        <Link className="z-10" target="_blank" href="https://flrns.domains/">
          <Image
            width={96}
            height={24}
            className="cursor-pointer z-10 md:h-14 md:w-56"
            src={Logo}
            alt="Logo"
          />
        </Link>

        {/* My account / FAQ */}
        <div className="flex justify-around items-center z-10 gap-4 md:gap-6">
          <Link
            href={{
              pathname: `/my_account`,
            }}
          >
            <p className="text-white font-semibold text-xs text-center cursor-pointer md:text-lg">
              My Account
            </p>
          </Link>
          <Link
            href={{
              pathname: `/faq`,
            }}
          >
            <p className="text-white font-semibold text-xs cursor-pointer md:text-lg">
              FAQ
            </p>
          </Link>
        </div>
      </div>

      {/* Search -- Middle page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 md:w-auto">
        <div className="text-center">
          <p className="text-5xl font-semibold text-[#F97316]">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg leading-7 text-white">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={{
                pathname: `/`,
              }}
              className="rounded-md bg-[#F97316] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex bottom-0 absolute w-full justify-center py-6 px-10 z-10 md:py-14 md:px-28 gap-8 ">
        <Links />
      </div>
    </div>
  );
}

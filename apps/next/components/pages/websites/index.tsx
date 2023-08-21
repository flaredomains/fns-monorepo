import React from "react";
import SideNavbar from "../../../components/SideNavbar";
import MyAccountWebsites from "../../../components/Websites";
import Links from "../../../components/Links";

export default function Websites() {
  return (
    <>
      <div className="min-h-screen lg:min-h-full">
        <div className="flex flex-col bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <SideNavbar />

          {/* Register */}
          <div className="flex flex-col mt-9 pb-8 lg:mx-8 w-full min-h-screen lg:min-h-full lg:w-3/4 justify-between lg:justify-normal">
            <MyAccountWebsites />

            {/* Links */}
            <div className="flex flex-row lg:hidden w-full justify-center mt-8 gap-8 ">
              <Links />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

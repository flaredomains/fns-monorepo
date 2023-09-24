import React, { useState, useEffect } from "react";
import SideNavbar from "../SideNavbar";
import PagesButtons from "../PagesButtons";
import Details from "../Details";
import Links from "../Links";
import { useLocation } from "react-router-dom";

export default function Result() {
  const [result, setResult] = useState<string>("");
  const [path, setPath] = useState<string>("");

  const location = useLocation();

  useEffect(() => {
    if (location) {
      const lastIndex = location.pathname.lastIndexOf("/");
      setResult(location.pathname.substring(lastIndex + 1));
      setPath(location.pathname.substring(0, lastIndex));
    }
  }, [location]);

  return (
    <>
      <div className="min-h-screen lg:min-h-full">
        <div className="flex-col bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <SideNavbar path={"/"} />

          {/* Register */}
          <div className="flex flex-col mt-9 pb-8 lg:mx-8 w-full min-h-screen lg:min-h-full lg:w-3/4 justify-between lg:justify-normal">
            {/* Three button Register, Details, Subdomain / Search Input (hidden mobile) */}
            <div>
              <PagesButtons result={result} path={path} />
              <Details result={result} />
            </div>

            {/* Links */}
            <div className="flex flex-row lg:hidden w-full justify-center mt-8 gap-8">
              <Links />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

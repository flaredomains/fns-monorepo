import React, { useState, useEffect } from "react";
import SideNavbar from "../../../components/SideNavbar";
import { useLocation } from "react-router-dom";
import FAQComp from "../../../components/FAQ";
import Links from "../../../components/Links";

function FAQ() {
  const [setIsConnect] = useState(false);
  const [arrSubdomains, setArrSubdomains] = useState([[1], [2], [3]]);
  const [result, setResult] = useState<String>("");
  const location = useLocation();

  useEffect(() => {
    if (location) {
      const lastIndex = location.pathname.lastIndexOf("/");
      setResult(location.pathname.substring(lastIndex + 1));
    }
  }, [location]);

  return (
    <>
      <div className="min-h-full">
        <div className="flex-col bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <SideNavbar path={"/faq"} />

          {/* Register */}
          <div className="flex flex-col mt-9 pb-8 lg:mx-8 w-full min-h-full lg:w-3/4 justify-between lg:justify-normal">
            <FAQComp />

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

export default FAQ;

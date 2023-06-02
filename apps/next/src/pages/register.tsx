import React, { useState, useEffect } from "react";
import Register from "../../components/Register";
import SideNavbar from "../../components/SideNavbar";
import { useRouter } from "next/router";
import PagesButtons from "../../components/PagesButtons";
import Links from "../../components/Links";

export default function Result() {
  const [result, setResult] = useState<string>("");
  const [path, setPath] = useState<String>("");

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const result = router.query.result as string;
    const path = router.pathname as String;
    setPath(path);
    setResult(result);
  }, [router.isReady, router.query]);

  return (
    <>
      <div className="min-h-screen lg:min-h-full">
        <div className="flex-col w-full bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <SideNavbar />

          {/* Register */}
          <div className="flex flex-col w-full mt-9 pb-8 lg:mx-8 min-h-screen lg:min-h-full lg:w-3/4 justify-between lg:justify-normal">
            {/* Three button Register, Details, Subdomain / Search Input (hidden mobile) */}
            <div>
              <PagesButtons result={result} path={path} />

              <Register result={result} />
            </div>

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

import React, { useEffect } from "react";
import PageWebsite from "../../../components/Websites/PageWebsite";
import { useLocation, useNavigate } from "react-router-dom";

export default function Website() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location) {
      const lastIndex = location.pathname.lastIndexOf("/");

      const domain = location.pathname.substring(lastIndex + 1);

      if (typeof domain === "string" && !domain.endsWith(".flr")) {
        // Redirect to 404 page if URL doesn't end with ".flr"
        navigate("/404");
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <PageWebsite />
    </div>
  );
}

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import PageWebsite from "../../../components/Websites/PageWebsite";

export default function Website() {
  const router = useRouter();
  // const { domain } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    const domain = router.query.website as string;
    // console.log(domain);
    if (typeof domain === "string" && !domain.endsWith(".flr")) {
      // Redirect to 404 page if URL doesn't end with ".flr"
      router.push("/404");
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen">
      <PageWebsite />
    </div>
  );
}

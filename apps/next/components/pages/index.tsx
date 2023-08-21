import Head from "next/head";
import Search from "../Search";

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        <Search />
      </div>
    </>
  );
}

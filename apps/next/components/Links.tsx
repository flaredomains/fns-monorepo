import React from "react";
import Link from "next/link";
import Image from "next/image";
import Github from "../public/github.png";
import Discord from "../public/discord.png";
import Twitter from "../public/twitter.png";
import Website from "../public/website.png";
import Docs from "../public/docs.png";

function Links() {
  return (
    <>
      <Link
        target="_blank"
        href="https://github.com/flaredomains"
        className="shrink-0"
      >
        <div
          className={`hover:scale-125 transform transition duration-400 ease-out`}
        >
          <Image
            width={32}
            height={32}
            className="h-4 w-auto opacity-80 hover:opacity-100"
            src={Github}
            alt="Github"
          />
        </div>
      </Link>
      <Link
        target="_blank"
        href="https://discord.gg/wDd3pGsscZ"
        className="shrink-0"
      >
        <div
          className={`hover:scale-125 transform transition duration-400 ease-out`}
        >
          <Image
            width={32}
            height={32}
            className="h-4 w-auto opacity-80 hover:opacity-100"
            src={Discord}
            alt="Discord"
          />
        </div>
      </Link>
      <Link
        target="_blank"
        href="https://twitter.com/flarenaming"
        className="shrink-0"
      >
        <div
          className={`hover:scale-125 transform transition duration-400 ease-out`}
        >
          <Image
            width={32}
            height={32}
            className="h-4 w-auto opacity-80 hover:opacity-100"
            src={Twitter}
            alt="Twitter"
          />
        </div>
      </Link>
      <Link
        target="_blank"
        href="https://docs.flrns.domains/"
        className="shrink-0"
      >
        <div
          className={`hover:scale-125 transform transition duration-400 ease-out`}
        >
          <Image
            width={32}
            height={32}
            className="h-4 w-auto opacity-80 hover:opacity-100"
            src={Docs}
            alt="Docs"
          />
        </div>
      </Link>
      <Link target="_blank" href="https://flrns.domains/" className="shrink-0">
        <div
          className={`hover:scale-125 transform transition duration-400 ease-out`}
        >
          <Image
            width={32}
            height={32}
            className="h-4 w-auto opacity-80 hover:opacity-100"
            src={Website}
            alt="Website"
          />
        </div>
      </Link>
    </>
  );
}

export default Links;

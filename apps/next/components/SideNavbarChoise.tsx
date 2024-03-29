import React from "react";
import Search from "../public/Search.svg";
import Account from "../public/Account.svg";
import WebsiteBuilder from "../public/WebsiteBuilder.svg";
import Send from "../public/SendTokens.svg";
import FAQ from "../public/FAQ.svg";
import Image from "next/image";
// import Link from "next/link";
import { Link } from "react-router-dom";

const buttonData = [
  {
    page: "/",
    text: "Search For Domain",
    button_style: "",
    text_style: "",
    src: Search,
    alt: "Search",
  },
  {
    page: "/my_account",
    text: "My Account",
    button_style: "",
    text_style: "",
    src: Account,
    alt: "Account",
  },
  {
    page: "/websites",
    text: "Websites",
    button_style: "",
    text_style: "",
    src: WebsiteBuilder,
    alt: "Websites",
  },
  {
    page: "/send_tokens",
    text: "Send Tokens",
    button_style: "",
    text_style: "",
    src: Send,
    alt: "SendTokens",
  },
  {
    page: "/faq",
    text: "FAQ",
    button_style: "",
    text_style: "",
    src: FAQ,
    alt: "FAQ",
  },
];

const ButtonChoice = ({
  text,
  page,
  button_style,
  text_style,
  src,
  alt,
}: {
  text: string;
  page: string;
  button_style: string;
  text_style: string;
  src: any;
  alt: string;
}) => {
  return (
    <>
      <Link to={`${page}`}>
        <div
          className={`flex items-center w-full my-1 h-12 px-3 py-2 rounded-md ${button_style} hover:bg-gray-600 [&>p]:hover:text-white hover:scale-105 transform transition duration-400 ease-out`}
        >
          <Image className="h-6 w-6 mr-2" src={src} alt={alt} />
          <p
            className={`w-full bg-transparent font-semibold text-normal ${text_style} focus:outline-none`}
          >
            {text}
          </p>
        </div>
      </Link>
    </>
  );
};

function SideNavbarChoise({
  path,
  isOpen,
  isLarge,
}: {
  path: String;
  isOpen: boolean;
  isLarge: boolean;
}) {
  console.log("path sidenavbar", path);
  return (
    <>
      <div
        className={`pt-8 ${
          isOpen && !isLarge && "pb-8 px-8 bg-gray-800"
        } w-full lg:flex lg:flex-col`}
      >
        {buttonData.map((item) => (
          <ButtonChoice
            key={item.text}
            text={item.text}
            page={item.page}
            button_style={`${item.button_style}${
              path === item.page ? " bg-gray-700" : " bg-transparent"
            }`}
            text_style={path === item.page ? " text-white" : " text-gray-500"}
            src={item.src}
            alt={item.alt}
          />
        ))}
      </div>
    </>
  );
}

export default SideNavbarChoise;

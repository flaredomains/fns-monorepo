import React from "react";
import Image from "next/image";
import Link from "next/link";
const TextsSection = ({
  websiteData,
}: {
  websiteData: {
    title: string;
    background: undefined;
    body: string;
    theme: string;
    button1: string;
    button1Link: string;
    contactButton: string;
    contactButtonEmail: string;
    name: string;
    role: string;
    profilePicture: undefined;
    buttonBackgroundColor: string;
  };
}) => {
  return (
    <>
      <div
        className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-5 ${
          websiteData.theme === "glassmorphsm"
            ? "text-white"
            : websiteData.theme === "light"
            ? "text-neutral-900"
            : "text-white"
        }`}
      >
        {websiteData.title || (
          <div className="h-5 my-3 w-1/2 animate-pulse bg-gray-300 rounded-full" />
        )}
      </div>
      <div
        className={`text-base lg:text-lg xl:text-2xl font-light mb-5 ${
          websiteData.theme === "glassmorphsm"
            ? "text-white/50"
            : websiteData.theme === "light"
            ? "text-neutral-500"
            : "text-neutral-400"
        }`}
      >
        {websiteData.body || (
          <>
            <div className="h-3 my-3 w-full animate-pulse bg-gray-400 rounded-full" />
            <div className="h-3 my-3 w-full animate-pulse bg-gray-400 rounded-full" />
            <div className="h-3 my-3 w-full animate-pulse bg-gray-400 rounded-full" />
            <div className="h-3 my-3 w-full animate-pulse bg-gray-400 rounded-full" />
          </>
        )}
      </div>
    </>
  );
};

const ButtonSection = ({
  websiteData,
}: {
  websiteData: {
    title: string;
    background: undefined;
    body: string;
    theme: string;
    button1: string;
    button1Link: string;
    contactButton: string;
    contactButtonEmail: string;
    name: string;
    role: string;
    profilePicture: undefined;
    buttonBackgroundColor: string;
  };
}) => {
  const getContrastColor = (bgColor: string) => {
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 128 ? "#000000" : "#ffffff";
  };

  const buttonBackgroundColor = websiteData.buttonBackgroundColor;
  const buttonTextColor = getContrastColor(buttonBackgroundColor);
  return (
    <>
      <div className="flex items-center gap-x-5 mb-9 lg:mb-16">
        {websiteData.button1Link ? (
          <Link
            href={
              websiteData.button1Link.includes("https://")
                ? `${websiteData.button1Link}`
                : `https://${websiteData.button1Link}`
            }
            target="_blank"
            className={`flex items-center justify-center px-5 py-3 gap-[0.2rem] rounded-lg shadow border`}
            style={{
              backgroundColor: websiteData.buttonBackgroundColor,
              borderColor: websiteData.buttonBackgroundColor,
              color: buttonTextColor,
            }}
          >
            <p
              className={`text-base font-semibold`}
              style={{
                color: buttonTextColor,
              }}
            >
              {websiteData.button1 || "Pay Me"}
            </p>
            <svg
              width="20"
              height="20"
              viewBox="0 0 7 7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.32227 4.54375L4.9843 1.88171M4.9843 1.88171H2.32227M4.9843 1.88171V4.54375"
                stroke="currentColor"
                strokeWidth="0.532407"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        ) : null}

        {websiteData.contactButtonEmail ? (
          <Link
            href={
              websiteData.contactButtonEmail.includes("https://")
                ? `${websiteData.contactButtonEmail}`
                : `https://${websiteData.contactButtonEmail}`
            }
            target="_blank"
            className={`flex items-center justify-center bg-trasparent px-5 py-3 gap-[0.2rem] rounded-lg border ${
              websiteData.theme === "light" ? "border-black" : "border-white"
            } border-opacity-50`}
          >
            <p
              className={`text-base font-semibold ${
                websiteData.theme === "light" ? "text-black" : "text-white"
              }`}
            >
              {websiteData.contactButton || "Contact Me"}
            </p>
          </Link>
        ) : null} 
      </div>
    </>
  );
};

const InfoUserSection = ({
  websiteData,
  imageAvatarBase64,
}: {
  websiteData: {
    title: string;
    background: undefined;
    body: string;
    theme: string;
    button1: string;
    button1Link: string;
    contactButton: string;
    contactButtonEmail: string;
    name: string;
    role: string;
    profilePicture: undefined;
    buttonBackgroundColor: string;
  };
  imageAvatarBase64: string;
}) => {
  return (
    <>
      <div className="flex items-center gap-x-5">
        {imageAvatarBase64 ? (
          <Image
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-full" //border border-white border-opacity-40
            src={`data:image/png;base64,${imageAvatarBase64}`}
            width={64}
            height={64}
            alt="AvatarPreview"
          />
        ) : (
          <>
            <div className="w-12 h-12 lg:w-16 lg:h-16 animate-pulse bg-gray-500 rounded-full" />
          </>
        )}

        <div className="flex flex-col">
          {websiteData.name === "" && (
            <div className="h-3 my-3 w-32 animate-pulse bg-gray-400 rounded-full" />
          )}

          {websiteData.role === "" && (
            <div className="h-3 my-3 w-32 animate-pulse bg-gray-400 rounded-full" />
          )}

          <p
            className={`text-lg lg:text-2xl font-semibold  ${
              websiteData.theme === "glassmorphsm"
                ? "text-white"
                : websiteData.theme === "light"
                ? "text-neutral-900"
                : "text-white"
            }`}
          >
            {websiteData.name}
          </p>

          <p
            className={`text-base lg:text-lg font-light  ${
              websiteData.theme === "glassmorphsm"
                ? "text-white"
                : websiteData.theme === "light"
                ? "text-neutral-900"
                : "text-white"
            }`}
          >
            {websiteData.role}
          </p>
        </div>
      </div>
    </>
  );
};

function PageWebsite({
  imageAvatarBase64,
  imageWebsiteBase64,
  websiteData,
}: {
  imageAvatarBase64: string;
  imageWebsiteBase64: string;
  websiteData: {
    title: string;
    background: undefined;
    body: string;
    theme: string;
    button1: string;
    button1Link: string;
    contactButton: string;
    contactButtonEmail: string;
    name: string;
    role: string;
    profilePicture: undefined;
    buttonBackgroundColor: string;
  };
}) {
  return (
    <div className="bg-black flex flex-col lg:relative w-full h-full min-h-screen overflow-hidden lg:h-screen">
      {imageWebsiteBase64 ? (
        <Image
          className="lg:absolute w-full h-full lg:object-cover lg:z-0 lg:object-center"
          src={`data:image/png;base64,${imageWebsiteBase64}`}
          width={600}
          height={500}
          alt="PreviewImage"
        />
      ) : (
        <>
          <div className="lg:absolute w-full sm:h-60 md:h-96 h-[31.25rem] lg:w-full lg:h-full lg:object-cover lg:z-0 lg:object-center animate-pulse bg-gray-300" />
        </>
      )}
      <div
        className={`z-10 flex flex-col justify-center py-4 px-10 lg:px-20 lg:w-[45%] w-full h-[31.3rem] lg:h-full shadow backdrop-blur-[28.34px] ${
          websiteData.theme === "glassmorphsm"
            ? " lg:bg-neutral-400 lg:bg-opacity-20"
            : websiteData.theme === "light"
            ? "bg-white"
            : "bg-neutral-900"
        }`}
      >
        <TextsSection websiteData={websiteData} />
        <ButtonSection websiteData={websiteData} />
        <InfoUserSection
          websiteData={websiteData}
          imageAvatarBase64={imageAvatarBase64}
        />
      </div>
    </div>
  );
}

export default PageWebsite;

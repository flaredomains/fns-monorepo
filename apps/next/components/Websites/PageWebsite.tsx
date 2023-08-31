import React, { useState } from "react";
import EllipseBuilderTop from "../../public/EllipseBuilderTop.png";
import PreviewImage from "../../public/PreviewImage.png";
import ArrowUpRight from "../../public/arrow-up-right.svg";
import AvatarPreview from "../../public/AvatarPreview.png";
import Image from "next/image";

const TextsSection = ({ formState }: { formState: any }) => {
  return (
    <>
      <p
        className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-5 ${
          formState.theme === "glassmorphsm"
            ? "text-white"
            : formState.theme === "light"
            ? "text-neutral-900"
            : "text-white"
        }`}
      >
        {formState.title || "The XRP Conference"}
      </p>
      <p
        className={`text-base lg:text-lg xl:text-2xl font-light mb-5 ${
          formState.theme === "glassmorphsm"
            ? "text-white/50"
            : formState.theme === "light"
            ? "text-neutral-500"
            : "text-neutral-400"
        }`}
      >
        {formState.body ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
      </p>
    </>
  );
};

const ButtonSection = ({ formState }: { formState: any }) => {
  return (
    <>
      <div className="flex items-center gap-x-5 mb-9 lg:mb-16">
        <button
          className={`flex items-center justify-center px-5 py-3 gap-[0.2rem] rounded-lg shadow border`}
          style={{
            backgroundColor: formState.buttonBackgroundColor,
            borderColor: formState.buttonBackgroundColor,
            color: formState.buttonTextColor,
          }}
        >
          <p
            className={`text-base font-semibold`}
            style={{
              color: formState.buttonTextColor,
            }}
          >
            {formState.button1 || "Pay Me"}
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
              stroke-width="0.532407"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          className={`flex items-center justify-center bg-trasparent px-5 py-3 gap-[0.2rem] rounded-lg border ${
            formState.theme === "light" ? "border-black" : "border-white"
          } border-opacity-50`}
        >
          <p
            className={`text-base font-semibold ${
              formState.theme === "light" ? "text-black" : "text-white"
            }`}
          >
            {formState.contactButton || "Contact Me"}
          </p>
        </button>
      </div>
    </>
  );
};

const InfoUserSection = ({
  formState,
  imageAvatarBase64,
}: {
  formState: any;
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
          <p
            className={`text-lg lg:text-2xl font-semibold  ${
              formState.theme === "glassmorphsm"
                ? "text-white"
                : formState.theme === "light"
                ? "text-neutral-900"
                : "text-white"
            }`}
          >
            {formState.name || "Elon Musk"}
          </p>
          <p
            className={`text-base lg:text-lg font-light  ${
              formState.theme === "glassmorphsm"
                ? "text-white"
                : formState.theme === "light"
                ? "text-neutral-900"
                : "text-white"
            }`}
          >
            {formState.role || "CEO of Tesla"}
          </p>
        </div>
      </div>
    </>
  );
};

function PageWebsite({
  imageAvatarBase64,
  imageWebsiteBase64,
}: {
  imageAvatarBase64: string;
  imageWebsiteBase64: string;
}) {
  const [formState, setFormState] = useState({
    title: undefined,
    background: undefined,
    body: undefined,
    theme: "glassmorphsm",
    button1: undefined,
    button1Link: undefined,
    contactButton: undefined,
    name: undefined,
    role: undefined,
    profilePicture: undefined,
    buttonBackgroundColor: "#F97316",
    buttonTextColor: "#FFFFFF",
  });

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
          formState.theme === "glassmorphsm"
            ? " lg:bg-neutral-400 lg:bg-opacity-20"
            : formState.theme === "light"
            ? "bg-white"
            : "bg-neutral-900"
        }`}
      >
        <TextsSection formState={formState} />
        <ButtonSection formState={formState} />
        <InfoUserSection
          formState={formState}
          imageAvatarBase64={imageAvatarBase64}
        />
      </div>
    </div>
  );
}

export default PageWebsite;

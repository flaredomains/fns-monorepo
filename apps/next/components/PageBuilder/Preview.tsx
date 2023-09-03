import React from "react";
import EllipseBuilderTop from "../../public/EllipseBuilderTop.png";
import PreviewImage from "../../public/PreviewImage.png";
import AvatarPreview from "../../public/AvatarPreview.png";
import Image from "next/image";

const TextsSection = ({ formState }: { formState: any }) => {
  return (
    <>
      <p
        className={` text-sm lg:text-xl font-semibold mb-1 lg:mb-2 ${
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
        className={`text-[0.32rem] lg:text-[0.5rem] font-light mb-1 lg:mb-2 ${
          formState.theme === "glassmorphsm"
            ? "text-white/50"
            : formState.theme === "light"
            ? "text-neutral-500"
            : "text-neutral-400"
        }`}
      >
        {formState.body ||
          "The Wire is a Web3 subscription-based news service dedicated to providing exclusive and timely insider information on the world of cryptocurrencies."}
      </p>
    </>
  );
};

const ButtonSection = ({ formState }: { formState: any }) => {
  const getContrastColor = (bgColor: string) => {
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 128 ? "#000000" : "#ffffff";
  };

  const buttonBackgroundColor = formState.buttonBackgroundColor;
  const buttonTextColor = getContrastColor(buttonBackgroundColor);
  return (
    <>
      <div className="flex items-center mb-4 lg:mb-5">
        <button
          className={`flex items-center justify-center mr-2 px-[0.3rem] py-[0.2rem] lg:px-[0.4rem] lg:py-[0.3rem] gap-[0.2rem] rounded-sm shadow border`}
          style={{
            backgroundColor: formState.buttonBackgroundColor,
            borderColor: formState.buttonBackgroundColor,
          }}
        >
          <p
            className={`text-[0.22rem] lg:text-[0.375rem] font-semibold`}
            style={{
              color: buttonTextColor,
            }}
          >
            {formState.button1 || "Pay Me"}
          </p>
          <svg
            width="7"
            height="7"
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
          className={`flex items-center justify-center bg-trasparent px-[0.3rem] py-[0.2rem] lg:px-[0.4rem] lg:py-[0.3rem] gap-[0.2rem] rounded-sm border ${
            formState.theme === "light" ? "border-black" : "border-white"
          } border-opacity-50`}
        >
          <p
            className={`text-[0.22rem] lg:text-[0.375rem] font-semibold ${
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

const InfoUserSection = ({ formState }: { formState: any }) => {
  return (
    <>
      <div className="flex items-center gap-x-1 lg:gap-x-2">
        <Image
          className="w-3 h-3 lg:w-5 lg:h-5 rounded-full" //border border-white border-opacity-40
          src={
            formState.profilePicture
              ? `data:image/png;base64,${formState.profilePicture}`
              : AvatarPreview
          }
          width={10}
          height={10}
          alt="AvatarPreview"
        />
        <div className="flex flex-col lg:gap-y-1">
          <p
            className={`text-[0.32rem] lg:text-[0.5rem] font-semibold leading-[0.5rem] ${
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
            className={`text-[0.24rem] lg:text-[0.375rem] font-light leading-[0.5rem] ${
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

const Content = ({ formState }: { formState: any }) => {
  return (
    <>
      <div className="overflow-hidden relative w-[19.178rem] h-[13.638rem] sm:w-[28.75rem] sm:h-[20.444rem] rounded-[10px] shadow">
        <Image
          className="absolute w-full h-full"
          src={
            formState.background
              ? `data:image/png;base64,${formState.background}`
              : PreviewImage
          }
          width={600}
          height={500}
          alt="PreviewImage"
        />
        <div
          className={`z-10 flex flex-col justify-center px-3 lg:px-5 w-[8.683rem] sm:w-[13.018rem] h-full rounded-l-[10px] shadow backdrop-blur-[28.34px] ${
            formState.theme === "glassmorphsm"
              ? "bg-neutral-400 bg-opacity-20"
              : formState.theme === "light"
              ? "bg-white"
              : "bg-neutral-900"
          }`}
        >
          <TextsSection formState={formState} />
          <ButtonSection formState={formState} />
          <InfoUserSection formState={formState} />
        </div>
      </div>
    </>
  );
};

export const Gradients = () => {
  return (
    <>
      <Image
        className="absolute top-0 left-0 h-2/5 w-full md:h-1/3 md:w-2/3 pointer-events-none rounded-tl-lg"
        src={EllipseBuilderTop}
        alt="Gradient Top"
      />
      <Image
        className="absolute bottom-0 right-0 rotate-180 h-2/5 w-full md:h-1/3 md:w-2/3 pointer-events-none rounded-tl-lg"
        src={EllipseBuilderTop}
        alt="Gradient Top"
      />
    </>
  );
};

function Preview({ formState }: { formState: any }) {
  return (
    <div className="overflow-hidden flex flex-col w-full h-[26.938rem] relative items-center justify-center my-5 bg-slate-400 rounded-[10px] mb-9">
      <Gradients />
      <Content formState={formState} />
    </div>
  );
}

export default Preview;

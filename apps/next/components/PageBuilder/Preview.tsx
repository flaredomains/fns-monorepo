import React from "react";
import EllipseBuilderTop from "../../public/EllipseBuilderTop.png";
import PreviewImage from "../../public/PreviewImage.png";
import ArrowUpRight from "../../public/arrow-up-right.svg";
import AvatarPreview from "../../public/AvatarPreview.png";
import Image from "next/image";

const TextsSection = () => {
  return (
    <>
      <p className="text-white text-sm lg:text-xl font-semibold mb-1 lg:mb-2">
        The XRP Conference
      </p>
      <p className="text-white text-[0.32rem] lg:text-[0.5rem] font-light mb-1 lg:mb-2 ">
        The Wire is a Web3 subscription-based news service dedicated to
        providing exclusive and timely insider information on the world of
        cryptocurrencies.
      </p>
    </>
  );
};

const ButtonSection = () => {
  return (
    <>
      <div className="flex items-center mb-4 lg:mb-5">
        <button className="flex items-center justify-center bg-white mr-2 px-[0.3rem] py-[0.2rem] lg:px-[0.4rem] lg:py-[0.3rem] gap-[0.2rem] rounded-sm shadow border border-gray-300">
          <p className="text-slate-700 text-[0.22rem] lg:text-[0.375rem] font-semibold ">
            Pay Me
          </p>
          <Image
            className="w-1 h-1 lg:w-2 lg:h-2"
            src={ArrowUpRight}
            alt="ArrowUpRight"
          />
        </button>
        <button className="flex items-center justify-center bg-trasparent px-[0.3rem] py-[0.2rem] lg:px-[0.4rem] lg:py-[0.3rem] gap-[0.2rem] rounded-sm border border-white border-opacity-50">
          <p className="text-white text-[0.22rem] lg:text-[0.375rem] font-semibold ">
            Contact Me
          </p>
        </button>
      </div>
    </>
  );
};

const InfoUserSection = () => {
  return (
    <>
      <div className="flex items-center gap-x-1 lg:gap-x-2">
        <Image
          className="w-3 h-3 lg:w-5 lg:h-5 rounded-full" //border border-white border-opacity-40
          src={AvatarPreview}
          alt="AvatarPreview"
        />
        <div className="flex flex-col lg:gap-y-1">
          <p className="text-white text-[0.32rem] lg:text-[0.5rem] font-semibold leading-[0.5rem]">
            Elon Musk
          </p>
          <p className="text-white text-[0.24rem] lg:text-[0.375rem] font-light leading-[0.5rem]">
            CEO of Tesla
          </p>
        </div>
      </div>
    </>
  );
};

const Content = () => {
  return (
    <>
      <div className="overflow-hidden relative w-[19.178rem] h-[13.638rem] sm:w-[28.75rem] sm:h-[20.444rem] rounded-[10px] shadow">
        <Image
          className="absolute w-full h-full"
          src={PreviewImage}
          alt="PreviewImage"
        />
        <div className="z-10 flex flex-col justify-center px-3 lg:px-5 w-[8.683rem] sm:w-[13.018rem] h-full rounded-l-lg bg-neutral-400 bg-opacity-20 shadow backdrop-blur-[28.34px]">
          <TextsSection />
          <ButtonSection />
          <InfoUserSection />
        </div>
      </div>
    </>
  );
};

export const Gradients = () => {
  return (
    <>
      <Image
        className="absolute top-0 left-0 h-2/5 w-full md:h-1/3 md:w-2/3 pointer-events-none"
        src={EllipseBuilderTop}
        alt="Gradient Top"
      />
      <Image
        className="absolute bottom-0 right-0 rotate-180 h-2/5 w-full md:h-1/3 md:w-2/3 pointer-events-none"
        src={EllipseBuilderTop}
        alt="Gradient Top"
      />
    </>
  );
};

function Preview() {
  return (
    <div className="overflow-hidden flex flex-col w-full h-[26.938rem] relative items-center justify-center my-5 bg-slate-400 rounded-[10px] mb-9">
      <Gradients />

      <Content />
    </div>
  );
}

export default Preview;

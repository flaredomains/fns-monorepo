import React, { useState } from "react";
import Image from "next/image";
import styles from "../../src/styles/Main.module.css";
import Upload from "../../public/Upload_image.png";
import Glass from "../../public/Glassmorphsm.png";
import Light from "../../public/LightTheme.png";
import Dark from "../../public/DarkTheme.png";
import ArrowRight from "../../public/ArrowRight.png";
import { Gradients } from "./Preview";

const BackgroundSelector = () => {
  const [selectedBackgroundFile, setSelectedBackgroundFile] =
    useState<any>(null);

  const handleBackgroundFileSelect = (e: any) => {
    e.preventDefault();
    const backgroundFile = e?.dataTransfer?.files?.[0] || e?.target?.files?.[0];

    // Check the aspect ratio before setting the selected file
    if (backgroundFile) {
      const background = document.createElement("img");
      background.src = URL.createObjectURL(backgroundFile);
      background.onload = () => {
        const aspectRatio = background.width / background.height;
        if (aspectRatio >= 1 && aspectRatio <= 1.8) {
          setSelectedBackgroundFile(backgroundFile);
        } else {
          alert("Image aspect ratio must be between 1:1 and 1:1.8");
        }
      };
    }
  };

  const renderUploadBackgroundContent = () => {
    if (selectedBackgroundFile) {
      const imageBackgroundUrl = URL.createObjectURL(selectedBackgroundFile); // Generate temporary URL for the selected file
      return (
        <>
          <Image
            width={64}
            height={64}
            className="h-16 w-auto"
            src={imageBackgroundUrl}
            alt="Upload"
          />
          <p className="text-gray-400 text-xs">{selectedBackgroundFile.name}</p>
        </>
      );
    } else {
      return (
        <>
          <Image
            width={24}
            height={24}
            className="h-6 w-6"
            src={Upload}
            alt="Upload"
          />
          <p className="text-sm">
            Click to upload or drag and drop your background
          </p>
          <p className="text-gray-400 text-xs">
            SVG, PNG, JPG or GIF (max. 5GB)
          </p>
          <p className="text-gray-500 text-xs">
            Must be between 1:1 and 1:1.8 ratio
          </p>
        </>
      );
    }
  };
  return (
    <label
      htmlFor="dropzone-background-file"
      className="flex w-full lg:w-1/2 cursor-pointer hover:brightness-110"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleBackgroundFileSelect(e)}
    >
      <div className="flex flex-col gap-1 justify-center items-center text-center w-full text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none">
        {renderUploadBackgroundContent()}
      </div>
      <input
        id="dropzone-background-file"
        type="file"
        className="hidden"
        onChange={(e) => handleBackgroundFileSelect(e)}
      />
    </label>
  );
};

const ProfileSelector = () => {
  const [selectedProfileFile, setSelectedProfileFile] = useState<any>(null);

  const handleProfileFileSelect = (e: any) => {
    e.preventDefault();
    const profileFile = e?.dataTransfer?.files?.[0] || e?.target?.files?.[0];

    // Check the aspect ratio before setting the selected file
    if (profileFile) {
      const image = document.createElement("img");
      console.log(profileFile.type);
      image.src = URL.createObjectURL(profileFile);
      image.onload = () => {
        console.log(image.height);
        if (
          (profileFile.type === "image/png" ||
            profileFile.type === "image/jpeg" ||
            profileFile.type === "image/svg") &&
          (image.width < 800 || image.height < 400)
        ) {
          setSelectedProfileFile(profileFile);
        } else {
          alert("SVG, PNG, JPG or GIF (max. 800x400px)");
        }
      };
    }
  };

  const renderUploadProfileContent = () => {
    if (selectedProfileFile) {
      const imageUrl = URL.createObjectURL(selectedProfileFile); // Generate temporary URL for the selected file
      return (
        <>
          <Image
            width={64}
            height={64}
            className="h-16 w-auto"
            src={imageUrl}
            alt="Upload"
          />
          <p className="text-gray-400 text-xs">{selectedProfileFile.name}</p>
        </>
      );
    } else {
      return (
        <>
          <Image
            width={24}
            height={24}
            className="h-6 w-6"
            src={Upload}
            alt="Upload"
          />
          <p className="text-sm">
            Click to upload or drag and drop your profile picture
          </p>
          <p className="text-gray-500 text-xs">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
        </>
      );
    }
  };
  return (
    <label
      htmlFor="dropzone-profile-file"
      className="flex w-full cursor-pointer hover:brightness-110"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleProfileFileSelect(e)}
    >
      <div className="flex flex-col gap-1 justify-center items-center text-center w-full text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none">
        {renderUploadProfileContent()}
      </div>
      <input
        id="dropzone-profile-file"
        type="file"
        className="hidden"
        onChange={(e) => handleProfileFileSelect(e)}
      />
    </label>
  );
};

const ThemeSection = () => {
  return (
    <div className={`flex flex-col w-full ${styles.autofill}`}>
      <p className="text-white text-sm font-normal mb-2">
        Choose Your Theme:{" "}
        <span className="text-gray-500">
          (See it live in the preview above)
        </span>
      </p>
      <div className="flex flex-col xl:flex-row gap-9 justify-center items-center">
        <div className="relative flex flex-col w-full max-w-xs items-center p-7 bg-[#94A3B8] rounded-lg gap-6 cursor-pointer">
          <Image
            width={64}
            height={64}
            className="h-auto w-36 shrink-0 hover:shadow-xl"
            src={Glass}
            alt="Glassmorphsm"
          />
          <p className="py-[6px] px-3 bg-white text-xs rounded-full font-semibold text-center hover:shadow-xl">
            Glassmorphsm
          </p>
          <Gradients />
        </div>
        <div className="relative flex flex-col w-full max-w-xs items-center p-7 bg-[#94A3B8] rounded-lg gap-6 cursor-pointer">
          <Image
            width={64}
            height={64}
            className="h-auto w-36 shrink-0 hover:shadow-xl"
            src={Light}
            alt="Light Mode"
          />
          <p className="py-[6px] px-3 bg-white text-xs rounded-full font-semibold text-center hover:shadow-xl">
            Light Mode
          </p>
          <Gradients />
        </div>
        <div className="relative flex flex-col w-full max-w-xs items-center p-7 bg-[#94A3B8] rounded-lg gap-6 cursor-pointer">
          <Image
            width={64}
            height={64}
            className="h-auto w-36 shrink-0 hover:shadow-xl"
            src={Dark}
            alt="Dark Mode"
          />
          <p className="py-[6px] px-3 bg-white text-xs rounded-full font-semibold text-center hover:shadow-xl">
            Dark Mode
          </p>
          <Gradients />
        </div>
      </div>
    </div>
  );
};

const ButtonsSection = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex flex-col w-full lg:w-1/2 ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">Title Text</p>
          <input
            type="text"
            placeholder="Ex. Pay Me"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
        <div className={`flex flex-col w-full lg:w-1/2 ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">Button #1 Link</p>
          <input
            type="text"
            placeholder="www.example.com"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex flex-col w-full lg:w-1/2 ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">
            Contact Button Text
          </p>
          <input
            type="text"
            placeholder="Ex. Contact Me"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
        <div className={`flex flex-col w-full lg:w-1/2 ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">
            Contact Button Email Address
          </p>
          <input
            type="text"
            placeholder="Your Email Address Here"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

const ProfileSection = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 my-6">
      <div className="flex flex-col w-full lg:w-1/2 gap-6">
        <div className={`flex flex-col  ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">Your Name</p>
          <input
            type="text"
            placeholder="Ex. Elon Musk"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
        <div className={`flex flex-col  ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">Your Role</p>
          <input
            type="text"
            placeholder="Ex. CEO of Tesla"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 gap-6">
        <ProfileSelector />
      </div>
    </div>
  );
};

const SubmitSection = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:my-9 justify-between gap-4 lg:gap-0">
      <div className="flex flex-col gap-1">
        <p className="text-white text-sm font-normal">Main Button Color</p>
        <div className="flex gap-1 items-center">
          <div className="h-5 w-5 bg-[#F97316] rounded-md"></div>
          <p className="text-gray-300 text-sm font-medium leading-tight">
            #F97316
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 lg:mx-8">
        <span className="text-gray-400 text-sm">
          You will be minting this website on
        </span>
        <p className="text-white text-sm font-normal">https://example.flr</p>
      </div>
      <div className="flex justify-center lg:justify-normal">
        <button className="flex lg:w-full items-center gap-2 bg-[#F97316] py-3 px-5 rounded-md text-white font-normal hover:brightness-110">
          <p className="flex">Mint Website Now</p>
          <Image
            width={64}
            height={64}
            className="h-5 w-5"
            src={ArrowRight}
            alt="Arrow"
          />
        </button>
      </div>
    </div>
  );
};

function WebBuilderForm() {
  return (
    <div>
      <form action="" className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className={`flex flex-col w-full lg:w-1/2 ${styles.autofill}`}>
            <h1 className="text-white font-semibold text-4xl mb-6">
              Example.flr
            </h1>
            <p className="text-white text-sm font-normal mb-2">Title Text</p>
            <input
              type="text"
              placeholder="Enter your title here"
              className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
            />
          </div>
          <BackgroundSelector />
        </div>
        <div className={`flex flex-col w-full ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">Body Text</p>
          <textarea
            placeholder="Type your body text for the website here"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
        <ThemeSection />
        <ButtonsSection />
        <ProfileSection />
        <SubmitSection />
      </form>
    </div>
  );
}

export default WebBuilderForm;

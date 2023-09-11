import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "../../src/styles/Main.module.css";
import Upload from "../../public/Upload_image.png";
import Glass from "../../public/Glassmorphsm.png";
import Light from "../../public/LightTheme.png";
import Dark from "../../public/DarkTheme.png";
import ArrowRight from "../../public/ArrowRight.png";
import { Gradients } from "./Preview";
import { HexColorPicker } from "react-colorful";

// For check if connected
import { useAccount } from "wagmi";

function isImageValid(file: any) {
  const acceptedExtensions = [".png", ".jpg", ".jpeg", ".svg"];
  const fileName = file.name.toLowerCase();

  for (const extension of acceptedExtensions) {
    if (fileName.endsWith(extension)) {
      console.log("fileName.endsWith(extension): ", extension);
      return true;
    }
  }
  return false;
}

const BackgroundSelector = ({
  background,
  handleBackground,
}: {
  background: any;
  handleBackground: any;
}) => {
  const [selectedBackgroundName, setSelectedBackgroundName] =
    useState<any>(null);

  const handleBackgroundFileSelect = (e: any) => {
    e.preventDefault();
    const backgroundFile = e?.dataTransfer?.files?.[0] || e?.target?.files?.[0];

    const imageSizeMB = backgroundFile.size / (1024 * 1024); // Convert size to MB
    // console.log("imageSizeBackgroundMB", imageSizeMB);
    if (imageSizeMB > 5) return alert(`Image size is too large (max 5MB)`);

    if (backgroundFile && isImageValid(backgroundFile)) {
      setSelectedBackgroundName(backgroundFile.name);
      const reader = new FileReader();

      const background = document.createElement("img");
      background.src = URL.createObjectURL(backgroundFile);

      background.onload = () => {
        const aspectRatio = background.width / background.height;
        if (aspectRatio >= 1 && aspectRatio <= 1.8) {
          reader.onload = () => {
            const base64String = reader.result as string;
            handleBackground(
              base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, "")
            );
          };
          reader.readAsDataURL(backgroundFile);
        } else {
          alert("Image aspect ratio must be between 1:1 and 1:1.8");
        }
      };
    } else {
      alert("Please select a valid PNG, JPEG, or SVG image.");
    }
  };

  const renderUploadBackgroundContent = () => {
    if (background) {
      return (
        <>
          <div>
            <Image
              width={64}
              height={64}
              className="h-16 w-auto"
              src={`data:image/png;base64,${background}`}
              alt="Upload"
            />
            <input
              id="dropzone-background-file"
              type="file"
              name="BackgroundSelector"
              style={{
                position: "absolute",
                padding: 0,
                border: 0,
                height: "1px",
                width: "1px",
                overflow: "hidden",
              }}
              className="hidden"
              onChange={(e) => handleBackgroundFileSelect(e)}
            />
          </div>
          <p className="text-gray-400 text-xs">{selectedBackgroundName}</p>
        </>
      );
    } else {
      return (
        <>
          <div>
            <Image
              width={24}
              height={24}
              className="h-6 w-6"
              src={Upload}
              alt="Upload"
            />
            <input
              id="dropzone-background-file"
              type="file"
              name="BackgroundSelector"
              style={{
                position: "absolute",
                padding: 0,
                border: 0,
                height: "1px",
                width: "1px",
                overflow: "hidden",
              }}
              className="hidden"
              onChange={(e) => handleBackgroundFileSelect(e)}
            />
          </div>
          <p className="text-sm">
            Click to upload or drag and drop your background
          </p>
          <p className="text-gray-400 text-xs">SVG, PNG, JPG (max. 5MB)</p>
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
        name="BackgroundSelector"
        type="file"
        className="hidden"
        onChange={(e) => handleBackgroundFileSelect(e)}
      />
    </label>
  );
};

const ProfileSelector = ({
  profile,
  handleProfile,
}: {
  profile: any;
  handleProfile: any;
}) => {
  const [selectedProfileName, setSelectedProfileName] = useState<any>(null);

  const handleProfileFileSelect = (e: any) => {
    e.preventDefault();
    const profileFile = e?.dataTransfer?.files?.[0] || e?.target?.files?.[0];

    const imageSizeMB = profileFile.size / (1024 * 1024); // Convert size to MB
    // console.log("imageSizeProfileMB", imageSizeMB);
    if (imageSizeMB > 5) return alert(`Image size is too large (max 5MB)`);

    if (profileFile && isImageValid(profileFile)) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(profileFile);

      img.onload = function () {
        // console.log(`img.width:${img.width} / img.height: ${img.height}`);
        if (img.width <= 800 && img.height <= 400) {
          setSelectedProfileName(profileFile.name);
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result as string;
            handleProfile(
              base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, "")
            );
          };
          reader.readAsDataURL(profileFile);
        } else {
          alert("Image dimensions must be less than 800x400 pixels.");
        }
      };
    } else {
      alert("Please select a valid PNG, JPEG, or SVG image.");
    }
  };

  const renderUploadProfileContent = () => {
    if (profile) {
      return (
        <>
          <div>
            <Image
              width={64}
              height={64}
              className="h-16 w-auto"
              src={`data:image/png;base64,${profile}`}
              alt="Upload"
            />
            <input
              id="dropzone-profile-file"
              type="file"
              name="ProfileSelector"
              style={{
                position: "absolute",
                padding: 0,
                border: 0,
                height: "1px",
                width: "1px",
                overflow: "hidden",
              }}
              className="hidden"
              onChange={(e) => handleProfileFileSelect(e)}
            />
          </div>
          <p className="text-gray-400 text-xs">{selectedProfileName}</p>
        </>
      );
    } else {
      return (
        <>
          <div>
            <Image
              width={24}
              height={24}
              className="h-6 w-6"
              src={Upload}
              alt="Upload"
            />
            <input
              id="dropzone-profile-file"
              type="file"
              name="ProfileSelector"
              style={{
                position: "absolute",
                padding: 0,
                border: 0,
                height: "1px",
                width: "1px",
                overflow: "hidden",
              }}
              className="hidden"
              accept=".png, .jpg, .jpeg, .svg"
              onChange={(e) => handleProfileFileSelect(e)}
            />
          </div>
          <p className="text-sm">
            Click to upload or drag and drop your profile picture
          </p>
          <p className="text-gray-500 text-xs">
            SVG, PNG, JPG (max. 800x400px)
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
    </label>
  );
};

const ThemeSection = ({
  theme,
  handleInputs,
}: {
  theme: string;
  handleInputs: any;
}) => {
  return (
    <div className={`flex flex-col w-full ${styles.autofill}`}>
      <p className="text-white text-sm font-normal mb-2">
        Choose Your Theme:{" "}
        <span className="text-gray-500">
          (See it live in the preview above)
        </span>
      </p>
      <div className="flex flex-col xl:flex-row gap-9 justify-center items-center">
        <label
          className={`relative flex flex-col w-full max-w-xs items-center p-7 bg-[#94A3B8] rounded-lg gap-6 cursor-pointer ${
            theme === "glassmorphsm" && "ring-4 ring-[#F97316]"
          }`}
        >
          <input
            type="radio"
            onChange={handleInputs}
            name="Theme"
            value="glassmorphsm"
            className="hidden"
          />
          <Image
            width={64}
            height={64}
            className="h-auto w-36 shrink-0 hover:shadow-xl"
            src={Glass}
            alt="Glassmorphsm"
          />
          <p
            className={`py-[6px] px-3 text-xs rounded-full font-semibold text-center hover:shadow-xl ${
              theme === "glassmorphsm" ? "bg-[#F97316] text-white" : "bg-white"
            }`}
          >
            Glassmorphsm
          </p>
          <Gradients />
        </label>
        <label
          className={`relative flex flex-col w-full max-w-xs items-center p-7 bg-[#94A3B8] rounded-lg gap-6 cursor-pointer ${
            theme === "light" && "ring-4 ring-[#F97316]"
          }`}
        >
          <input
            type="radio"
            onChange={handleInputs}
            name="Theme"
            value="light"
            className="hidden"
          />
          <Image
            width={64}
            height={64}
            className="h-auto w-36 shrink-0 hover:shadow-xl"
            src={Light}
            alt="Light Mode"
          />
          <p
            className={`py-[6px] px-3 text-xs rounded-full font-semibold text-center hover:shadow-xl ${
              theme === "light" ? "bg-[#F97316] text-white" : "bg-white"
            }`}
          >
            Light Mode
          </p>
          <Gradients />
        </label>
        <label
          className={`relative flex flex-col w-full max-w-xs items-center p-7 bg-[#94A3B8] rounded-lg gap-6 cursor-pointer ${
            theme === "dark" && "ring-4 ring-[#F97316]"
          }`}
        >
          <input
            type="radio"
            onChange={handleInputs}
            name="Theme"
            value="dark"
            className="hidden"
          />
          <Image
            width={64}
            height={64}
            className="h-auto w-36 shrink-0 hover:shadow-xl"
            src={Dark}
            alt="Dark Mode"
          />
          <p
            className={`py-[6px] px-3 text-xs rounded-full font-semibold text-center hover:shadow-xl ${
              theme === "dark" ? "bg-[#F97316] text-white" : "bg-white"
            }`}
          >
            Dark Mode
          </p>
          <Gradients />
        </label>
      </div>
    </div>
  );
};

const ButtonsSection = ({
  formState,
  handleInputs,
}: {
  formState: {
    title: string;
    background: string;
    body: string;
    theme: string;
    button1: string;
    button1Link: string;
    contactButton: string;
    contactButtonEmail: string;
    name: string;
    role: string;
    profilePicture: string;
    buttonBackgroundColor: string;
  };
  handleInputs: any;
}) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex flex-col w-full lg:w-1/2 ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">
            Main Button Text
          </p>
          <input
            required
            onChange={handleInputs}
            name="Button1"
            value={formState.button1}
            type="text"
            placeholder="Ex. Pay Me"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
        <div className={`flex flex-col w-full lg:w-1/2 ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">
            Main Button Link
          </p>
          <input
            required
            onChange={handleInputs}
            name="Button1Link"
            value={formState.button1Link}
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
            required
            onChange={handleInputs}
            name="ContactButton"
            value={formState.contactButton}
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
            required
            onChange={handleInputs}
            name="ContactButtonEmail"
            value={formState.contactButtonEmail}
            type="text"
            placeholder="Your Email Address Here"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({
  formState,
  handleInputs,
  handleProfile,
}: {
  formState: {
    title: string;
    background: string;
    body: string;
    theme: string;
    button1: string;
    button1Link: string;
    contactButton: string;
    contactButtonEmail: string;
    name: string;
    role: string;
    profilePicture: string;
    buttonBackgroundColor: string;
  };
  handleInputs: any;
  handleProfile: any;
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 my-6">
      <div className="flex flex-col w-full lg:w-1/2 gap-6">
        <div className={`flex flex-col  ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">Your Name</p>
          <input
            required
            onChange={handleInputs}
            name="Name"
            type="text"
            value={formState.name}
            placeholder="Ex. Elon Musk"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
        <div className={`flex flex-col  ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">Your Role</p>
          <input
            required
            onChange={handleInputs}
            name="Role"
            type="text"
            value={formState.role}
            placeholder="Ex. CEO of Tesla"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 gap-6">
        <ProfileSelector
          profile={formState.profilePicture}
          handleProfile={handleProfile}
        />
      </div>
    </div>
  );
};

const SubmitSection = ({
  handleBackgroundColor,
  selectText,
  isOwner,
  loading,
}: {
  handleBackgroundColor: any;
  selectText: any;
  isOwner: boolean;
  loading: boolean;
}) => {
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] =
    useState(false);
  const [backgroundColor, setColor] = useState("#FFFFFF");
  const backgroundColorPickerRef = useRef<HTMLDivElement | null>(null);

  const { isConnected } = useAccount();

  const handleBackgroundColorPicker = () => {
    setShowBackgroundColorPicker(!showBackgroundColorPicker); // Toggle color picker visibility
  };

  // Event listener to close color picker when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      if (
        backgroundColorPickerRef.current &&
        !backgroundColorPickerRef.current.contains(event.target)
      ) {
        setShowBackgroundColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:my-9 items-center lg:items-start justify-between gap-4 lg:gap-0">
      <div className="flex flex-col gap-4 items-center lg:items-start">
        <div className="flex flex-col gap-1">
          <p className="text-white text-sm font-normal">
            Main Button Background Color
          </p>
          <div className="flex flex-col-reverse lg:flex-row gap-1 items-center">
            <div
              onClick={handleBackgroundColorPicker}
              className={`h-5 w-5 rounded-md`}
              style={{ backgroundColor: backgroundColor }}
            ></div>
            <div className="relative -left-[100px] lg:-left-[115px] top-9 lg:top-5">
              {showBackgroundColorPicker && (
                <div
                  ref={backgroundColorPickerRef}
                  className="absolute  shadow-xl"
                >
                  <HexColorPicker
                    color={backgroundColor}
                    onChange={(updatedColor) => {
                      setColor(updatedColor);
                      handleBackgroundColor(updatedColor);
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-gray-300 text-sm font-medium leading-tight bg-transparent max-w-[70px] focus:outline-none">
              {backgroundColor}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 lg:mx-8">
        <span className="text-gray-400 text-sm">
          You will be minting this website on
        </span>
        <p
          className="text-white text-sm font-normal"
          style={{ wordBreak: "break-word" }}
        >
          {selectText
            ? "https://app.flrns.domains/" + selectText + ".flr"
            : "https://app.flrns.domains/example.flr"}
        </p>
      </div>
      <div className="flex justify-center lg:justify-normal shrink-0">
        <button
          type="submit"
          disabled={!isConnected || !isOwner || loading}
          className="flex  items-center justify-center gap-2 bg-[#F97316] disabled:brightness-125 py-3 px-5 w-[13rem] text-center rounded-md text-white font-normal hover:brightness-110"
        >
          <p className="flex">{loading ? `Minting` : `Mint Website Now`}</p>

          {loading ? (
            <svg
              aria-hidden="true"
              className={`ml-2 w-4 h-4 text-[#ffffff] dark:text-gray-500 animate-spin fill-[#ffffff]`}
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentFill"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#F97316"
              />
            </svg>
          ) : (
            <Image
              width={64}
              height={64}
              className="h-5 w-5"
              src={ArrowRight}
              alt="Arrow"
            />
          )}
        </button>
      </div>
    </div>
  );
};

function WebBuilderForm({
  formState,
  handleInputs,
  handleBackground,
  handleProfile,
  handleBackgroundColor,
  selectText,
  isOwner,
  loading,
  mintWebsite,
}: {
  formState: {
    title: string;
    background: string;
    body: string;
    theme: string;
    button1: string;
    button1Link: string;
    contactButton: string;
    contactButtonEmail: string;
    name: string;
    role: string;
    profilePicture: string;
    buttonBackgroundColor: string;
  };
  handleInputs: any;
  handleBackground: any;
  handleProfile: any;
  handleBackgroundColor: any;
  selectText: any;
  isOwner: boolean;
  loading: boolean;
  mintWebsite: (e: any) => Promise<false | undefined>;
}) {
  return (
    <div>
      <form onSubmit={mintWebsite} action="" className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className={`flex flex-col w-full lg:w-1/2 ${styles.autofill}`}>
            <h1
              className="text-white font-semibold text-4xl mb-6"
              style={{ wordBreak: "break-word" }}
            >
              {selectText ? selectText + ".flr" : "Example.flr"}
            </h1>
            <p className="text-white text-sm font-normal mb-2">Title Text</p>
            <input
              required
              onChange={handleInputs}
              name="Title"
              type="text"
              value={formState.title}
              placeholder="Enter your title here"
              className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
            />
          </div>
          <BackgroundSelector
            background={formState.background}
            handleBackground={handleBackground}
          />
        </div>
        <div className={`flex flex-col w-full ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">Body Text</p>
          <textarea
            required
            onChange={handleInputs}
            name="Body"
            value={formState.body}
            placeholder="Type your body text for the website here"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
        <ThemeSection theme={formState.theme} handleInputs={handleInputs} />
        <ButtonsSection formState={formState} handleInputs={handleInputs} />
        <ProfileSection
          formState={formState}
          handleInputs={handleInputs}
          handleProfile={handleProfile}
        />
        <SubmitSection
          handleBackgroundColor={handleBackgroundColor}
          selectText={selectText}
          isOwner={isOwner}
          loading={loading}
        />
      </form>
    </div>
  );
}

export default WebBuilderForm;

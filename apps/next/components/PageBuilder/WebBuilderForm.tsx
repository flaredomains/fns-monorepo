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

const BackgroundSelector = ({
  handleBackground,
}: {
  handleBackground: any;
}) => {
  const [selectedBackgroundFile, setSelectedBackgroundFile] =
    useState<any>(null);

  const [selectedBackgroundName, setSelectedBackgroundName] =
    useState<any>(null);

  const handleBackgroundFileSelect = (e: any) => {
    e.preventDefault();
    const backgroundFile = e?.dataTransfer?.files?.[0] || e?.target?.files?.[0];

    // console.log("backgroundFile", backgroundFile);

    if (backgroundFile) {
      setSelectedBackgroundName(backgroundFile.name);
      const reader = new FileReader();

      const background = document.createElement("img");
      background.src = URL.createObjectURL(backgroundFile);

      background.onload = () => {
        const aspectRatio = background.width / background.height;
        if (aspectRatio >= 1 && aspectRatio <= 1.8) {
          reader.onload = () => {
            const base64String = reader.result as string;
            // console.log("base64String", base64String);
            console.log(
              "base64String background",
              base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, "")
            );
            setSelectedBackgroundFile(base64String);
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
      alert("Image aspect ratio must be between 1:1 and 1:1.8");
    }

    // Check the aspect ratio before setting the selected file
    // if (backgroundFile) {
    //   const background = document.createElement("img");
    //   background.src = URL.createObjectURL(backgroundFile);
    //   background.onload = () => {
    //     const aspectRatio = background.width / background.height;

    //     console.log(
    //       `${aspectRatio}/aspectRatio = ${background.width}/background.width  / ${background.height}/background.height`
    //     );
    //     if (aspectRatio >= 1 && aspectRatio <= 1.8) {
    //       setSelectedBackgroundFile(backgroundFile);
    //       handleBackground(background.src);
    //     } else {
    //       alert("Image aspect ratio must be between 1:1 and 1:1.8");
    //     }
    //   };
    // }
  };

  const renderUploadBackgroundContent = () => {
    if (selectedBackgroundFile) {
      // const imageBackgroundUrl = URL.createObjectURL(selectedBackgroundFile); // Generate temporary URL for the selected file
      return (
        <>
          <div>
            <Image
              width={64}
              height={64}
              className="h-16 w-auto"
              src={selectedBackgroundFile}
              alt="Upload"
            />
            <input
              required
              id="dropzone-background-file"
              type="file"
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
              required
              id="dropzone-background-file"
              type="file"
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
        required
        id="dropzone-background-file"
        type="file"
        className="hidden"
        onChange={(e) => handleBackgroundFileSelect(e)}
      />
    </label>
  );
};

const ProfileSelector = ({ handleProfile }: { handleProfile: any }) => {
  const [selectedProfileFile, setSelectedProfileFile] = useState<any>(null);
  const [selectedProfileName, setSelectedProfileName] = useState<any>(null);

  const handleProfileFileSelect = (e: any) => {
    e.preventDefault();
    const profileFile = e?.dataTransfer?.files?.[0] || e?.target?.files?.[0];
    // console.log("profileFile", profileFile);

    // Check the aspect ratio before setting the selected file
    if (profileFile) {
      setSelectedProfileName(profileFile.name);
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // console.log("base64String", base64String);
        console.log(
          "base64String profile",
          base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, "")
        );
        setSelectedProfileFile(base64String);
        handleProfile(
          base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, "")
        );
      };
      reader.readAsDataURL(profileFile);
    } else {
      alert("SVG, PNG, JPG (max. 800x400px)");
    }

    // if (profileFile) {
    // const image = document.createElement("img");
    //   image.src = URL.createObjectURL(profileFile);
    //   image.onload = () => {
    //     if (
    //       (profileFile.type === "image/png" ||
    //         profileFile.type === "image/jpeg" ||
    //         profileFile.type === "image/svg") &&
    //       (image.width < 800 || image.height < 400)
    //     ) {
    //       setSelectedProfileFile(profileFile);
    //       handleProfile(image.src);
    //     } else {
    //       alert("SVG, PNG, JPG (max. 800x400px)");
    //     }
    //   };
  };

  const renderUploadProfileContent = () => {
    // console.log("selectedProfileFile", selectedProfileFile);
    if (selectedProfileFile) {
      // const imageUrl = URL.createObjectURL(selectedProfileFile); // Generate temporary URL for the selected file
      return (
        <>
          <div>
            <Image
              width={64}
              height={64}
              className="h-16 w-auto"
              src={selectedProfileFile}
              alt="Upload"
            />
            <input
              required
              id="dropzone-profile-file"
              type="file"
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
              required
              id="dropzone-profile-file"
              type="file"
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

const ThemeSection = ({ handleInputs }: { handleInputs: any }) => {
  const [selectedTheme, setSelectedTheme] = useState("glassmorphsm");

  const handleThemeChange = (selectedTheme: string) => {
    setSelectedTheme(selectedTheme);
  };
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
          onClick={() => handleThemeChange("glassmorphsm")}
          className={`relative flex flex-col w-full max-w-xs items-center p-7 bg-[#94A3B8] rounded-lg gap-6 cursor-pointer ${
            selectedTheme === "glassmorphsm" && "ring-4 ring-[#F97316]"
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
              selectedTheme === "glassmorphsm"
                ? "bg-[#F97316] text-white"
                : "bg-white"
            }`}
          >
            Glassmorphsm
          </p>
          <Gradients />
        </label>
        <label
          onClick={() => handleThemeChange("light")}
          className={`relative flex flex-col w-full max-w-xs items-center p-7 bg-[#94A3B8] rounded-lg gap-6 cursor-pointer ${
            selectedTheme === "light" && "ring-4 ring-[#F97316]"
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
              selectedTheme === "light" ? "bg-[#F97316] text-white" : "bg-white"
            }`}
          >
            Light Mode
          </p>
          <Gradients />
        </label>
        <label
          onClick={() => handleThemeChange("dark")}
          className={`relative flex flex-col w-full max-w-xs items-center p-7 bg-[#94A3B8] rounded-lg gap-6 cursor-pointer ${
            selectedTheme === "dark" && "ring-4 ring-[#F97316]"
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
              selectedTheme === "dark" ? "bg-[#F97316] text-white" : "bg-white"
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

const ButtonsSection = ({ handleInputs }: { handleInputs: any }) => {
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
  handleInputs,
  handleProfile,
}: {
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
            placeholder="Ex. CEO of Tesla"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 gap-6">
        <ProfileSelector handleProfile={handleProfile} />
      </div>
    </div>
  );
};

const SubmitSection = ({
  handleBackgroundColor,
  selectText,
  mintWebsite,
}: {
  handleBackgroundColor: any;
  selectText: any;
  mintWebsite: () => Promise<void>;
}) => {
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] =
    useState(false);
  const [backgroundColor, setColor] = useState("#FFFFFF");
  const backgroundColorPickerRef = useRef<HTMLDivElement | null>(null);

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
        {/* TODO put security requirement:
          1) the wallet is connected
          2) the domain belongs to the owner (to refetch the READ call every time the user change the owned domain)
          3) All forms fields are required */}
        <button
          onClick={() => mintWebsite()}
          className="flex lg:w-full items-center gap-2 bg-[#F97316] py-3 px-5 rounded-md text-white font-normal hover:brightness-110"
        >
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

function WebBuilderForm({
  handleInputs,
  handleBackground,
  handleProfile,
  handleBackgroundColor,
  selectText,
  mintWebsite,
}: {
  handleInputs: any;
  handleBackground: any;
  handleProfile: any;
  handleBackgroundColor: any;
  selectText: any;
  mintWebsite: () => Promise<void>;
}) {
  return (
    <div>
      <form action="" className="flex flex-col gap-6">
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
              placeholder="Enter your title here"
              className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
            />
          </div>
          <BackgroundSelector handleBackground={handleBackground} />
        </div>
        <div className={`flex flex-col w-full ${styles.autofill}`}>
          <p className="text-white text-sm font-normal mb-2">Body Text</p>
          <textarea
            required
            onChange={handleInputs}
            name="Body"
            placeholder="Type your body text for the website here"
            className="text-white bg-[#344054] rounded-lg py-2 px-3 border border-[#667085] focus:outline-none"
          />
        </div>
        <ThemeSection handleInputs={handleInputs} />
        <ButtonsSection handleInputs={handleInputs} />
        <ProfileSection
          handleInputs={handleInputs}
          handleProfile={handleProfile}
        />
        <SubmitSection
          handleBackgroundColor={handleBackgroundColor}
          selectText={selectText}
          mintWebsite={mintWebsite}
        />
      </form>
    </div>
  );
}

export default WebBuilderForm;

import { useState, Dispatch, SetStateAction } from "react";

import { usePrepareContractWrite } from "wagmi";

// ABIS
import PublicResolver from "../../src/pages/abi/PublicResolver.json";

interface UpdateFunctions {
  [key: string]: Dispatch<SetStateAction<any>>;
}

function usePrepareMulticall(initialValue: {
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
}) {
  const [nameHash, setNameHash] = useState(""); // State variable for WRITE call on setText funciton
  const [keccakImageWebsite, setKeccakImageWebsite] = useState(""); // For uuid Image Website to put on Cloudflare database
  const [keccakImageAvatar, setKeccakImageAvatar] = useState(""); // For uuid Avatar Website to put on Cloudflare database
  const [formState, setFormState] = useState(initialValue);

  const updateFunctions: UpdateFunctions = {
    Title: (value) =>
      setFormState((prevState) => ({ ...prevState, title: value })),
    Body: (value) =>
      setFormState((prevState) => ({ ...prevState, body: value })),
    Background: (value) =>
      setFormState((prevState) => ({ ...prevState, background: value })),
    Theme: (value) =>
      setFormState((prevState) => ({ ...prevState, theme: value })),
    Button1: (value) =>
      setFormState((prevState) => ({ ...prevState, button1: value })),
    Button1Link: (value) =>
      setFormState((prevState) => ({ ...prevState, button1Link: value })),
    ContactButton: (value) =>
      setFormState((prevState) => ({ ...prevState, contactButton: value })),
    ContactButtonEmail: (value) =>
      setFormState((prevState) => ({
        ...prevState,
        contactButtonEmail: value,
      })),
    Name: (value) =>
      setFormState((prevState) => ({ ...prevState, name: value })),
    Role: (value) =>
      setFormState((prevState) => ({ ...prevState, role: value })),
    ProfilePicture: (value) =>
      setFormState((prevState) => ({ ...prevState, profilePicture: value })),
    ButtonBackgroundColor: (value) =>
      setFormState((prevState) => ({
        ...prevState,
        buttonBackgroundColor: value,
      })),
  };

  const resetValue = () => {
    updateFunctions["Title"]("");
    updateFunctions["Body"]("");
    updateFunctions["Background"]("");
    updateFunctions["Theme"]("glassmorphsm");
    updateFunctions["Button1"]("");
    updateFunctions["Button1Link"]("");
    updateFunctions["ContactButton"]("");
    updateFunctions["ContactButtonEmail"]("");
    updateFunctions["Name"]("");
    updateFunctions["Role"]("");
    updateFunctions["ProfilePicture"]("");
    updateFunctions["ButtonBackgroundColor"]("#FFFFFF");
  };

  // "website.titleText",
  // "website.bgPhotoHash",
  // "website.body",
  // "website.theme",
  // "website.button1",
  // "website.button1Link",
  // "website.contactButton",
  // "website.contactButtonEmail",
  // "website.name",
  // "website.role",
  // "website.profilePicture",
  // "website.buttonBackgroundColor",

  // Title
  const { config: prepareSetTitle } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.titleText", formState.title],
    enabled: formState.title !== undefined && formState.title !== "",
    onSuccess(data: any) {
      // console.log("Success prepareSetTitle", data.request.data);
      // preparationMulticall["prepareSetTitle"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareSetTitle", error);
    },
  });

  // Image Website
  const { config: prepareSetBgPhotoHash } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.bgPhotoHash", keccakImageWebsite],
    enabled: formState.background !== undefined && formState.background !== "",
    onSuccess(data: any) {
      // console.log("Success prepareSetBgPhotoHash", data.request.data);
      // preparationMulticall["prepareSetBgPhotoHash"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareSetBgPhotoHash", error);
    },
  });

  // Body
  const { config: prepareSetBody } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.body", formState.body],
    enabled: formState.body !== undefined && formState.body !== "",
    onSuccess(data: any) {
      // console.log("Success prepareSetBody", data.request.data);
      // preparationMulticall["prepareSetBody"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareSetBody", error);
    },
  });

  // Theme
  const { config: prepareTheme } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.theme", formState.theme],
    // enabled: formState.body !== undefined,
    onSuccess(data: any) {
      // console.log("Success prepareTheme", data.request.data);
      // preparationMulticall["prepareTheme"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareTheme", error);
    },
  });

  // Theme
  const { config: prepareButton1 } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.button1", formState.button1],
    enabled: formState.button1 !== undefined && formState.button1 !== "",
    onSuccess(data: any) {
      // console.log("Success prepareButton1", data.request.data);
      // preparationMulticall["prepareButton1"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareButton1", error);
    },
  });

  const { config: prepareButton1Link } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.button1Link", formState.button1Link],
    enabled:
      formState.button1Link !== undefined && formState.button1Link !== "",
    onSuccess(data: any) {
      // console.log("Success prepareButton1Link", data.request.data);
      // preparationMulticall["prepareButton1Link"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareButton1Link", error);
    },
  });

  const { config: prepareContactButton } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.contactButton", formState.contactButton],
    enabled:
      formState.contactButton !== undefined && formState.contactButton !== "",
    onSuccess(data: any) {
      // console.log("Success prepareContactButton", data.request.data);
      // preparationMulticall["prepareContactButton"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareContactButton", error);
    },
  });

  const { config: prepareContactButtonEmail } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [
      nameHash,
      "website.contactButtonEmail",
      formState.contactButtonEmail,
    ],
    enabled:
      formState.contactButtonEmail !== undefined &&
      formState.contactButtonEmail !== "",
    onSuccess(data: any) {
      // console.log("Success prepareContactButtonEmail", data.request.data);
      // preparationMulticall["prepareContactButtonEmail"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareContactButtonEmail", error);
    },
  });

  const { config: prepareName } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.name", formState.name],
    enabled: formState.name !== undefined && formState.name !== "",
    onSuccess(data: any) {
      // console.log("Success prepareName", data.request.data);
      // preparationMulticall["prepareName"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareName", error);
    },
  });

  const { config: prepareRole } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.role", formState.role],
    enabled: formState.role !== undefined && formState.role !== "",
    onSuccess(data: any) {
      // console.log("Success prepareRole", data.request.data);
      // preparationMulticall["prepareRole"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareRole", error);
    },
  });

  const { config: prepareProfilePicture } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [nameHash, "website.profilePicture", keccakImageAvatar],
    enabled:
      formState.profilePicture !== undefined && formState.profilePicture !== "",
    onSuccess(data: any) {
      // console.log("Success prepareProfilePicture", data.request.data);
      // preparationMulticall["prepareProfilePicture"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareProfilePicture", error);
    },
  });

  const { config: prepareButtonBackgroundColor } = usePrepareContractWrite({
    address: PublicResolver.address as `0x${string}`,
    abi: PublicResolver.abi,
    functionName: "setText",
    args: [
      nameHash,
      "website.buttonBackgroundColor",
      formState.buttonBackgroundColor,
    ],
    onSuccess(data: any) {
      // console.log("Success prepareButtonBackgroundColor", data.request.data);
      // preparationMulticall["prepareButtonBackgroundColor"](data.request.data);
    },
    onError(error) {
      console.log("Error prepareButtonBackgroundColor", error);
    },
  });

  return {
    formState,
    nameHash,
    keccakImageWebsite,
    keccakImageAvatar,
    prepareSetTitle,
    prepareSetBgPhotoHash,
    prepareSetBody,
    prepareTheme,
    prepareButton1,
    prepareButton1Link,
    prepareContactButton,
    prepareContactButtonEmail,
    prepareName,
    prepareRole,
    prepareProfilePicture,
    prepareButtonBackgroundColor,
    updateFunctions,
    setNameHash,
    setKeccakImageWebsite,
    setKeccakImageAvatar,
    resetValue,
  };
}

export default usePrepareMulticall;

// const [prepareMulticallArgs, setPrepareMulticallArgs] = useState({
//   prepareSetTitle,
//   prepareSetBgPhotoHash,
//   prepareSetBody,
//   prepareTheme,
//   prepareButton1,
//   prepareButton1Link,
//   prepareContactButton,
//   prepareContactButtonEmail,
//   prepareName,
//   prepareRole,
//   prepareProfilePicture,
//   prepareButtonBackgroundColor,
// });

// const preparationMulticall: UpdateFunctions = {
//   prepareSetTitle: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareSetTitle: value,
//     })),
//   prepareSetBgPhotoHash: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareSetBgPhotoHash: value,
//     })),
//   prepareSetBody: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareSetBody: value,
//     })),
//   prepareTheme: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareTheme: value,
//     })),
//   prepareButton1: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareButton1: value,
//     })),
//   prepareButton1Link: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareButton1Link: value,
//     })),
//   prepareContactButton: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareContactButton: value,
//     })),
//   prepareContactButtonEmail: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareContactButtonEmail: value,
//     })),
//   prepareName: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareName: value,
//     })),
//   prepareRole: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareRole: value,
//     })),
//   prepareProfilePicture: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareProfilePicture: value,
//     })),
//   prepareButtonBackgroundColor: (value) =>
//     setPrepareMulticallArgs((prevState) => ({
//       ...prevState,
//       prepareButtonBackgroundColor: value,
//     })),
// };

// prepareSetTitle,
//   prepareSetBgPhotoHash,
//   prepareSetBody,
//   prepareTheme,
//   prepareButton1,
//   prepareButton1Link,
//   prepareContactButton,
//   prepareContactButtonEmail,
//   prepareName,
//   prepareRole,
//   prepareProfilePicture,
//   prepareButtonBackgroundColor,

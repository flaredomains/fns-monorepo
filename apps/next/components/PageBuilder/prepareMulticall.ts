import { useState, Dispatch, SetStateAction, useEffect } from "react";

import { usePrepareContractWrite } from "wagmi";
import { encodeFunctionData } from "viem";

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
    updateFunctions["Theme"]("glassmorphism");
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

  // const data = encodeFunctionData({
  //   abi: PublicResolver.abi,
  //   functionName: "setText",
  //   args: [nameHash, "website.titleText", formState.title],
  // });

  // console.log("data", data);

  const [prepareMulticallArgs, setPrepareMulticallArgs] = useState({
    prepareSetTitle: "",
    prepareSetBgPhotoHash: "",
    prepareSetBody: "",
    prepareTheme: "",
    prepareButton1: "",
    prepareButton1Link: "",
    prepareContactButton: "",
    prepareContactButtonEmail: "",
    prepareName: "",
    prepareRole: "",
    prepareProfilePicture: "",
    prepareButtonBackgroundColor: "",
  });

  const preparationMulticall: UpdateFunctions = {
    prepareSetTitle: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareSetTitle: value,
      })),
    prepareSetBgPhotoHash: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareSetBgPhotoHash: value,
      })),
    prepareSetBody: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareSetBody: value,
      })),
    prepareTheme: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareTheme: value,
      })),
    prepareButton1: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareButton1: value,
      })),
    prepareButton1Link: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareButton1Link: value,
      })),
    prepareContactButton: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareContactButton: value,
      })),
    prepareContactButtonEmail: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareContactButtonEmail: value,
      })),
    prepareName: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareName: value,
      })),
    prepareRole: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareRole: value,
      })),
    prepareProfilePicture: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareProfilePicture: value,
      })),
    prepareButtonBackgroundColor: (value) =>
      setPrepareMulticallArgs((prevState) => ({
        ...prevState,
        prepareButtonBackgroundColor: value,
      })),
  };

  useEffect(() => {
    if (nameHash !== "" && formState.title !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [nameHash, "website.titleText", formState.title],
      });
      preparationMulticall["prepareSetTitle"](encodedData);
    }
  }, [nameHash, formState.title])

  useEffect(() => {
    if (nameHash !== "" && keccakImageWebsite !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [nameHash, "website.bgPhotoHash", keccakImageWebsite],
      });
      preparationMulticall["prepareSetBgPhotoHash"](encodedData);
    }
  }, [nameHash, keccakImageWebsite])

  useEffect(() => {
    if (nameHash !== "" && formState.body !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [nameHash, "website.body", formState.body],
      });
      preparationMulticall["prepareSetBody"](encodedData);
    }
  }, [nameHash, formState.body])

  useEffect(() => {
    if (nameHash !== "" && formState.theme !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [nameHash, "website.theme", formState.theme],
      });
      preparationMulticall["prepareTheme"](encodedData);
    }
  }, [nameHash, formState.theme])

  useEffect(() => {
    if (nameHash !== "" && formState.button1 !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [nameHash, "website.button1", formState.button1],
      });
      preparationMulticall["prepareButton1"](encodedData);
    }
  }, [nameHash, formState.button1])

  useEffect(() => {
    if (nameHash !== "" && formState.button1Link !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [nameHash, "website.button1Link", formState.button1Link],
      });
      preparationMulticall["prepareButton1Link"](encodedData);
    }
  }, [nameHash, formState.button1Link])

  useEffect(() => {
    if (nameHash !== "" && formState.contactButton !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [nameHash, "website.contactButton", formState.contactButton],
      });
      preparationMulticall["prepareContactButton"](encodedData);
    }
  }, [nameHash, formState.contactButton])

  useEffect(() => {
    if (nameHash !== "" && formState.contactButtonEmail !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [
          nameHash,
          "website.contactButtonEmail",
          formState.contactButtonEmail,
        ],
      });
      preparationMulticall["prepareContactButtonEmail"](encodedData);
    }
  }, [nameHash, formState.contactButtonEmail])

  useEffect(() => {
    if (nameHash !== "" && formState.name !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [nameHash, "website.name", formState.name],
      });
      preparationMulticall["prepareName"](encodedData);
    }
  }, [nameHash, formState.name])

  useEffect(() => {
    if (nameHash !== "" && formState.role !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [nameHash, "website.role", formState.role],
      });
      preparationMulticall["prepareRole"](encodedData);
    }
  }, [nameHash, formState.role])

  useEffect(() => {
    if (nameHash !== "" && formState.profilePicture !== "") {
    const encodedData = encodeFunctionData({
      abi: PublicResolver.abi,
      functionName: "setText",
      args: [nameHash, "website.profilePicture", keccakImageAvatar],
    });
    preparationMulticall["prepareProfilePicture"](encodedData);
  }
  }, [nameHash, formState.profilePicture, keccakImageAvatar])

  useEffect(() => {
    if (nameHash !== "" && formState.buttonBackgroundColor !== "") {
      const encodedData = encodeFunctionData({
        abi: PublicResolver.abi,
        functionName: "setText",
        args: [
          nameHash,
          "website.buttonBackgroundColor",
          formState.buttonBackgroundColor,
        ],
      });
      preparationMulticall["prepareButtonBackgroundColor"](encodedData);
    }
  }, [nameHash, formState.buttonBackgroundColor])

  return {
    formState,
    nameHash,
    keccakImageWebsite,
    keccakImageAvatar,
    prepareMulticallArgs,
    updateFunctions,
    setNameHash,
    setKeccakImageWebsite,
    setKeccakImageAvatar,
    resetValue,
  };
}

export default usePrepareMulticall;

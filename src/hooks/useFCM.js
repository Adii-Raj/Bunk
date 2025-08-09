import { requestPermission, listenForMessages } from "../firebaseConfig";
import { useEffect } from "react";

export const useFCM = () => {
  useEffect(() => {
    requestPermission();
    listenForMessages();
  }, []);

  return null; // This hook runs side effects only
};

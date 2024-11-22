import { useState } from "react";

const getSessionFromLocalStorage = () => {
  const savedSession = localStorage.getItem("userSession");

  if (savedSession) {
    return JSON.parse(savedSession);
  }

  return undefined;
};

const saveSessionToLocalStorage = (newSession) => {
  localStorage.setItem("userSession", JSON.stringify(newSession));
};

const useSession = () => {
  const [session, setSession] = useState(getSessionFromLocalStorage());

  const saveSession = (apiResponse) => {
    const newSession = {
      email: apiResponse.data.email,
      role: apiResponse.data.role,
    };

    setSession(newSession);
    saveSessionToLocalStorage(newSession);
  };

  return { session, saveSession };
};

export default useSession;

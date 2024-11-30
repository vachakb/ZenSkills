import { useEffect, useState } from "react";
import { getUserProfile } from "../apis/user";

const useProfile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    let ignore = false;

    getUserProfile().then((res) => {
      if (!ignore) {
        setProfile(res.data.profile);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  return profile;
};

export default useProfile;

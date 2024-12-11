import { useEffect, useState } from "react";
import { getUserProfile } from "../apis/user";

const useProfile = () => {
  const [profile, setProfile] = useState({});
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const refetchProfile = () => {
    setIsProfileLoading(true);

     getUserProfile().then((res) => {
        res.data.profile.isMentor = res.data.profile.role === "mentor";
        setProfile(res.data.profile);
        setIsProfileLoading(false)
    });
  }

  useEffect(() => {
    let ignore = false;

    setIsProfileLoading(true);

    getUserProfile().then((res) => {
      if (!ignore) {
        res.data.profile.isMentor = res.data.profile.role === "mentor";
        setProfile(res.data.profile);
        setIsProfileLoading(false)
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  return { profile, isProfileLoading, refetchProfile };
};

export default useProfile;

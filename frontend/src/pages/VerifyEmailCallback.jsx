import { useNavigate, useSearchParams } from "react-router-dom";
import { verificationEmailCallback } from "../apis/user";
import { useEffect } from "react";
import useSession from "../hooks/useSession";

function VerifyEmailCallback() {
  const [searchParams, _] = useSearchParams();

  const navigate = useNavigate();

  const { saveSession } = useSession();

  useEffect(() => {
    verificationEmailCallback(searchParams.get("token")).then((res) => {
      saveSession(res);
      navigate("/register/1");
    });
  }, [searchParams]);

  return (
    <div className="d-flex justify-content-center align-items-center vw-100 vh-100">
      <h1>Verifying email, please wait...</h1>
    </div>
  );
}

export default VerifyEmailCallback;

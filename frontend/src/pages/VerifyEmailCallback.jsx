import { useNavigate, useSearchParams } from "react-router-dom";
import { verificationEmailCallback } from "../apis/user";
import { useEffect } from "react";

function VerifyEmailCallback() {
  const [searchParams, _] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    verificationEmailCallback(searchParams.get("token")).then(() =>
      navigate("/register/1"),
    );
  }, [searchParams]);

  return <h1>Verifying...</h1>;
}

export default VerifyEmailCallback;

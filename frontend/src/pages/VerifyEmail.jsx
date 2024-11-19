import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { sendVerificationEmail } from "../apis/user";
import { useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const prevForm = useLocation().state;

  const onLoad = () => {
    sendVerificationEmail(prevForm.email)
      .catch(err => console.error(err));
  }

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Container>
      <h1>You will soon get a verification email.</h1>
    </Container>
  );
};

export default VerifyEmail;

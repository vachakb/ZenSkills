import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info"); // Bootstrap variant for alerts
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Invalid or missing token.");
        setVariant("danger");
        setLoading(false);
        return;
      }

      try {
        // Send the token to your backend to verify the email
        const response = await axios.get(
          `http://localhost:5000/auth/verify-email?token=${token}`
        );

        // Extract message and email from response
        setMessage(response.data.message || "Email verified successfully!");
        setVariant("success");
        setLoading(false);

        // Extract the email from the response data and forward it to the next page
        const email = response.data.email;
        if (email) {
          // Navigate to the next page and pass the email
          setTimeout(() => {
            navigate("/register/1", { state: { email } });
          }, 3000);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setMessage(
          error.response?.data?.message ||
            "Failed to verify email. Please try again."
        );
        setVariant("danger");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p>Verifying your email...</p>
        </div>
      ) : (
        <Alert variant={variant}>{message}</Alert>
      )}
    </Container>
  );
};

export default VerifyEmail;

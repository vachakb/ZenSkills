const nodemailer = require("nodemailer");

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your app password
    },
  });

  try {
    await transporter.sendMail({
      from: '"Test Email" <your-email@gmail.com>', // Sender address
      to: "recipient@example.com", // Receiver address
      subject: "Hello ✔", // Subject line
      text: "Hello world!", // Plain text body
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();

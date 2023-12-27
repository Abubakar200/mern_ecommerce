import nodeMailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: "smtp.gmail.com",
    port:465,
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // await transporter.sendMail(mailOptions);
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Handle the error, either by logging or throwing it
    console.error(`Error sending email: ${error.message}`);
    throw new Error("Failed to send email");
  }
};

const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

let attempts = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iss.cics@ust.edu.ph",
    pass: "app-password"
  }
});

app.post("/login", (req, res) => {
  const { password, ip } = req.body;

  if (!attempts[ip]) attempts[ip] = 0;

  if (password === "iss-nexus-admin") {
    attempts[ip] = 0;
    return res.json({ success: true });
  }

  attempts[ip]++;

  if (attempts[ip] >= 3) {
    transporter.sendMail({
  from: '"ISS Admin System" <iss.cics@ust.edu.ph>',
  to: "iss.cics@ust.edu.ph",
  subject: "Admin Login Alert",
  text: `3 failed login attempts detected from IP: ${ip}`
});
  }

  res.json({
    success: false,
    attemptsLeft: 3 - attempts[ip]
  });
});

app.listen(3000);

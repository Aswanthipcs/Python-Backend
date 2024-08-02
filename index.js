const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  emailTemplate1,
  emailTemplate2,
  emailTemplate3,
} = require("./util/template");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://python-landing-page.vercel.app",
    "http://python-campaign.ipcsglobal.com",
    "https://python-campaign.ipcsglobal.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
// app.use(cors("*"));
app.use(bodyParser.json());
const accountSid = "AC2776c6a162fda0e2ea3a7843d3c61e17";
const authToken = "a1b815930d8b7e7dd1f0ab94f341e7c6";
const client = require("twilio")(accountSid, authToken);

const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

function formatPhoneNumber(phoneNumber) {
  if (phoneNumber.length === 10) {
    phoneNumber = "91" + phoneNumber;
  } else if (phoneNumber.length === 12 && phoneNumber.startsWith("91")) {
    // Phone number is already in the correct format
  } else {
    throw new Error("Invalid phone number length");
  }

  let country = phoneNumber.slice(0, 2);
  let part1 = phoneNumber.slice(2, 7);
  let part2 = phoneNumber.slice(7, 12);

  return `+${country} ${part1} ${part2}`;
}


app.post("/api/send-email2", (req, res) => {
  const { name, email, phone, qualification, location, form } = req.body;

  let emailHtml;
  if (form === "Register") {
    emailHtml = emailTemplate1
      .replace("{{name}}", name)
      .replace("{{email}}", email)
      .replace("{{phone}}", phone)
      .replace("{{qualification}}", qualification)
      .replace("{{location}}", location);
  } else if (form === "Offer") {
    emailHtml = emailTemplate2
      .replace("{{name}}", name)
      .replace("{{phone}}", phone);
  } else if (form === "Brochure") {
    emailHtml = emailTemplate3
      .replace("{{name}}", name)
      .replace("{{email}}", email)
      .replace("{{phone}}", phone);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ipcsglobalindia@gmail.com",
      pass: "nnpd xhea roak mbbk",
    },
  });

  const mailOptions = {
    from: "ipcsglobalindia@gmail.com",
    to: ["ipcsdeveloper@gmail.com","dmmanager.ipcs@gmail.com"],
    subject: "New Lead Form Submission on ",
    html: emailHtml,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

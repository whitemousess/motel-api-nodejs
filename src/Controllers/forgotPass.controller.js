const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");

const userModel = require("../models/user.model");
const forgotPasswordModel = require("../models/forgotPassword.model");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_FORGOT,
    pass: process.env.PASS_FORGOT,
  },
});

function generateRandomNumber() {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, Math.floor(Math.random() * 10000));
}

function sendEmail(email, code, username, callback) {
  const mailOptions = {
    from: "motel-rho.vercel.app",
    to: email,
    subject: "Tạo lại mật khẩu",
    text: `
    Bạn đang yêu cầu tạo lại mật khẩu với tài khoản : ${username}
    Mã chỉ tồn tại trong 5 phút .
    Mã xác minh của bạn là : ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      callback(error, null);
    } else {
      callback(null, "Email sent: " + info.response);
    }
  });
}

module.exports = {
  sendCode(req, res, next) {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const clearCode = (id) => {
      forgotPasswordModel.findByIdAndDelete(id).catch((err) => {
        console.log(err);
      });
    };

    const numberRandom = parseInt(generateRandomNumber());

    const handleSendEmail = (username) => {
      sendEmail(email, numberRandom, username, (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Failed to send email." });
        }
        const forgot = new forgotPasswordModel({
          codeReset: numberRandom,
          email: req.body.email,
        });
        forgot
          .save()
          .then((dataForgot) => {
            setTimeout(() => {
              clearCode(dataForgot._id);
            }, 5 * 60 * 1000);
            res.status(200).json({ data: dataForgot });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    };

    userModel
      .findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          handleSendEmail(user.username);
        } else {
          res.status(404).json({ error: "Email not found" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },

  resetPassword(req, res, next) {
    const handlePassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.ACCESS_TOKEN
    ).toString();

    req.body.password = handlePassword;

    const changePassword = () => {
      userModel
        .findOneAndUpdate(
          { email: req.body.email },
          { password: req.body.password }
        )
        .then((user) => {
          res.json(user);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    forgotPasswordModel
      .findOne({ codeReset: req.body.codeReset, email: req.body.email })
      .then((data) => {
        if (data) {
          changePassword();
        } else {
          res.status(404).json({ error: "Value not found" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

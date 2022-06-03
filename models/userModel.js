const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      maxlength: [50, "First Name must not exceed 50 characters"],
      minlength: [2, "First Name must atleast have 2 characters "],
      validate: [/^[a-zA-Z\s]*$/, "First Name should only contain characters"],
    },
    lastname: {
      type: String,
      trim: true,
      maxlength: [50, "Last Name must not exceed 50 characters"],
      minlength: [2, "Last Name must atleast have 2 characters "],
      validate: [/^[a-zA-Z\s]*$/, "Last Name should only contain characters"],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    email: {
      type: String,
      require: [true, "User must have an Email"],
      unique: [true, "Email Already Taken"],
      lowercase: true,
      maxlength: [50, "email must not exceed 50 characters"],
      minlength: [3, "must be atleast 3 characters"],
      validate: [validator.isEmail, "Please Provide a valid Email"],
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      minlength: [8, "Password atleast 8 characters"],
      maxlength: [1000, "Password must not exceed 1000 characters"],
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

//encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
//compare password from db and client
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//reset token for forgot password
userSchema.methods.createNewPassword = function () {
  const newPassord = crypto.randomBytes(32).toString("hex").substring(0, 10);
  this.password = newPassord;
  return newPassord;
};
//email verification for users signing up to the web app
userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.verificationTokenExpires = Date.now() + 50 * 1000; //50minutes
  return verificationToken;
};

module.exports = User = mongoose.model("User", userSchema);

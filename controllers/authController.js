const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const Email = require("../utils/email");
require("dotenv").config();
//signToken - create a valid JWT token with out SECRET
const signToken = (user) => {
  let { id } = user;
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// createSendToken - make a jwt cookie for the client using the user info
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user); //encrypt & use id as a token

  // 1. Configure Cookie Options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), //10days
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  // 2. Create Cookie
  res.cookie("jwt", token, cookieOptions);
  user.password = null;

  // 3. Send token to the client
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
//verifyEmail
exports.verifyEmail = catchAsync(async (req, res, next) => {
  // 1 Get the token
  const user = await User.findOne({
    verificationToken: req.params.verificationToken,
  });
  if (!user) {
    return res.status(400).json({
      message: "Verification Link is Invalid or Expired",
    });
  }
  // 2.check if token is already expired
  const verificationTokenExpires = new Date(
    user.verificationTokenExpires
  ).getTime();
  if (!verificationTokenExpires > Date.now()) {
    return res.status(400).json({
      message: "Verification Link is Invalid or Expired",
    });
  }

  //3. clear tokens & make account verified
  user.verificationToken = "";
  user.verificationTokenExpires = "";
  user.verified = true;
  let msg = "is Verified";
  await user.save();

  // 4. Give back a response
  return res.status(200).json({
    status: "success",
    message: `${user.email} ${msg}`,
  });
});

//resendEmailVerification
exports.resendEmailVerification = catchAsync(async (req, res, next) => {
  //need email to resend email verification

  // 1. Get the Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid Email or Does not Exist",
    });
  }

  // 2. Create a new email verification token
  user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  const emailUser = {
    name: `${user.firstname} ${user.lastname}`,
    email: user.email,
  };

  // 3. Identify the host to use (production or development environment)
  let url, host;
  if (process.env.NODE_ENV === "production") {
    host = process.env.PRODUCTION_HOST;
  } else {
    host = process.env.DEVELOPMENT_HOST;
  }

  // 4. Send the link to the Email
  url = `${req.protocol}://${host}sign-up/account/verify/${user.verificationToken}`;
  await new Email(emailUser, url).sendEmailVerification();

  // 5. Give back a response
  res.status(200).json({
    status: "success",
    message: `Account Verification resent to ${user.email} (expires in 50 minutes)`,
  });
});

//sign-up
exports.signup = catchAsync(async (req, res, next) => {
  //1. Create user & Email Verification Token
  const user = { ...req.body };
  const newUser = await User.create(req.body);
  newUser.createEmailVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  const emailUser = {
    name: `${user.firstname} ${user.lastname}`,
    email: user.email,
  };

  // 2. Identify the host to use (production or development environment)
  let url, host;
  if (process.env.NODE_ENV === "production") {
    host = process.env.PRODUCTION_HOST;
  } else {
    host = process.env.DEVELOPMENT_HOST;
  }

  // 3. Send the link to the Email
  url = `${req.protocol}://${host}sign-up/account/verify/${newUser.verificationToken}`;
  await new Email(emailUser, url).sendEmailVerification();

  // 4. Give back a response
  res.status(200).json({
    status: "success",
    message: `Account Verification Sent to ${user.email} (expires in 50 minutes)`,
    user_id: newUser._id,
  });
});

//login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1. Error Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Please, provide email & password",
    });
  }
  // 2. Validate credentials
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }

  // 3. Prevent unverified users to log in
  if (!user.verified) {
    return res.status(401).json({
      message: "Account is not Verified",
    });
  }
  user.password = undefined;
  //4. Issue a JWT Token if all credentials is correct
  createSendToken(user, 200, req, res);
});

//logout -replace jwt token with different value that will expire in a specific number of sec
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000), //10sec
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
});

//issue a new forgot password and send it to email
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Identify User
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      message: "Email doesn't exist",
    });
  }

  // 2. Issue a new password
  const newPassword = user.createNewPassword();
  await user.save({ validateBeforeSave: false });

  // 3.  Send new password to email and catch any errors if there are
  try {
    const emailUser = {
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
    };
    await new Email(emailUser, newPassword).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: `New Password Sent to ${user.email}`,
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({
      message: "There was an error sending the email.Please try again later",
    });
  }
});

//update-password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!user || !(await user.correctPassword(passwordCurrent, user.password))) {
    return res.status(200).json({
      message: "Invalid Password",
    });
  }
  user.password = password;
  await user.save();
  createSendToken(user, 200, req, res);
});

//PROTECTING ROUTES - ensure token is valid and user is logged in
exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get jwt token from the header
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      message: "You are not logged In",
    });
  }

  //2. Validate JWT token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  //3. Validate if the user is still exist - token is possible stealed
  if (!user) {
    return res.status(401).json({
      message: "Token expired",
    });
  }

  //4. save user to req and res and moved to the next middleware if token is valid
  req.user = user;
  res.locals.user = user;
  next();
});

//future use case for accessing API - ex. admin, encoder, user
// can be used to limit users who can access specific API resource
exports.allowedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is public id",
      url: "profilepic url",
    },
  });

  sendToken(user, 201, res);
});

const userLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Please enter the email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError("Invalid user credientials", 401));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ApiError("Invalid User credientials", 401));
  }

  sendToken(user, 200, res);
});

const userLogout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  // console.log(next());
  // Get ResetPassword Token
  const resetToken = user.resetPassword();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/forget/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    // Assuming sendEmail is a properly implemented function
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ApiError(error.message, 500));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("user nor found", 404));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ApiError("password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});
// by user
const getUserDetail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatch) {
    return next(new ApiError("Old password is incorrect", 401));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ApiError("Password does not match", 401));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

const userUpdateProfile = asyncHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    // useFindAndModify: false,
  });
  res.status(200).json({ success: true });
});

// get all  user for (admin)
const getAllUser = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// get single user for (admin)

const getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ApiError(`user does not exists with this id: , ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update profile (admin)
const UpdateUser = asyncHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    // useFindAndModify: false,
  });
  res.status(200).json({ success: true });
});

// delete user (admin)
const DeleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ApiError(`user does not exists with this id: , ${req.params.id}`, 400)
    );
  }
  user = await User.findOneAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User Delete Successfully",
  });
});
export {
  userRegister,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getUserDetail,
  updatePassword,
  userUpdateProfile,
  getAllUser,
  getSingleUser,
  UpdateUser,
  DeleteUser,
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
const userRegister = asyncHandler(async (req, res, next) => {
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
  res.status(200).json({
    success: true,
    user
  })
});

export {
    userRegister
}

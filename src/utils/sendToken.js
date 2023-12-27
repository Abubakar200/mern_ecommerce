export const sendToken = (user, statusCode, res) => {
  const token = user.JWTToken();

  const option = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
    ),
  };

  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    user,
    token,
  });
};

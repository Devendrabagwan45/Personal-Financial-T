import jwt from "jsonwebtoken";

// function to generate token
export const generateToken = (userID) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET);
  return token;
};

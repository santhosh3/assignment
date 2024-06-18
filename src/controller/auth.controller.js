require("dotenv").config();
const userModel = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation, getRequestParams } = require("../util");

const generateToken = (payload) => {
  return jwt.sign({ id: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
};

const register = async (req, res) => {
  try {
    const allParams = getRequestParams(req);
    const { userName, email, password } = allParams;

    //validation for userData
    const { status, message } = await registerValidation(req.body);
    if (!status) {
      return res.status(400).json({ status: "failure", data: message });
    }

    //creating the user inserting user in userTable
    const { id } = await userModel.create({
      userName,
      email,
      password,
      confirmPassword: password,
    });

    //showing specific data as response
    const responseData = {
      userName,
      email,
      token: generateToken(id),
    };

    return res.status(201).json({ status: "success", data: responseData });
  } catch (error) {
    return res.status(500).json({ status: "failure", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    // taking data from request
    const allParams = getRequestParams(req);
    
    // validating request body for login API
    const { status, statusCode, message } = await loginValidation(allParams);
    if (!status) {
      return res.status(statusCode).json({ status: "failure", data: message });
    }

    // if no errors then generating token
    const token = generateToken(message);

    return res.status(statusCode).json({ status: "success", token });
  } catch (error) {
    return res.status(500).json({ status: "failure", error: error.message });
  }
};




module.exports = { register, login };

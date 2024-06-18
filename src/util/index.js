const userModel = require("../model/usermodel");
const getRequestParams = require("./requestParser");
const bcrypt = require("bcryptjs");


// validation of register API
const registerValidation = async (obj) => {
  if (Object.keys(obj).length === 0) {
    return { status: false, message: "manditory fields are missing" };
  }

  let { userName, email, password } = obj;
  if (email === undefined || email.trim().length === 0) {
    return { status: false, message: "email is manditory" };
  }

  const emailFound = await userModel.findOne({ where: { email } });
  if (emailFound) {
    return {
      status: false,
      message: "email is already exists please try to login",
    };
  }

  return {
    status: true,
    message: "",
  };
};



// validation of login API

const loginValidation = async (obj) => {
  if (Object.keys(obj).length === 0) {
    return {
      status: false,
      statusCode: 400,
      message: "manditory fields are missing",
    };
  }

  const { email, password } = obj;

  if (!email || !password) {
    return {
      status: false,
      statusCode: 400,
      message: "please provide email and password",
    };
  }

  const emailFound = await userModel.findOne({ where: { email } });

  if (!emailFound || !(await bcrypt.compare(password, emailFound.password))) {
    return {
      status: false,
      statusCode: 401,
      message: "Incorrect email or password",
    };
  }

  return {
    status: true,
    statusCode: 200,
    message: emailFound.id,
  };
};

module.exports = {
  registerValidation,
  loginValidation,
  getRequestParams,
};

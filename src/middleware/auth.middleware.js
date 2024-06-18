require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../model/usermodel");
const { getRequestParams } = require("../util");

async function authentication(req, res, next) {
  let token;
  // checking weather token is present or not
  if (
    req?.headers?.authorization &&
    req?.headers?.authorization?.startsWith("Bearer")
  ) {
    try {
    
      // if present teking token 
      token = req?.headers?.authorization?.split(" ")[1];

      // encoding token using secret Key
      const decoded = jwt?.verify(token, process?.env?.JWT_SECRET_KEY);
      if (!decoded) {
        return res
          .status(401)
          .send({ status: "failure", message: "please enter valid token" });
      }

      // finding weather user is present or not
      const user = await userModel.findByPk(decoded?.id, {
        attributes: ["id", "userName", "email", "createdAt", "updatedAt"],
      });

      // user Not found case
      if(user === null){
        return res
        .status(404)
        .send({ status: "failure", message: "user Not found please register" });
      }

      // if present assigning to req.user
      req.user = user?.dataValues;
      next();
    } catch (error) {
      return res
        .status(401)
        .send({ status: "failure", message: error.message });
    }
  }
  // if token is not there then providing message
  if (!token) {
    return res.status(401).send({
      status: "failure",
      message: "Not authenticated, Please provide token",
    });
  }
}

// Authorization required for specific operations
function authorization(req, res, next) {
  try {
    const { userId } = getRequestParams(req);
    const user = req.user;
    if (user?.id !== Number(userId)) {
      const method = req.method;
      return res.status(401).send({
        status: "failure",
        message: `Not authorised for doing this ${method} operation`,
      });
    }
    next();
  } catch (error) {
    return res.status(401).send({ status: "failure", message: error.message });
  }
}

module.exports = {
  authentication,
  authorization,
};

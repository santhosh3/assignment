const userModel = require("../model/usermodel");
const { getRequestParams } = require("../util");

const getUsers = async (req, res) => {
  try {
    const users = await userModel.findAll({
      attributes: ["userName", "email", "createdAt", "updatedAt"],
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ status: "failure", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = getRequestParams(req);
    if (isNaN(Number(userId))) {
      return res
        .status(400)
        .json({ status: "failure", data: "Please provide valid userId" });
    }
    const user = await userModel.findByPk(userId, {
      attributes: ["userName", "email", "createdAt", "updatedAt"],
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ status: "failure", error: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { userId, ...remaining } = getRequestParams(req);
    if (isNaN(Number(userId))) {
      return res
        .status(400)
        .json({ status: "failure", data: "Please provide valid userId" });
    }

    const { userName, email } = remaining;
    const updatedValues = Object.entries({ userName, email })
      .filter(([key, value]) => value !== undefined)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    const [updatedRows, [updatedUser]] = await userModel.update(updatedValues, {
      where: { id: userId },
      returning: true,
    });

    if (updatedRows === 0) {
      return res
        .status(400)
        .json({ status: "failure", data: "User not found" });
    }

    const { id, createdAt, updatedAt } = updatedUser;
    return res.status(200).json({
      status: "success",
      data: { id, userName, email, createdAt, updatedAt },
    });
  } catch (error) {
    return res.status(500).json({ status: "failure", error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { userId } = getRequestParams(req);
    if (isNaN(Number(userId))) {
      return res
        .status(400)
        .json({ status: "failure", data: "Please provide valid userId" });
    }
    const deletedUser = await userModel.destroy({
      where: { id: userId },
    });

    if (deletedUser === 0) {
      return res
        .status(400)
        .json({ status: "failure", data: "User not found" });
    }

    return res
      .status(200)
      .json({ status: "success", data: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};

const addition = () => {
  return "HELLO WORLD";
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

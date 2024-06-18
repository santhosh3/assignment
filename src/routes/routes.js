const { register, login } = require("../controller/auth.controller");
const {
  getUserById,
  getUsers,
  updateUserById,
  deleteUserById,
} = require("../controller/user.controller");
const {
  authentication,
  authorization,
} = require("../middleware/auth.middleware");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authentication, getUsers);
router.get("/users/:userId", authentication, getUserById);
router.put("/users/:userId", authentication, authorization, updateUserById);
router.delete("/users/:userId", authentication, authorization, deleteUserById);

module.exports = router;

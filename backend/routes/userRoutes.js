const express = require("express")
const { registerUser, authUser, allUsers } = require("../controllers/userControllers")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/").post(registerUser).get(protect, allUsers) //primero va por el middleware protect y despues a la busqueda de usuarios
router.post("/login", authUser)

module.exports = router;
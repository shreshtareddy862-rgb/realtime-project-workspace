const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { createProject, getProjects } = require("../controllers/projectController");

router.post("/", auth, createProject);
router.get("/", auth, getProjects);

module.exports = router;
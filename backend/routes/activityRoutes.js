const express = require("express");
const router = express.Router();

const { getActivities } = require("../controllers/activityController");

router.get("/:projectId", getActivities);

module.exports = router;
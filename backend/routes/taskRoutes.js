const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  uploadAttachment

} = require("../controllers/taskController");

router.post("/", createTask);
router.get("/:projectId", auth, getTasks);
router.put("/status/:id", updateTaskStatus);
router.put("/edit/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/upload/:id", auth, upload.single("file"), uploadAttachment);

module.exports = router;
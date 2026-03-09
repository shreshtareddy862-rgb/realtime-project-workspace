const pool = require("../db");

const createTask = async (req, res) => {
  try {

    const { title, description, priority, assignee, project_id } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: "Task title and description are required"
      });
    }

    if (!priority) {
      return res.status(400).json({
        error: "Priority is required"
      });
    }

    const result = await pool.query(
      "INSERT INTO tasks (title, description, priority, assignee, project_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [title, description, priority, assignee, project_id]
    );

    // Activity log
    await pool.query(
      "INSERT INTO activities (project_id, message) VALUES ($1,$2)",
      [project_id, `Task "${title}" created`]
    );

    io.emit("taskUpdated");

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).send("Error creating task");

  }
};

const getTasks = async (req, res) => {
  try {

    const { projectId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE project_id=$1 ORDER BY id DESC LIMIT $2 OFFSET $3",
      [projectId, limit, offset]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).send("Error fetching tasks");

  }
};

const updateTaskStatus = async (req, res) => {
  try {

    const { status } = req.body;
    const { id } = req.params;

    const task = await pool.query(
      "SELECT title, project_id FROM tasks WHERE id=$1",
      [id]
    );

    const title = task.rows[0].title;
    const project_id = task.rows[0].project_id;

    await pool.query(
      "UPDATE tasks SET status=$1 WHERE id=$2",
      [status, id]
    );

    await pool.query(
      "INSERT INTO activities (project_id, message) VALUES ($1,$2)",
      [project_id, `Task "${title}" moved to ${status}`]
    );

    io.emit("taskUpdated");

    res.json({ message: "Status updated" });

  } catch (err) {

    console.error(err);
    res.status(500).send("Error updating task status");

  }
};

const updateTask = async (req, res) => {
  try {

    const { id } = req.params;
    const { title, description, priority, assignee } = req.body;

    const result = await pool.query(
      "UPDATE tasks SET title=$1, description=$2, priority=$3, assignee=$4 WHERE id=$5 RETURNING *",
      [title, description, priority, assignee, id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).send("Error updating task");

  }
};

const deleteTask = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM tasks WHERE id=$1",
      [id]
    );

    res.json({ message: "Task deleted successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).send("Error deleting task");

  }
};

const uploadAttachment = async (req, res) => {

  try {

    const { id } = req.params;

    const filePath = req.file.path;

    const result = await pool.query(
      "UPDATE tasks SET attachment=$1 WHERE id=$2 RETURNING *",
      [filePath, id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).send("Upload error");

  }

};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  uploadAttachment
};
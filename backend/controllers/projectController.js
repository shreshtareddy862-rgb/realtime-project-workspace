const pool = require("../db");

const createProject = async (req, res) => {
  try {

    const { title, description } = req.body;

    const userId = req.user.id;
    if (!title || !description) {
      return res.status(400).json({
        error: "Title and description are required"
      });
    }

    const result = await pool.query(
      "INSERT INTO projects (title, description, owner_id) VALUES ($1,$2,$3) RETURNING *",
      [title, description, userId]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).send("Create project error");

  }
};

const getProjects = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM projects ORDER BY id DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching projects");
  }
};
const updateProject = async (req, res) => {
  try {

    const { id } = req.params;
    const { title, description } = req.body;

    const result = await pool.query(
      "UPDATE projects SET title=$1, description=$2 WHERE id=$3 RETURNING *",
      [title, description, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating project");
  }
};
const deleteProject = async (req, res) => {
  try {

    const { id } = req.params;

    // delete tasks belonging to project first
    await pool.query(
      "DELETE FROM tasks WHERE project_id=$1",
      [id]
    );

    // delete activities belonging to project
    await pool.query(
      "DELETE FROM activities WHERE project_id=$1",
      [id]
    );

    // delete project
    await pool.query(
      "DELETE FROM projects WHERE id=$1",
      [id]
    );

    res.json({ message: "Project deleted successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).send("Error deleting project");

  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };
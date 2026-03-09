const pool = require("../db");

const getActivities = async (req, res) => {
  try {

    const { projectId } = req.params;

    const result = await pool.query(
      "SELECT * FROM activities WHERE project_id=$1 ORDER BY id DESC",
      [projectId]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).send("Error fetching activities");

  }
};

module.exports = { getActivities };
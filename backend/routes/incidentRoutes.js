const express = require("express");
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
} = require("../controllers/incidentController");

const router = express.Router();

const { protect, authorize } = require("../middleware/authmiddleware");

// Apply protect middleware to all incident routes
router.use(protect);

router.route("/")
  .get(getIncidents)
  .post(createIncident);

router.route("/:id")
  .get(getIncidentById)
  .put(updateIncident)
  .delete(authorize("admin"), deleteIncident);

module.exports = router;

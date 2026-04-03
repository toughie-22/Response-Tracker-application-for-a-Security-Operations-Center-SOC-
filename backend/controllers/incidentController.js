const Incident = require("../models/incident");

// @desc    Create new incident
// @route   POST /api/incidents
// @access  Private
const createIncident = async (req, res) => {
  try {
    // Add logged in user to req.body
    req.body.createdBy = req.user.id;

    const incident = await Incident.create(req.body);

    res.status(201).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Private
const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get an incident by ID
// @route   GET /api/incidents/:id
// @access  Private
const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email");

    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an incident
// @route   PUT /api/incidents/:id
// @access  Private
const updateIncident = async (req, res) => {
  try {
    let incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }

    // Update the incident
    incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email role").populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete an incident
// @route   DELETE /api/incidents/:id
// @access  Private (Admin only)
const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }

    await incident.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: "Incident deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
};

const express = require("express");
const router = express.Router();
const ProductionReal = require("../models/ProductionReal");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE Production Real
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newEntry = new ProductionReal(req.body);
    await newEntry.save();
    res.status(201).json({ message: "Production saved successfully" });
  } catch (error) {
    console.error("Error saving Production:", error);
    res.status(500).json({ message: "Error saving production ", error });
  }
});

// GET ALL Production Real with populated references
router.get("/", authMiddleware, async (req, res) => {
  try {
    const data = await ProductionReal.find()
      .populate("machiness.activityId")
      .populate("machiness.machineId");

    res.json(data);
  } catch (error) {
    console.error("Error fetching Production :", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// UPDATE Production Real
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await ProductionReal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Production  updated successfully", updated });
  } catch (error) {
    console.error("Error updating Production :", error);
    res.status(500).json({ message: "Error updating production ", error });
  }
});
module.exports = router;
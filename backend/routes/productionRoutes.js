const express = require("express");
const router = express.Router();
const Production = require("../models/Production");
const {
  getWorkOrder,
  saveProduction,
  getLastReelData,
  getReelsByWorkOrder  // ✅ add this
} = require("../controllers/productionController");

router.get("/workorder/:efi", getWorkOrder);
router.get("/reel/:reelNo", getLastReelData);
router.post("/", saveProduction);
router.get("/workorder/:wo/reels", getReelsByWorkOrder);



// GET ALL RECORDS
router.get("/", async (req, res) => {
  const data = await Production.find().sort({ createdAt: -1 });
  res.json(data);
});


// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Production.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Production.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.put("/:id", async (req, res) => {
  const updated = await Production.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});
module.exports = router;
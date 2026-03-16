const mongoose = require("mongoose");

const productionRealSchema = new mongoose.Schema({
  workOrder: {
    type: Number, // store efiWoNumber
    required: true
  },
  customerName: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobSize: { type: String },
 
   materials: [
    {
      materialCode: String,
      materialDescription: String,
      materialGroupDescription: String,
      mill: String,
      gsm: String,
      paperSize: { type: String },
    }
  ],
  ups: { type: Number },
   orderQty: { type: Number, required: true },
  machiness: [
    {
      activityId: { type: mongoose.Schema.Types.ObjectId, ref: "ActivityMaster", required: true },
      machineId: { type: mongoose.Schema.Types.ObjectId, ref: "MachineMaster", required: true }
    }
  ],
  productionDate: { type: Date, required: true },
  productionFromTime: { type: String, required: true },
  productionToTime: { type: String, required: true },
  shift: { type: String, required: true },
  machineStatus: {
  type: String,
  required: true
},
  productionQty: { type: Number, required: true },
  wastageQty: { type: Number, required: true },
  wastePercent: { type: Number,required: true },
  remarks: { type: String },
  enteredBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("ProductionReal", productionRealSchema);
const cropSchema = new mongoose.Schema({
  plot: { type: mongoose.Schema.Types.ObjectId, ref: "Plot" },
  name: { type: String, required: true },
  plantingDate: Date,
  harvestDate: Date,
  status: { type: String, enum: ["Planted", "Growing", "Harvested"] },
});

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB conectado");
  })
  .catch((error) => {
    console.log("❌ Error MongoDB:", error);
  });

const cameraSchema = new mongoose.Schema({
  name: String,
  url: String,
  type: String,
});

const Camera = mongoose.model("Camera", cameraSchema);

app.get("/api/cameras", async (req, res) => {
  try {
    const cameras = await Camera.find().sort({ _id: -1 });
    res.json(cameras);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
});

app.post("/api/cameras", async (req, res) => {
  try {
    const camera = new Camera(req.body);

    await camera.save();

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
});

app.delete("/api/cameras/:id", async (req, res) => {
  try {
    await Camera.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
});

app.listen(5000, () => {
  console.log("🔥 API FABULOSA PLAY FUNCIONANDO");
});
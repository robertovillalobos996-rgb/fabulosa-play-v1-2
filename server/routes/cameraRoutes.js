const express = require("express");

const router = express.Router();

const Camera = require("../models/Camera");

// OBTENER CÁMARAS
router.get("/", async (req, res) => {

  try {

    const cameras = await Camera.find().sort({ order: 1 });

    res.json(cameras);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

// CREAR CÁMARA
router.post("/", async (req, res) => {

  try {

    const camera = new Camera(req.body);

    await camera.save();

    res.json(camera);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

// ACTUALIZAR CÁMARA
router.put("/:id", async (req, res) => {

  try {

    const camera = await Camera.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(camera);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

// ELIMINAR CÁMARA
router.delete("/:id", async (req, res) => {

  try {

    await Camera.findByIdAndDelete(req.params.id);

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;
const Camera = require("../models/Camera");

const getCameras = async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.json(cameras);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCamera = async (req, res) => {
  try {
    console.log("BODY RECIBIDO:");
    console.log(req.body);

    const { name, url, type } = req.body;

    if (!name || !url || !type) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos",
      });
    }

    const newCamera = new Camera({
      name,
      url,
      type,
    });

    await newCamera.save();

    res.json({
      success: true,
      camera: newCamera,
    });

  } catch (error) {
    console.log("ERROR GUARDANDO:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCameras,
  createCamera,
};
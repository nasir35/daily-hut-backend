const cloudinary = require("../utils/cloudinary.config");
const { v4: uuidv4 } = require("uuid");

exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                upload_preset: "product_images",
                public_id: `product_${uuidv4()}`,
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            )
            .end(file.buffer);
        })
    );

    const results = await Promise.all(uploadPromises);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadSingleImage = async (req, res) => {
  try {
    const { upload_preset } = req.body;
    console.log(upload_preset);

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    if (!upload_preset) {
      return res
        .status(400)
        .json({ success: false, message: "Upload preset is required" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            upload_preset: upload_preset,
            public_id: `${upload_preset}_${uuidv4()}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

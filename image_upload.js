/*
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));

//   image upload function
    app.post("/upload", upload.single("image"), (req, res) => {
      const folder = req.body.folder || "default-folder";
      const ext = path.extname(req.file.originalname).toLowerCase();
      const uniqueFilename = `${Date.now()}-${path.basename(
        req.file.originalname,
        ext
      )}`;

      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            public_id: uniqueFilename,
            resource_type: "image",
            format:
              ext === ".png"
                ? "png"
                : ext === ".jpg" || ext === ".jpeg"
                ? "jpeg"
                : "auto",
          },
          (error, result) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            }
            res.status(200).json({ url: result.secure_url });
          }
        )
        .end(req.file.buffer);
    });


    */

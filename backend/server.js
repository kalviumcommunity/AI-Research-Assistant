const express = require("express");
const dotenv = require("dotenv");
const zeroShotRoute = require("./routes/zeroShot");

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api", zeroShotRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

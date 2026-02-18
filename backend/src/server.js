import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

// connect database
connectDB();

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

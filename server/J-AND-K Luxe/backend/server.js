import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from './routes/userRoute.js'
import cors from 'cors'
import productRoute from './routes/productRoutes.js'
import cartRoute from './routes/cartRoute.js'
const app = express();
// Port from env
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));






app.use('/api/v1/user',userRoute)
app.use('/api/v1/product',productRoute)
app.use('/api/v1/cart',cartRoute)





// Start Server
app.listen(PORT, () => {
    connectDB()
  console.log(`🚀 Server running on port ${PORT}`);
});
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routers/seedRoutes.js';
import productRouter from './routers/productRoutes.js'
import orderRouter from './routers/orderRoutes.js';
import userRouter from './routers/userRoutes.js';

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('Connected to database');
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/api/keys/paypal',(req,res)=>{
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})
// Routes
app.use('/api/seed', seedRouter);
app.use('/api/products',productRouter)
app.use('/api/users',userRouter)
app.use('/api/orders',orderRouter)


// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});    

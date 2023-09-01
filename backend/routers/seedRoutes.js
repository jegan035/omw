import express from 'express';
import Product from '../models/productModel.js'
import data from '../data.js';
import User from '../models/userModel.js'

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  try {
    // Delete all existing products
    await Product.deleteMany({});

    // Insert new products
    const createdProducts = await Product.insertMany(data.products);

    // Delete all existing users
    await User.deleteMany({});

    // Insert new users
    const createdUsers = await User.insertMany(data.users);

    res.send({ createdProducts, createdUsers });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while seeding data' });
  }
});

export default seedRouter;

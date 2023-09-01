 import bcrypt from 'bcryptjs'


 const data = {
  users: [
  {
    name:'jegan',
    email:'jegan@example.com',
    password:bcrypt.hashSync('123456'),
    isAdmin:true
  },
  {
    name:'Ayla',
    email:'Ayla@example.com',
    password:bcrypt.hashSync('123456'),
    isAdmin:false
  }
],
  products: [
    {
      //_id:'1',
      name: "Nike Slim shirt ",
      slug: "nike-slim-shirt",
      category: "Shirts",
      image: "/images/e1.jpg",
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.5,
      description: "high quality shirt",
    },
    {
      //_id:'2',
      name: "Adidas Fit Shirt",
      slug: "adidas-fit-shirt",
      category: "Shirts",
      image: "/images/e2.jpg",
      price: 250,
      countInStock: 20,
      brand: "Adidas",
      rating: 4.0,
      description: "high quality product",
    },
    {
      //_id:'3',
      name: "Nike Slim Pant",
      slug: "nike-slim-pant",
      category: "Pants",
      image: "/images/e6.jpg",
      price: 25,
      countInStock: 15,
      brand: "Nike",
      rating: 4.5,
      description: "high quality product",
    },
    {
      //_id:'4',
      name: "Adidas Fit Pant",
      slug: "adidas-fit-pant",
      category: "Pants",
      image: "/images/e7.jpg",
      price: 65,
      countInStock: 5,
      brand: "Puma",
      rating: 4.5,
      description: "high quality product",
    },
   
  ],
};
export default data;

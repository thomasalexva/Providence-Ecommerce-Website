# Providence E-Commerce Website

A full-stack e-commerce web application developed using the MERN stack (MongoDB, Express.js, React, and Node.js). This project provides a complete online shopping experience with user authentication, product management, shopping cart functionality, and order processing.

---

## Features

- User Registration & Login
- Secure Authentication
- Product Listing
- Product Details Page
- Shopping Cart
- Order Management
- Admin Panel
- Product Image Upload
- Responsive User Interface
- RESTful API Integration

---

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer

---

## Project Structure

```
project/
│
├── front end/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── back end/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── uploads/
│   ├── server.js
│   └── ...
│
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/thomasalexva/Providence-Ecommerce-Website.git
```

### Navigate to the Project

```bash
cd Providence-Ecommerce-Website
```

### Backend Setup

```bash
cd "back end"
npm install
```

Create a `.env` file and add:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend:

```bash
npm start
```

---

### Frontend Setup

```bash
cd "../front end"
npm install
npm run dev
```

---

## Screenshots

You can add screenshots here later.

Example:

```
screenshots/
├── Home.png
├── Login.png
├── Cart.png
└── Admin.png
```

---

## Future Improvements

- Payment Gateway Integration
- Product Search
- Wishlist
- Product Reviews
- Email Notifications
- Order Tracking
- Dashboard Analytics

---

## Author

**Alex Manoj**,
**Gowrymol KS**

B.Sc. Computer Science with Data Science

GitHub: https://github.com/thomasalexva

---

## License

This project was developed for educational and learning purposes.

const express = require('express');
const session = require('express-session')
const { authenticate, authorize } = require('../Middleware/middleware');
const { dashboard, createProduct, getProduct, deleteProduct, GetEditProduct, updateProduct } = require('../Controller/productController');
 const { GetSaleProduct, SaleProduct } = require('../Controller/orderController');
const { signup, login } = require("../Controller/userController");
const { upload } = require("../Config/config")
const route = express.Router()

route.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

route.post("/login", login )
route.post("/signup", signup )  
 route.get("/admin/dashboard", authenticate, authorize(["admin"]), dashboard) 
route.get("/admin/get-products",authenticate, authorize(["admin"]),getProduct)
route.post("/admin/create-product", authenticate, authorize(["admin"]), upload.single("productImage"), createProduct);
route.delete(`/admin/delete-product/:productId`,authenticate, authorize(["admin"]),deleteProduct )
route.get("/admin/get-product/:productId",authenticate, authorize(["admin"]),GetEditProduct)
route.put("/admin/edit-product/:productId", authenticate, authorize(["admin"]), upload.single("productImage"), updateProduct);
route.get("/admin/get-sale-product/:productId",authenticate, authorize(["admin"]),GetSaleProduct)
route.post("/admin/sale-product/:productId",authenticate, authorize(["admin"]),SaleProduct)

module.exports = route;
import express from "express";

const router = express.Router();

import home from "./controllers/home.js"
import products from "./controllers/products.js"
import accounts from "./controllers/accounts.js"
import basket from "./controllers/basket.js"
import auth from "./utils/auth.js"
import orders from "./controllers/orders.js"
import admin from "./controllers/admin.js"

router.get("/", home.index);

router.get("/speisekarte", products.index);

router.get("/registrieren", auth.notLoggedIn, accounts.signupForm);
router.post("/signup", auth.notLoggedIn ,accounts.register);
router.get("/login", auth.notLoggedIn ,accounts.loginForm);
router.post("/authenticate", auth.notLoggedIn, accounts.authenticate);
router.get("/logout", accounts.logout);

router.post("/basket/addItem", auth.protected, basket.addProduct);
router.post("/basket/removeItem", auth.protected ,basket.removeItem);
router.get("/basket/checkout", auth.protected, basket.checkout);

router.post("/order", auth.protected, orders.submitOrder);
router.get("/thanks", orders.thanksForOrder);

router.get("/admin/bestellungen", auth.isAdmin, admin.orderOverview);
router.post("/admin/complete-order", admin.fulfillOrder);

export default router;
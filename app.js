import express from "express";
import {engine} from "express-handlebars"
import dotenv from "dotenv";
import session from "express-session";

import router from "./routes.js"
import logger from "./utils/logger.js"

/* Reading global variables from config file */
dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.engine("hbs", engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "./views/layouts",
    partialsDir: "./views/partials",
    helpers: {
        eq: (a, b) => a === b
    }
}));

//turn on serving static files (required for delivering css to client)
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 360000
    }
}));

//Middleware wird jedes mal ber request aufgerufen
app.use(function(req, res, next) {

    let basket = [];
    let totalSum = 0;
    let totalQuantity = 0;
    let user = req.session.user;

    if(req.session.basket){
        basket = Object.values(req.session.basket);

        for(let item of basket){
            item.total = item.price * item.quantity;
            totalSum += item.total;
            totalQuantity += item.quantity;

            item.formattedPrice = (item.total/100).toFixed(2).replace(".", ",")+"€";
        }
    }

    res.locals.basket = basket;
    res.locals.totalSum = (totalSum/100).toFixed(2).replace(".", ",")+"€";
    res.locals.user = user;
    res.locals.totalQuantity = totalQuantity;

    logger.info("Aktueller user:", user);
    if(req.session.user){
        logger.info("Ist user admin?:", user.isAdmin);
    }

    if(user && user.isAdmin){
        res.locals.isAdmin = user.isAdmin;
    } else {
        res.locals.isAdmin = false;
    }

    next();
})

//configure template engine
app.set("views", "./views");
app.set("view engine", "hbs");

app.use("/", router);

app.listen(PORT, function() {
  logger.info(`Delivery running and listening on port ${PORT}`);
});

export default app;
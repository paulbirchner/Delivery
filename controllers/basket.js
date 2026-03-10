import productsDb from "../models/products-db.js";
import locationCalculator from "../utils/locationCalculator.js";

const basket = {
    async addProduct(req, res) {
        const productId = req.body.productId;
        const returnCategory = req.body.returnCategory;

        if (!req.session.basket) {
            req.session.basket = {};
        }

        if (req.session.basket[productId]) {
            req.session.basket[productId].quantity++;
        } else {
            const product = await productsDb.getProductById(productId);

            if (product) {
                req.session.basket[productId] = {
                    id: product.id,
                    name: product.name,
                    price: product.pricecent,
                    quantity: 1,

                    description: product.description, // für bestellübersicht
                    imageuri: product.imageuri
                };
            }
        }
        req.session.save();

        if(returnCategory) {
            res.redirect(`/speisekarte?category=${returnCategory}`);
        } else {
            res.redirect("/speisekarte");
        }
    },
    async removeItem(req, res) {

        const productId = req.body.productId;

        if(req.session.basket[productId] && req.session.basket[productId].quantity > 0) {
            req.session.basket[productId].quantity--;

            if(req.session.basket[productId].quantity <= 0) {
                delete req.session.basket[productId];
            }
        }
        req.session.save();
        res.redirect("/basket/checkout");
    },
    async checkout(req, res) {

        if (!req.session.basket) { //warenkorb leer
            res.redirect("/speisekarte");
            return;
        }

        //Mindestbestellwert berechnung

        //Warenkorb berechnen
        let message = "";
        let canOrder = true;
        let minOrderValue = 0;
        let distance = 0;
        let basketValue = 0;
        let basketArray = Object.values(req.session.basket);

        for (let item of basketArray) {
            basketValue += item.quantity * item.price;
        }
        let basketValueEuro = basketValue / 100;

        //Distanz berechnen

        const restaurantCoords = {
            lat: 48.99078,
            lon: 12.12556
        }

        const userCoords = {
            lat: req.session.user.lat,
            lon: req.session.user.lon,
        };

        if (userCoords) {
            distance = locationCalculator.greatCircleDistanceKilometer(restaurantCoords, userCoords);

            switch (true) {
                case(distance < 10):
                    minOrderValue = 10;
                    break;
                case(distance < 20):
                    minOrderValue = 25;
                    break;
                case(distance < 30):
                    minOrderValue = 40;
                    break;
                case(distance < 40):
                    minOrderValue = 50;
                    break;
                case(distance < 60):
                    minOrderValue = 60;
                    break;
                default:
                    minOrderValue = 100;
                    break;
            }

            if (basketValueEuro < minOrderValue) {
                canOrder = false;
                message = `Mindestbestellwert von ${minOrderValue} € nicht erreicht`;
            }
        } else {
            message = "Adresse fehlerhaft"
        }

        let ViewData = {
            title: "Bestellübersicht",
            minOrderValue: minOrderValue,
            message: message,
            canOrder: canOrder
        }
        res.render("bestellübersicht", ViewData);
    },

}

export default basket;
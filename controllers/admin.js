import ordersDb from "../models/orders-db.js";
import logger from "../utils/logger.js";

const admin = {
    async orderOverview(req, res) {

        const searchQuery = req.query.search;
        logger.info("searchQuery: ", searchQuery);

        let openOrders = await ordersDb.getOpenOrders();
        logger.info("result: ", openOrders);

        if(searchQuery) {
            //.filter gibt array zurück mit den elementen, welche Test bestehen falls keine, dann leeres Array
            openOrders = openOrders.filter(order => {//funktion wird auf jedes Element im array angewandt
                return (order.firstname + " " + order.lastname).toLowerCase().includes(searchQuery.toLowerCase())
            });
        }
        logger.info("nach filter: ", openOrders);

        for(let order of openOrders) {

            order.items = await ordersDb.getOrderItemsById(order.id);

        }
        logger.info("result after loop: ", openOrders);

        let ViewData = {
            openOrders: openOrders,
            title: "Alle Bestellungen"
        }

        res.render("bestellungen", ViewData);
    },
    async fulfillOrder(req, res) {
        const orderId = req.body.orderId;
        await ordersDb.fulfillOrder(orderId);

        res.redirect("/admin/bestellungen");
    }
}

export default admin;
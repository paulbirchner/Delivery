import ordersDb from "../models/orders-db.js";
import logger from "../utils/logger.js";

const orders = {
    async submitOrder(req, res) {
        const user = req.session.user;
        const basketMap = req.session.basket;

        if(user && basketMap){

            const basketArray = Object.values(basketMap);

            if(basketArray.length > 0){
                try {
                    await ordersDb.addOrder(user.id, basketArray);

                    req.session.basket = {};

                    res.redirect("thanks");
                } catch (error) {
                    logger.error(error);
                }
            }
        }
    },
    thanksForOrder(req, res) {
        res.render("thanks");
    }
}

export default orders;
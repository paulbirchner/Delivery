import logger from "../utils/logger.js"

const home = {
    index: async (req, res) => {
        logger.info("Loading home page");
        let ViewData = {
            title: "Delivery",
        };
        res.render("index", ViewData);
    }
}
export default home;
import logger from "../utils/logger.js"
import productsDb from "../models/products-db.js";

const products = {
    async index(req, res) {
        logger.info("loading products");
        //Eingabe aus url lesen
        const category = req.query.category;

        try{
            //alle kategorien aus db holen
            const rawCategories = await productsDb.getAllCategories();
            logger.info("Categories from DB: ", rawCategories);

            //einfache Liste ["pizza","pasta"...]
            const categories = rawCategories.map(row => row.category);

            let productList;

            if(category){
                productList = await productsDb.getProductsByCategory(category);
            } else{
                productList = await productsDb.getAllProducts();
            }

            res.render("speisekarte", {
                items: productList,
                categories: categories,
                currentCategory: category, // undefined für "alle"
                title: "Speisekarte",
            })
        } catch(e){
            logger.error("Error getting products list" + e);
        }
    },

}

export default products;
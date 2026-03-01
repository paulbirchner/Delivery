import pool from "./database.js";
import logger from "../utils/logger.js";
import priceFormatter from "../utils/priceFormatter.js";

const productsDb = {
    async getAllCategories() {
                            //get all categories once
        const query = "SELECT DISTINCT category FROM products";
        try{
            let result = await pool.query(query);
            return result.rows;
        }catch(e){
            logger.error(e);
            throw e; //fehler weitergeben
        }
    },
    async getProductsByCategory(category) {

        try{
            let result = await pool.query("SELECT * FROM products WHERE category = $1 ORDER BY id", [category]);
            return result.rows.map(product => priceFormatter.addFormattedPrice(product));
        } catch(e){
            logger.error(e);
            throw e; // fehler weitergeben
        }
    },
    async getProductById(id) {
        try {
            let result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
            if (result.rows[0]) {
                return result.rows[0];
            } else {
                logger.info("Product not found");
                return undefined;
            }
        } catch (e){
            logger.error(e);
            throw e;
        }
    },
    async getAllProducts() {
        try{
            let result = await pool.query("SELECT * FROM products");
            return result.rows.map(product => priceFormatter.addFormattedPrice(product));
        } catch (e){
            logger.error(e);
            throw e; //fehler weitergeben
        }
    }
}

export default productsDb;
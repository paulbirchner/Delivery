import pool from './database.js';
import logger from '../utils/logger.js';

const ordersDb = {
    async addOrder(userId, basket) {
        try{
            const resultOrder = await pool.query("INSERT INTO orders (customer_Id) VALUES ($1) RETURNING id", [userId]);
            const orderId = resultOrder.rows[0].id;

            const query = "INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)";

            for(let item of basket){
                await pool.query(query, [orderId, item.id, item.quantity])
            }
        } catch (error){
            logger.error(error);
            throw error;
        }
    },
    async getOpenOrders(){
        const query = `SELECT orders.id, accounts.firstname, accounts.lastname, accounts.street,
                            accounts.city, accounts.zip, accounts.country, accounts.lat, accounts.lon
                            FROM orders
                            JOIN accounts ON orders.customer_id = accounts.id
                            WHERE orders.fulfilled = false
                            ORDER BY orders.id`;

        const result = await pool.query(query);
        return result.rows;
    },
    async getOrderItemsById(orderId){
        const query = `SELECT order_products.product_id, order_products.quantity, products.name 
                            FROM order_products
                            JOIN products ON order_products.product_id = products.id
                            WHERE order_products.order_id = $1`;

        const result = await pool.query(query, [orderId]);
        return result.rows;
    },
    async fulfillOrder(orderId){
        const query = "UPDATE orders SET fulfilled = true WHERE id = $1";
        await pool.query(query, [orderId]);
    }
}

export default ordersDb;
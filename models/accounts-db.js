import pool from './database.js';
import logger from '../utils/logger.js';
import location from './location.js';

const accountsDb = {
    async addUser(user) {
        try{
            await pool.query("INSERT INTO accounts (firstname, lastname, email, password, street, city, zip, country, lat, lon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                [user.firstname, user.lastname, user.email, user.password, user.street, user.city, user.zip, user.country, user.lat, user.lon]);
            logger.info("Successfully added user");
            return {
                msg: "Successfully added user",
                success: true
            }
        } catch (error) {
            if(error.code === "23505"){ //unique violation, email existiert bereits
                return {
                    msg: "Diese e-mail ist bereits registiert",
                    success: false
                }
            } else {
                logger.error(error);
                throw error;
            }
        }
    },
    async authenticateUser(user) {
        const query = "SELECT * FROM accounts WHERE email = $1 AND password = $2";
        const values = [user.email, user.password];
        try{
            let dbResponse = await pool.query(query, values);
            if(dbResponse.rows[0] !== undefined){
                //Koordinaten gleich bei login in session speichern für mindestbestellwert berechnung
                const userCoords = await location.getCoordinates({
                    street: dbResponse.rows[0].street,
                    city: dbResponse.rows[0].city,
                    zip: dbResponse.rows[0].zip,
                    country: dbResponse.rows[0].country,});

                if(userCoords){
                    dbResponse.rows[0].lat = userCoords.lat;
                    dbResponse.rows[0].lon  = userCoords.lon;
                }

                return dbResponse.rows[0];
            } else {
                logger.info("User not found.");
                return undefined;
            }
        } catch (error){
            logger.error(error);
            throw error;
        }
    }
}

export default accountsDb;
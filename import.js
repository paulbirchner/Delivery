import fs from "node:fs";
import { parse } from "csv-parse";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

if(!process.env.DB_CON_STRING) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
}

const pool = new pg.Pool({
    connectionString: process.env.DB_CON_STRING
})

const __dirname = new URL(".", import.meta.url).pathname;

const processFile = async () => {
    const records = [];
    const parser = fs.createReadStream(`${__dirname}import/products.csv`).pipe(
        parse({
            // komma ist default
            from_line: 2 // erste zeile überspringen
        }),
    );
    for await (const record of parser) {
        const category = record[0];
        const name = record[1];
        const description = record[2];
        const imageUri = record[3];
        const priceCent = record[4];

        try{
            await pool.query(
                'INSERT INTO products (category, name, description, imageuri, pricecent)' +
                'VALUES ($1, $2, $3, $4, $5)',
                [category, name, description, imageUri, priceCent]
            )
            }catch(error){
                console.error(error);
            }
    }
    console.log("import abgeschlossen");
    await pool.end();
};

(async () => {
    const records = await processFile();
    console.info(records);
})();
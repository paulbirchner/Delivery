import logger from '../utils/logger.js';



const location = {
    async getCoordinates(address){

        console.log(address);                                               //postalcode nicht zip
        const query = `&street=${address.street}&city=${address.city}&postalcode=${address.zip}&country=${address.country}`;
        const url = `https://nominatim.openstreetmap.org/search?format=geocodejson${query}`;

        try{
            const response = await fetch(url);
            const data = await response.json();
            logger.info("Api data: ", data);

            if(data.features && data.features.length > 0){
                const lon = data.features[0].geometry.coordinates[0];
                const lat = data.features[0].geometry.coordinates[1];
                return {
                    lat: lat,
                    lon: lon
                };
            }
            return null;

        } catch (error){
            logger.error("Api Error: ", error);
            throw error;
        }
    }
}

export default location;
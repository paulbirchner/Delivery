import logger from "../utils/logger.js";
import accountsDb from "../models/accounts-db.js";
import location from "../models/location.js";

const accounts = {
    signupForm(req,res){
        const ViewData = {
            title: "Signup"
        };
        res.render("registrieren", ViewData);
    },
    loginForm(req,res){
        const ViewData = {
            title: "Login"
        };
        res.render("login", ViewData);
    },
    async register(req,res){
        const user = req.body;
        try { //coordinaten gleich bei registrierung hinzufügen da sonst lange wartezeit bei adminview wegen vielen api aufrufen
            const coords = await location.getCoordinates({
                street: user.street,
                city: user.city,
                zip: user.zip,
                country: user.country
            });

            if(coords){
                user.lat = coords.lat;
                user.lon = coords.lon;
            } else {
                //adresse nicht gefunden
                return res.render("registrieren", {
                    error: "Die Adresse konnte nicht gefunden werden. Bitte überprüfen Sie ihre Eingaben",
                    values: user
                });
            }
        } catch(err){
            logger.error(err);
            return res.render("registrieren", {
                error: "Fehler bei Adressprüfung. Bitte versuchen Sie es später erneut",
                values: user
            })
        }
        //Adresse Gültig => SPeichern
        let response = await accountsDb.addUser(user);
        if(response.success === false){
            return res.render("registrieren", {
                error: response.msg,
                values: user
            })
        }
        res.redirect("/login");
    },
    async authenticate(req,res){
        const user = await accountsDb.authenticateUser(req.body);
        if(user){
            logger.info("User successfully authenticated");
            req.session.user = {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                isAdmin: user.is_admin,
                street: user.street,
                city: user.city,
                zip: user.zip,
                country: user.country,
                lat: user.lat,
                lon: user.lon
            }
            res.redirect("/speisekarte");
        } else {
            logger.error("Wrong user info");
            return res.render("login",{
                error: "Wrong user info"
            });
        }
    },
    logout(req,res){
        req.session.destroy();
        logger.info("User logged out");
        res.redirect("/");
    }
}

export default accounts;
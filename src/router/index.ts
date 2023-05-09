import express from "express";

import authentication from "./authentication";
import users from "./users";
import warehouses from "./warehouses";


const router = express.Router();

export default (): express.Router => {
    authentication(router)
    users(router);
    warehouses(router);

    return router;
};
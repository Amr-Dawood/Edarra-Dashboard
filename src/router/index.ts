import express from "express";

import authentication from "./authentication";
import users from "./users";
import warehouses from "./warehouses";
import requests from "./requests";


const router = express.Router();

export default (): express.Router => {
    authentication(router)
    users(router);
    warehouses(router);
    requests(router);

    return router;
};
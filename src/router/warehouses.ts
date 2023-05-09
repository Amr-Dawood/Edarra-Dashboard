import express from "express";
import {isAdmin, isAuthenticated, isOwner} from "../middlewares";
import {
    createWarehouse,
    deleteWarehouse,
    getAllWarehouses,
    supervisorWarehouse,
    updateWarehouse
} from "../controllers/warehouses";


export default (router: express.Router) => {
    router.get('/warehouses', isAuthenticated, getAllWarehouses);

    router.post('/warehouse', isAuthenticated, isAdmin, createWarehouse);

    router.put('/warehouse/:id', isAuthenticated, isAdmin, updateWarehouse);

    router.delete('/warehouse/:id', isAuthenticated, isAdmin, deleteWarehouse);

    // only warehouse owner "supervisor" could call the blow
    router.get('/warehouse/supervisor/:id', isAuthenticated, isOwner,  supervisorWarehouse);

}
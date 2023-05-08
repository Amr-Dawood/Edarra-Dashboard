import express from "express";

import {deleteUser, getAllUsers, updateUser} from "../controllers/users";
import {isAdmin, isAuthenticated} from "../middlewares";




export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/user/:id', isAuthenticated, isAdmin, deleteUser);
    router.patch('/user/:id', isAuthenticated, isAdmin, updateUser);
}
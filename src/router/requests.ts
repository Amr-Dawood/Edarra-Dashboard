import express from "express";
import {isAdmin, isAuthenticated} from "../middlewares";
import {
    approveRequest,
    createRequest,
    listAllRequests,
    listSupervisorRequests,
    rejectRequest
} from "../controllers/requests";


export default (router: express.Router) => {

    router.post('/request', isAuthenticated, createRequest);

    router.get('/requests', isAuthenticated, isAdmin, listAllRequests);

    router.get('/requests/supervisor/:id', isAuthenticated, isAdmin, listSupervisorRequests);

    router.put('/request/approve/:id', isAuthenticated, isAdmin, approveRequest);

    router.put('/request/reject/:id', isAuthenticated, isAdmin, rejectRequest);

}
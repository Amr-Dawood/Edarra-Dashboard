import express from "express";
import {get, merge} from "lodash";

import {getUserById, getUserBySessionToken} from "../models/users";


export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        const sessionToken = req.cookies['EDAARA']
        if (!sessionToken)
            return res.sendStatus(403);

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser)
            return res.sendStatus(403);

        merge(req, {identity: existingUser});

        return next();

    } catch (error) {
        console.log(error)
    }
}


export const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {id} = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        const loggedInUser = await getUserById(currentUserId);

        if (loggedInUser.usertype !== 'admin')
            return res.status(400).json({error: 'Permission Denied '});

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
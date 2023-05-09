import express from "express";
import {createUser, getUserByEmail, getUserById, getUserByUserName} from "../models/users";
import {authentication, random} from "../helpers";


export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {username, password} = req.body;

        if (!username || !password)
            return res.status(400).json({error: 'Bad Request - sorry, but you have to enter username and password'});

        const user = await getUserByUserName(username).select('+authentication.salt +authentication.password');

        if (!user)
            return res.status(400).json({error: 'Bad Request - user is not exists, recheck user'});

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password != expectedHash)
            return res.status(403).json({error: 'Bad Request - wrong password'});

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('EDAARA', user.authentication.sessionToken, {domain: 'localhost'});

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}



export const logout = async (req: express.Request, res: express.Response) => {
    try {

        // Clear the session cookie by setting it to an empty string with an expiration time of 0
        res.clearCookie('EDAARA', { domain: 'localhost', expires: new Date(0) });

        // Send a success response
        res.status(200).send('Successfully logged out.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}



export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {username, password, email, usertype} = req.body;

        if (!username || !password || !email || !usertype)
            return res.sendStatus(400);


        const existingUser = await getUserByEmail(email);
        const findByUserName = await getUserByUserName(username);

        if (findByUserName)
            return res.status(400).json({error: 'Bad Request - Invalid Input, Duplicate Username'});

        if (existingUser)
            return res.status(400).json({error: 'Bad Request - Invalid Input, Duplicate Email'});


        const salt = random();
        const user = await createUser({
            username,
            email,
            usertype,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });
        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }


}
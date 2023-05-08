import express from "express";
import {deleteUserById, getUserByEmail, getUserById, getUsers} from "../models/users";


export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {

        const users = await getUsers();
        return res.status(200).json(users);

    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}


export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {

        const {id} = req.params;
        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser);

    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }

}

export const updateUser = async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const {username, phone, email, status} = req.body;
    const user = await getUserById(id);
    try {

        if (!user)
            return res.status(404).send('User not found');

        if (email && email !== user.email) {
            const existingUser = await getUserByEmail(email);


            if (existingUser) {
                return res.status(400).json({error: 'Email already exists'});
            }

            user.email = req.body.email;
        }


        user.phone = email || user.phone;
        user.status = status || user.status;

        await user.save();

        return res.status(200).json(user).end();

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}
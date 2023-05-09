import express from 'express';
import mongoose from 'mongoose';
import {add} from "lodash";

// Import the Request model
const RequestStock = require('../models/requests');
const Product = require('../models/products');


export const createRequest = async (req: express.Request, res: express.Response) => {

    try {
        // Create a new request with the given attributes
        const request = new RequestStock({
            supervisorId: req.body.supervisorId,
            status: req.body.status,
            currentStock: req.body.currentStock,
            desiredStock: req.body.desiredStock,
            productId: req.body.productId
        });

        // Save the request to the database
        const savedRequest = await request.save();

        // Update the corresponding product object with the new request
        // const productId = req.body.productId;
        // const product = await Product.findById(productId);
        // product.requests.push(savedRequest);
        // await product.save();

        // Return the saved request
        res.status(200).send(savedRequest);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}


export const listAllRequests = async  (req: express.Request, res: express.Response) => {
    try {
        const requests = await RequestStock.find();
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const listSupervisorRequests = async (req: express.Request, res: express.Response) => {
    try {
        const supervisorId = req.params.id;
        const requests = await RequestStock.find({ supervisorId });

        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const approveRequest = async (req: express.Request, res: express.Response) => {
    try {
        const requestId = req.params.id;
        const request = await RequestStock.findById(requestId).populate('product');

        // Update product stock
        request.product.stock = request.desiredStock;
        await request.product.save();

        // Update request status
        request.status = 'approved';
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}


export const rejectRequest = async (req: express.Request, res: express.Response) => {
    try {
        const requestId = req.params.id;

        // Update request status to rejected
        const updatedRequest = await RequestStock.findByIdAndUpdate(
            requestId,
            { status: 'rejected' },
            { new: true }
        );

        res.json(updatedRequest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
import express from "express";
import {getUserById} from "../models/users";


const Warehouse = require('../models/warehouses');
const Product = require('../models/products');


export const createWarehouse = async (req: express.Request, res: express.Response) => {
    try {
        // Create a new warehouse with the given attributes
        const warehouse = new Warehouse({
            name: req.body.name,
            location: req.body.location,
            supervisor_id: req.body.supervisor_id,
            status: req.body.status,
        });

        // Save the warehouse to the database
        const savedWarehouse = await warehouse.save();

        // Create an array of products to add to the warehouse
        const products = req.body.products.map((product) => {
            return new Product({
                name: product.name,
                description: product.description,
                stock: product.stock,
                warehouse_id: savedWarehouse._id,
            });
        });

        // Save the products to the database
        const savedProducts = await Product.insertMany(products);

        // Add the saved products to the warehouse
        savedWarehouse.products = savedProducts;
        console.log(savedWarehouse)
        // Save the updated warehouse to the database
        await savedWarehouse.save();
        // Return the saved warehouse with products
        res.status(201).send(savedWarehouse);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }

}

export const updateWarehouse = async (req: express.Request, res: express.Response) => {
    try {
        const warehouseId = req.params.id;
        const { products, name, location, supervisor_id, status } = req.body;



        // Update warehouse document
        const warehouse = await Warehouse.findById(warehouseId);

        warehouse.phone = name || warehouse.name;
        warehouse.location = location || location.status;
        warehouse.supervisor_id = supervisor_id || location.supervisor_id;
        warehouse.status = status || location.status;


        // Update products array for the warehouse
        await Product.deleteMany({ warehouse_id: warehouseId });
       const savedProducts =  await Product.insertMany(products.map(product => ({
            ...product,
            warehouse_id: warehouseId,
        })));

        warehouse.products = savedProducts;
        warehouse.save();


        res.json(warehouse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

}


export const getAllWarehouses = async (req: express.Request, res: express.Response) => {

    try {
        const warehouses = await Warehouse.find().populate('products');
        const warehousesWithProducts = await Promise.all(
            warehouses.map(async (warehouse) => {
                const supervisor = await getUserById(warehouse.supervisor_id);
                if (!warehouse.products) {
                    warehouse.products = [];
                }
                const products = await Promise.all(
                    warehouse.products.map(async (productId) => {
                        const product = await Product.findById(productId);
                        return product;
                    })
                );
                const warehouseWithProducts = {...warehouse.toObject(), supervisor, products};
                return warehouseWithProducts;
            })
        );
        res.status(200).send(warehousesWithProducts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}


export const deleteWarehouse = async (req: express.Request, res: express.Response) => {
    const warehouseId = req.params.id;
    try {
        // Delete products associated with the warehouse
        await Product.deleteMany({ warehouse_id: warehouseId });

        // Delete the warehouse
        const deletedWarehouse = await Warehouse.findByIdAndDelete(warehouseId);
        if (!deletedWarehouse) {
            return res.status(404).send({ message: 'Warehouse not found' });
        }
        res.send({ message: 'Warehouse and products deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error deleting warehouse and products' });
    }
}
import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubcription, getUserSubscriptions } from "../controllers/subscriptions.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', ( req, res ) => {
    res.send( {
        title : 'Get All Subscriptions'
    });
})

subscriptionRouter.get('/:id', ( req, res ) => {
    res.send( {
        title : 'Get All Subscriptions details'
    });
})

subscriptionRouter.post('/', authorize, createSubcription );

subscriptionRouter.put('/:id', ( req, res ) => {
    res.send( {
        title : 'Update Subscriptions'
    });
})

subscriptionRouter.delete('/:id', ( req, res ) => {
    res.send( {
        title : 'Delete Subscriptions'
    });
})

subscriptionRouter.get('/user/:id', authorize , getUserSubscriptions)

subscriptionRouter.put('/:id/cancel', ( req, res ) => {
    res.send( {
        title : 'Cancel Subscriptions'
    });
})

subscriptionRouter.get('/upcomming-renewals', ( req, res ) => {
    res.send( {
        title : 'Get upcoming renewals'
    });
})


export default subscriptionRouter;

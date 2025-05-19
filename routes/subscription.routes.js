import { Router } from "express";

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

subscriptionRouter.post('/', ( req, res ) => {
    res.send( {
        title : 'Create Subscriptions details'
    });
})

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

subscriptionRouter.get('/user/:id', ( req, res ) => {
    res.send( {
        title : 'Get All User Subscriptions'
    });
})

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

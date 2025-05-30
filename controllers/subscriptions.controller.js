import { SERVER_URL } from '../config/env.js';
import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';


export const createSubcription = async (req, res, next) => { 
  try {
    const subscription = await Subscription.create({
        ...req.body,
        user: req.user._id,
    }); 

    const { workflowRunId } = await workflowClient.trigger({
        url : `${SERVER_URL}/api/v1/workflows/subscriptions/reminder`,
        body : {
            subscriptionId: subscription._id,
        },
        headers: {
            "Content-Type": "application/json",
        },
        retries : 0,
    })

    res.status(201).json({
        status: true,
        data: {
            subscription,
            workflowRunId,
        },
    });
  }  catch (error) {
    next(error);
  }  
}

export const getUserSubscriptions = async (req, res, next) => {

    console.log("Get User Subscriptions");
    try {
        if ( req.user.id !== req.params.id ) {

            const error = new Error("You are not authorized to view this user's subscriptions");
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find( {
            user : req.params.id,
        })

        res.status(200).json({
            status: true,
            data: {
                subscriptions,
            },
        });
        
    } catch (error) {
        console.log(error);
        next(error);
    }
}
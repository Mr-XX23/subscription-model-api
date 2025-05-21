import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();    

userRouter.get('/', getUser);

userRouter.get('/:id', authorize, getUsers);

userRouter.post('/', )

userRouter.put('/:id', ( req, res ) => {
    res.send( {
        title : 'Update a User'
    });
})

userRouter.delete('/:id', ( req, res ) => {
    res.send( {
        title : 'Delete a User'
    });
})


export default userRouter;

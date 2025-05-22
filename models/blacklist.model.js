

import mongoose from "mongoose";
const BlacklistSchema = new mongoose.Schema(
    {
        token: {
            type : String,
            required: [true, "Token is required"],
            ref : "User",
        }, 
    }, 
    {
        timestamps: true,
    }
)

export default mongoose.model("Blacklist", BlacklistSchema);
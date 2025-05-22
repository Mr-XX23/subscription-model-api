import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Subscription is required"],
        trim: true,
        minLength: 2,
        maxLength: 50
    },

    price : {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },

    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY"],
        default: "USD",
        required: [true, "Currency is required"],
    },

    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
    },

    category: {
        type: String,
        enum: ["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "others"],
        required: [true, "Frequency is required"],
    },

    paymentMethod: {
        type: String,
        trim: true,
        required: [true, "Payment method is required"],
    },

    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active",
    },

    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate: {
            validator: ( value ) => value <= new Date(),
            message: "Start date cannot be in the past",
        }
    },

    renewalDate: {
        type: Date,
        validate: {
            validator: function ( value ) {
                value > this.startDate
            },
            message: "Start date cannot be in the past",
        }
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
    },

}, {
    timestamps: true
});

// Autocalculate renewal date if missing
subscriptionSchema.pre('save', function ( next ) {

    if ( !this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // Check if the subscription is expired
    if ( this.renewalDate < new Date() ) {
        this.status = "expired";
    }

    next();
})

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
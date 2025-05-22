import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";
import { sendEmailReminder } from "../utils/send-email.js";

const reminder = [7,5,2,1];

export const sendReminder = serve( async (context) => {
    const { subscriptionId } = await context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;

    const renewalDDate = dayjs(subscription.renewalDate);

    if (renewalDDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    for( const dayBefore of reminder ) {
        const reminderDate = renewalDDate.subtract(dayBefore, "day");

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilRemider(context, `${dayBefore} day before reminder`, reminderDate);
        }

        await triggerReminder(context, `Reminder ${dayBefore} day before`, subscription);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
     return await context.run("get subscription", async () => {
        return Subscription.findById(subscriptionId).populate("user", "name email");
     })
}

const sleepUntilRemider = async ( context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendEmailReminder({
            to: subscription.user.email,
            type: label,
            subscription: subscription,
        })
    });
}
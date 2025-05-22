import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dayjs from "dayjs";
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";

const reminder = [7,5,2,1];

export const sendReminder = serve( async (context) => {
    const { subscriptionId } = await context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== "active") return;

    const renewalDDate = dayjs(subscription.renewalDate);

    if (renewalDDate.isBefore(dayjs())) {
        console.log("Renewal date is before today. Stopping workflow.");
        return;
    }


    for( const dayBefore of reminder ) {
        const reminderDate = renewalDDate.subtract(dayBefore, "day");

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilRemider(context, `Reminder-${dayBefore} day before`, reminderDate);
        }

        await triggerReminder(context, `Reminder-${dayBefore} day before`);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
     return await context.run("get subscription", () => {
        return Subscription.findById(subscriptionId).populate("user", "name email");
     })
}

const sleepUntilRemider = async ( context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
    });
}
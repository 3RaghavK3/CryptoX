import { Worker } from "bullmq";
import { connection, alertQueue } from "../config/bullmq.js";
import * as alertRepo from "../05-repository/alerts.repository.js";
import * as authRepo from "../05-repository/auth.repository.js";
import transporter from "../config/email.js";

const worker = new Worker(
  "alert-sync",
  async (job) => {
    console.log(`Processing job ${job.name} (ID: ${job.id})`);

    if (job.name === "process-alerts") {
      try {
        // 1. Process satisfied alerts (marks as COMPLETED and creates PENDING notifications)
        await alertRepo.processSatisfiedAlerts();
        
        // 2. Fetch all unsent notifications (PENDING or FAILED) to attempt email dispatch
        const notifications = await alertRepo.getUnsentNotifications();
        console.log(`Fetched ${notifications.length} unsent notifications for dispatch.`);

        if (notifications.length > 0) {
          console.log(`Triggering email dispatch for ${notifications.length} notifications...`);

          for (const notif of notifications) {
            try {
              const user = await authRepo.findUserById(notif.user_id);

              const subject = `CryptoX - Price Alert for ${notif.coin_id}`;
              const action = notif.notification_type === "PRICE_ABOVE" ? "risen above" : "dropped below";

              await transporter.sendMail({
                from: "33raghavk33@gmail.com",
                to: user.email,
                subject,
                html: `
                  <h2>CryptoX Price Alert</h2>
                  <p>Hello ${user.name || "User"},</p>
                  <p>Your price alert for <strong>${notif.coin_id}</strong> has been triggered!</p>
                  <p>The coin price has ${action} your target threshold.</p>
                  <ul>
                    <li><strong>Target Price:</strong> $${Number(notif.target_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</li>
                    <li><strong>Current Price:</strong> $${Number(notif.current_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</li>
                  </ul>
                  <p>Check the market on CryptoX for more details!</p>
                `,
              });

              await alertRepo.updateNotificationStatus(notif.notification_id, "SENT");
              console.log(`Sent alert email to ${user.email} for coin ${notif.coin_id}`);
            } catch (err: any) {
              console.error(`Failed to send email for notification ${notif.notification_id}:`, err.message);
              await alertRepo.updateNotificationStatus(notif.notification_id, "FAILED");
            }
          }
        }
      } catch (error: any) {
        console.error("Error processing satisfied alerts:", error.message);
        throw error;
      }
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.name} completed successfully.`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.name} failed with error:`, err);
});

const setupJobs = async () => {
  console.log("Clearing old alert job schedulers...");
  const schedulers = await alertQueue.getJobSchedulers();
  for (const scheduler of schedulers) {
    if (scheduler.id) await alertQueue.removeJobScheduler(scheduler.id);
  }

  console.log("Adding repeatable alert check job (every 1 minute)...");
  await alertQueue.upsertJobScheduler(
    "scheduler-process-alerts",
    { pattern: "* * * * *" },
    { name: "process-alerts", opts: { removeOnComplete: true, removeOnFail: true } }
  );

  console.log("Scheduler setup complete for alerts.");
};

setupJobs().catch(console.error);

console.log("BullMQ Worker started and listening on 'alert-sync' queue...");

// webhooks.js (fix filename to webhooks.js)
import { exec } from "child_process";

export default function setupWebhooks(app) {
  app.post("/pull-install-deploy", (req, res) => {
    try {
        const payload = req.body;
        console.log("received webhook");
        
        if (payload.ref === "refs/heads/master") {
        console.log("Changes detected on main. Pulling latest changes...");

        exec("sh pull-install-deploy.sh", (err, stdout, stderr) => {
            if (err) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send("Git pull failed");
            }
            console.log(`Git Pull Output: ${stdout}`);
            res.status(200).send("Updated successfully");
        });
        } 
        else {
        res.status(200).send("Not on main, ignoring...");
        }
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).send("Internal server error");
    }
    });
}
import app from "./app";

const { exec } = require("child_process");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post("/pull-install-deploy", (req, res) => {
  const payload = req.body;
  console.log("recieved webhook");
  if (payload.ref === "refs/heads/main") {
    console.log("Changes detected on main. Pulling latest changes...");

    exec("sh pull-install-deploy.sh", (err: any, stdout: any, stderr: any) => {
      if (err) {
        console.error(`Error: ${stderr}`);  
        return res.status(500).send("Git pull failed");
      }
      console.log(`Git Pull Output: ${stdout}`);
      res.status(200).send("Updated successfully");
    });
  } else {
    res.status(200).send("Not on main, ignoring...");
  }
});

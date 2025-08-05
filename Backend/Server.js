const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors")
const PORT = 3000 || process.env.PORT;

const { ConnectToDB } = require("./Config/db");

const fs = require('fs');
const path = require('path');
const morgan = require('morgan')

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'Logs', 'server.log'),
    { flags: 'a' } // append mode
);

app.use(morgan('combined', { stream: accessLogStream }));

const { userRoute } = require("./Routes/user.routes");
const { logRoute } = require("./Routes/log.routes")
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173"
    ],
    credentials: true
}))

app.get("/test", (req, res) => {
    res.json({ message: "This is test endpoint." });
});

app.use("/user", userRoute);
app.use("/logged", logRoute)

app.listen(PORT, () => {
    ConnectToDB();
    console.log("Server Started:", PORT);
});

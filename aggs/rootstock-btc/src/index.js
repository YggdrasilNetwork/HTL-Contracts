import express from "express";
import doCrossChainSwap from "./swap.js";

const app = express();
const port = 4000;

app.get("/", (_, res) => {
    res.send("Hello World!");
});

app.get("/swap", async (req, res) => {
    const recipient = req.query.recipient;
    const amount = req.query.amount;
    const timelock = req.query.timelock;

    try {
        if (!recipient || !amount || !timelock) {
            throw new Error("Missing required parameters");
        }
    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
    }
    try {
        await doCrossChainSwap(recipient, amount, timelock);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

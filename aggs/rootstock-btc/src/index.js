import express from "express";
import doCrossChainSwap from "./swap.js";

const app = express();
const port = 4000;

app.get("/", (_, res) => {
    res.send("Hello World!");
});

app.get("/swap", (req, res) => {
    const recipient = req.query.recipient;
    const amount = req.query.amount;
    const timelock = req.query.timelock;

    doCrossChainSwap(recipient, amount, timelock)
        .then(() => res.send("Swap completed successfully"))
        .catch((error) => res.status(500).send(`Error: ${error.message}`));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

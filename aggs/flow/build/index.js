"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flowAggregator_1 = require("./services/flowAggregator");
const aggregator = new flowAggregator_1.FlowAggregator();
aggregator.run().catch(console.error);

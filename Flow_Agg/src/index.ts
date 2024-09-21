import { FlowAggregator } from "./services/flowAggregator";

const aggregator = new FlowAggregator();
aggregator.run().catch(console.error);

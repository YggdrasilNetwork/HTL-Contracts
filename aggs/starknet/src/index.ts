import { StarknetAggregator } from "./services/starknetAggregator";

const aggregator = new StarknetAggregator();
aggregator.run().catch(console.error);

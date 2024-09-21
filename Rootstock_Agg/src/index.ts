import { RootstockAggregator } from "./services/rootstockAggregator";

const aggregator = new RootstockAggregator();
aggregator.run().catch(console.error);

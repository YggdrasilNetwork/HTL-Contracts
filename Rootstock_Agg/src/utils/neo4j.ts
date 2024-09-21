import neo4j, { Driver } from "neo4j-driver";
import { loadEnv } from "../config/dotenv";

// Load environment variables
loadEnv();

export const createDriver = (): Driver => {
  const URI = process.env.NEO4J_URI || "bolt://localhost:7687";
  const USERNAME = process.env.NEO4J_USERNAME || "neo4j";
  const PASSWORD = process.env.NEO4J_PASSWORD || "password";

  return neo4j.driver(URI, neo4j.auth.basic(USERNAME, PASSWORD));
};

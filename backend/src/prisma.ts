import { PrismaClient } from "./generated/prisma/client.js";

// This PrismaClient class is Db - client used to query postgres

/**
 * Creating a single PrismaClient instance and exporting it
 * Re-using a single instance to avoid too many DB connections
*/

const prisma = new PrismaClient();

export default prisma;

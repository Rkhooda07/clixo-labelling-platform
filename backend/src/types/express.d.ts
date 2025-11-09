import type { User } from "@prisma/client"; // optional if using Prisma’s User type

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;       // matches your User.id type (Int)
        address?: string; // optional, if you store wallet address
      };
    }
  }
}

export {};
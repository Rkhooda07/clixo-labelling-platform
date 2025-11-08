import { empty } from "@prisma/client/runtime/library";

export type IncomingOption = {
  ipfs_cid: string;
  ipfs_uri?: string | null;
  gateway_url: string;
  image_url?: string | null;
  option_id?: number | null;
};

export type createTaskBody = {
  title: String,
  signature: String,
  amount: String,
  options: IncomingOption[];
}

export function validateCreateTaskBody(body: any) {
  const errors: string[] = [];

  // Basic shape check
  if (!body || typeof body != "object" || Array.isArray(body)) {
    errors.push("Request body must be a JSON object");
    return { valid: false, errors };
  }


  // Title checks
  if (!("title" in body) || typeof body.title !== "string" || body.title.trim().length === 0) {
    errors.push("Title is required and must be a non-empty string");
    return { valid: false, errors};
  }
}
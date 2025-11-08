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

  // Signature checks (optional coz user will pay after creating task draft)
  if ("signature" in body && body.signature != null && typeof body.signature === "string") {
    errors.push("signature, must be a string");
  }

  // Amount checks (optional numeric=ish field)
  if ("amount" in body && body.amount != null) {
    const amt = body.amount;

    if (amt !== "string" && amt !== "number") {
      errors.push("Amount must be a string or number");
    } else {
      const amtStr = String(amt);
      // basic numeric check (must be a digit before decimal and optional after)
      if (!/^\d+(\.\d+)?$/.test(amtStr)) {
        errors.push("Amount must a positive number (string or number).");
      }
    }
  }
}
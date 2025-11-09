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
  } else if (body.title.trim().length > 200) {
    errors.push("Title must be 200 characters or fewer.");
  }

  // Signature checks (optional coz user will pay after creating task draft)
  if ("signature" in body && body.signature != null && typeof body.signature !== "string") {
    errors.push("signature, must be a string");
  }

  // Amount checks (optional numeric=ish field)
  if ("amount" in body && body.amount != null) {
    const amt = body.amount;

    if (typeof amt !== "string" && typeof amt !== "number") {
      errors.push("Amount must be a string or number");
    } else {
      const amtStr = String(amt);
      // basic numeric check (must be a digit before decimal and optional after)
      if (!/^\d+(\.\d+)?$/.test(amtStr)) {
        errors.push("Amount must a positive number (string or number).");
      }
    }
  }

  // Options checks
  if (!("options" in body) || !Array.isArray(body.options)) {
    errors.push("options is req. and must be an array");
  }
  else if (body.options.length === 0) {
    errors.push("options must contain atleast one element");
  }
  else if (body.options.length > 7) {
    errors.push("options cannot contain more than 7 items.");
  } else {
    body.options.forEach((opt: any, idx: Number) => {
      const ctx = `options[${idx}]`;
      if (!opt || typeof opt !== "object" || Array.isArray(opt)) {
        errors.push(`${ctx} must be an object`);
        return;
      }

      // ipfs_cid required: minimal sanity checks
      if (!("ipfs_cid" in opt) || typeof opt.ipfs_cid !== "string" || opt.ipfs_cid.trim().length === 0) {
        errors.push(`${ctx}.ipfs_cid is required and must be a non-empty string.`);
      } else if (opt.ipfs_cid.length < 8) {
        errors.push(`${ctx}.ipfs_cid looks too short to be a valid CID.`);
      }

      // gateway_url required: basic URL pattern check (no network call)
      if (!("gateway_url" in opt) || typeof opt.gateway_url !== "string" || opt.gateway_url.trim().length === 0) {
        errors.push(`${ctx}.gateway_url is required and must be a non-empty string.`);
      } else {
        // Very small URL sanity check; allows IPFS gateway patterns and typical HTTP/HTTPS.
        const url = opt.gateway_url.trim();
        if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url) || !url.includes("/ipfs/")) {
          errors.push(`${ctx}.gateway_url must be an http(s) URL and contain "/ipfs/".`);
        }
      }

      // ipfs_uri: optional, string if present
      if ("ipfs_uri" in opt && opt.ipfs_uri != null && typeof opt.ipfs_uri !== "string") {
        errors.push(`${ctx}.ipfs_uri, if present, must be a string.`);
      }

      // image_url: optional, string if present (could be CDN)
      if ("image_url" in opt && opt.image_url != null && typeof opt.image_url !== "string") {
        errors.push(`${ctx}.image_url, if present, must be a string.`);
      }

      // option_id: optional, must be integer if present
      if ("option_id" in opt && opt.option_id != null) {
        const o = opt.option_id;
        if (typeof o !== "number" || !Number.isInteger(o) || o < 0) {
          errors.push(`${ctx}.option_id, if present, must be a non-negative integer.`);
        }
      }
    }); 
  }

  return { valid: errors.length === 0, errors};
}
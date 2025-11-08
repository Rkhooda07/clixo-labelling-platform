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

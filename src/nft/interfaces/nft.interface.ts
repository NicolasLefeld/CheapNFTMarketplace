export interface Nft {
  original_creator: string;
  owner: string;
  created_at: string;
  contractAddress: string;
  transactions: [{ hash: string; from: string; operation: string }];
}

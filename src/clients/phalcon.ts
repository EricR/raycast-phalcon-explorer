import axios from "axios";

class TxnSearchResult {
  chainID: int;
  txnHash: string;
}

export function searchTxn(txnHash: string) {
  return axios.post("https://explorer.phalcon.xyz/api/v1/tx/search",
    { "txnHash": txnHash },
    { headers: {
      "Host": "explorer.phalcon.xyz",
      "User-Agent": "Raycast Extension (Phalcon Explorer)"
    }}
  );
}

import axios from "axios";

class ChainId {
  name: string
  shortName: string

  public constructor(params: Object) {
    this.name = params.name
    this.shortName = params.shortName
  }
}

export function getAllChains() {
  let chains = {};

  return axios.get("https://chainid.network/chains.json", {
    headers: {
      "Host": "chainid.network",
      "User-Agent": "Raycast Extension (Phalcon Explorer)"
    }
  }).then((res) => {
    res.data?.map((chain) => {
      chains[chain.chainId] = new ChainId(chain);
    });
    return chains;
  });
}

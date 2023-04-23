import { ActionPanel, Action, List, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { getAllChains, ChainId } from "./clients/chainid";
import { searchTxn, TxnSearchResult } from "./clients/phalcon";
import axios from "axios";

let chainIds = null;

export default function Command() {
  const [state, setState] = useState<State>({
    isLoading: false
  });

  const search = (text: string) => {
    if (!text.startsWith("0x") || text.length < 16) return;

    setState({ isLoading: true });

    searchTxn(text).then((res) => {
      setState({ isLoading: false, txns: res.data.txns as Array<TxnSearchResult> });
    }).catch((err) => {
      setState({ isLoading: false, txns: [] });
      showToast({
        title: err.response?.data["message"] || "Something went wrong searching Phalcon",
        style: Toast.Style.Failure
      }); 
    });
  }

  if (!chainIds) {
    getAllChains().then((data) => {
      chainIds = data;
    }).catch((err) => {
      showToast({
        title: "Something went wrong fetching Chain ID data",
        style: Toast.Style.Failure
      });
    });
  }

  return (
    <List throttle onSearchTextChange={search} isLoading={state.isLoading}>
      <List.Section title="Results" subtitle={`${state.txns?.length} transaction(s) found`}>
        {state.txns?.map((txn) => (
          <List.Item
            key={txn.txnHash}
            title={txn.txnHash}
            accessories={[{ text: chainIds[txn.chainID].name }]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action.OpenInBrowser
                    title="Show"
                    url={`https://explorer.phalcon.xyz/tx/${chainIds[txn.chainID].shortName}/${txn.txnHash}`}
                  />
                  <Action.OpenInBrowser
                    title="Debug"
                    url={`https://explorer.phalcon.xyz/tx/${chainIds[txn.chainID].shortName}/${txn.txnHash}?debugLine=0&line=0`}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  )
}

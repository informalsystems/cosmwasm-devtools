import {
  SlButton,
  SlDialog,
  SlDivider,
  SlInput,
  SlMenuItem,
  SlMenuLabel,
  SlSelect,
} from "@shoelace-style/shoelace/dist/react";
import type SlSelectElement from "@shoelace-style/shoelace/dist/components/select/select";
import type SlInputElement from "@shoelace-style/shoelace/dist/components/input/input";
import React, { FC, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import styles from "./SendCoins.module.css";
import { sendCoins } from "../features/accounts/accountsSlice";

interface SendCoinsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SendCoins: FC<SendCoinsProps> = ({ open, setOpen }) => {
  const dispatch = useAppDispatch();
  const sender = useAppSelector((state) => state.accounts.currentAccount!);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const accounts = useAppSelector((state) =>
    Object.values(state.accounts.accountList).filter(
      (account) => account.address !== sender
    )
  );
  const contracts = useAppSelector((state) =>
    Object.values(state.contracts.contractList)
  );

  function dispatchSend() {
    dispatch(sendCoins({ sender, recipient, amount, memo }));
    setOpen(false);
  }

  return (
    <SlDialog
      label="Send coins"
      open={open}
      onSlAfterHide={() => setOpen(false)}
      className={styles.dialog}
    >
      <div className={styles.form}>
        <SlSelect
          placeholder="Recipient"
          value={recipient}
          className={styles.label}
          hoist={true}
          onSlChange={(e) =>
            setRecipient((e.target as SlSelectElement).value as string)
          }
        >
          <SlMenuLabel>Accounts</SlMenuLabel>
          {accounts.map((account) => (
            <SlMenuItem value={account.address} key={account.address}>
              {account.label || account.address}
            </SlMenuItem>
          ))}
          <SlDivider />
          <SlMenuLabel>Contracts</SlMenuLabel>
          {contracts.map((contract) => (
            <SlMenuItem value={contract.address} key={contract.address}>
              {contract.label || contract.address}
            </SlMenuItem>
          ))}
        </SlSelect>
        <SlInput
          placeholder="Amount"
          value={amount}
          className={styles.amount}
          onSlChange={(e) =>
            setAmount((e.target as SlInputElement).value.trim())
          }
        />
        <SlInput
          placeholder="Memo"
          value={memo}
          className={styles.memo}
          onSlChange={(e) => setMemo((e.target as SlInputElement).value.trim())}
        />
        <SlButton variant="neutral" onClick={() => dispatchSend()}>
          Send
        </SlButton>
      </div>
    </SlDialog>
  );
};

import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import { Identity } from "@onflow/types";
import { generateCode, getAddress } from "./utility";
import vaultContract from "./contracts/Vault.cdc";
import txSetupUserVault from "./transactions/user-vault.cdc";
import txMintTokens from "./transactions/mint-tokens.cdc";
import txTransferTokens from "./transactions/transfer-tokens.cdc";
import checkReference from "./scripts/checkRef.cdc";
import vaultBalance from "./scripts/vaultBalance.cdc";

export const getUserAddress = async () => {
  const user = fcl.currentUser();
  const snapshot = await user.snapshot();
  return getAddress(snapshot);
};

export const deploy = async () => {
  const user = fcl.currentUser();
  const { authorization } = user;
  const code = await generateCode(vaultContract);
  return fcl.send(
    [
      sdk.transaction`
          transaction {
            prepare(acct: AuthAccount) {
              acct.setCode("${(p) => p.code}".decodeHex())
            }
          }
        `,
      fcl.params([
        fcl.param(Buffer.from(code, "utf8").toString("hex"), Identity, "code"),
      ]),
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.authorizations([authorization]),
      fcl.limit(100),
    ],
    {
      node: "http://localhost:8080",
    }
  );
};

export const initVault = async (contractAddress) => {
  const user = fcl.currentUser();
  const { authorization } = user;
  const snapshot = await user.snapshot();
  const address = getAddress(snapshot);

  let initCode = await generateCode(txSetupUserVault, {
    query: /(0x01|0x02)/g,
    "0x01": contractAddress,
    "0x02": address,
  });

  return fcl.send(
    [
      sdk.transaction`${initCode}`,
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.authorizations([authorization]),
      fcl.limit(100),
    ],
    {
      node: "http://localhost:8080",
    }
  );
};

export const checkVault = async (contractAddress) => {
  const user = fcl.currentUser();
  const snapshot = await user.snapshot();
  const address = getAddress(snapshot);

  const scriptCode = await generateCode(checkReference, {
    query: /(0x01|0x02)/g,
    "0x01": contractAddress,
    "0x02": address,
  });

  const script = sdk.script`${scriptCode}`;
  const response = await fcl.send([script]);
  console.log(response);

  return fcl.decode(response);
};

export const getBalance = async (contractAddress) => {
  const user = fcl.currentUser();
  const snapshot = await user.snapshot();
  const address = getAddress(snapshot);

  const scriptCode = await generateCode(vaultBalance, {
    query: /(0x01|0x02)/g,
    "0x01": contractAddress,
    "0x02": address,
  });
  const script = sdk.script`${scriptCode}`;
  const response = await fcl.send([script]);
  return fcl.decode(response);
};

export const mint = async (contractAddress, recipient, amount) => {
  const user = fcl.currentUser();
  const { authorization } = user;

  let mintCode = await generateCode(txMintTokens, {
    query: /(0x01|0x02|AMOUNT)/g,
    "0x01": contractAddress,
    "0x02": recipient,
    AMOUNT: amount,
  });

  return fcl.send(
    [
      sdk.transaction`${mintCode}`,
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.authorizations([authorization]),
      fcl.limit(100),
    ],
    {
      node: "http://localhost:8080",
    }
  );
};

export const transfer = async (params) => {
  const { contractAddress, recipient, amount } = params;
  const user = fcl.currentUser();
  const { authorization } = user;

  let transferCode = await generateCode(txTransferTokens, {
    query: /(0x01|0x02|AMOUNT)/g,
    "0x01": contractAddress,
    "0x02": recipient,
    AMOUNT: amount,
  });

  return fcl.send(
    [
      sdk.transaction`${transferCode}`,
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.authorizations([authorization]),
      fcl.limit(100),
    ],
    {
      node: "http://localhost:8080",
    }
  );
};

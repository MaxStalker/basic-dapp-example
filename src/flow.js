import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import { Identity } from "@onflow/types";
import { generateCode, getUrlParam, getAddress  } from "./utility";
import userVault from "./transactions/user-vault.cdc";
import checkRef from "./scripts/checkRef.cdc";

export const deploy = async (code) => {
  const user = fcl.currentUser();
  const { authorization } = user;
  const response = await fcl.send(
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

  console.log({ response });
};

export const initVault = async (contractAddress) => {
  const user = fcl.currentUser();
  const { authorization } = user;
  const snapshot = await user.snapshot();
  const address = getAddress(snapshot);

  let initCode = await generateCode(userVault, {
    query: /(0x01|0x02)/g,
    "0x01": contractAddress,
    "0x02": address,
  });

  // TODO: Write contract address to local storage
};

export const checkVault = async (contractAddress) => {
  const user = fcl.currentUser();
  const snapshot = await user.snapshot();
  const address = getAddress(snapshot);

  const scriptCode = await generateCode(checkRef, {
    query: /(0x01|0x02)/g,
    "0x01": contractAddress,
    "0x02": address,
  });

  const script = sdk.script`${scriptCode}`;
  const response = await fcl.send([script]);
  // console.log(response);

  return await fcl.decode(response);
}



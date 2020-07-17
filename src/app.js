import "regenerator-runtime/runtime";
import * as fcl from "@onflow/fcl";
import { userInterface } from "./ui";
import "./flow";
import { generateCode, getUrlParam } from "./utility";
import { checkVault, deploy } from "./flow";

import fileVaultContract from "./contracts/Vault.cdc";
import userVault from "./transactions/user-vault.cdc";

const getAddress = (user) => {
  return user.addr;
};

const update = (user) => {
  if (user.cid) {
    const address = getAddress(user);
    const isAdmin = getUrlParam("admin");
    if (isAdmin) {
      userInterface.showAdmin(true);
    }

    userInterface.showProfile(true);
    userInterface.showLoginButton(false);
    userInterface.showLoginProcess(false);
    userInterface.setView("init");
    userInterface.setUserAddress(address);
  } else {
    userInterface.showAdmin(false);
    userInterface.showProfile(false);
    userInterface.showLoginButton(true);
    userInterface.clearUserAddress();
  }
};

const startLogin = async () => {
  console.log("start login!");
  userInterface.showLoginButton(false);
  userInterface.showLoginProcess(true);
  await fcl.authenticate();
  const contractAddress = localStorage.getItem("contractAddress");
  if (contractAddress) {
    const checkResult = await checkVault(contractAddress);
    console.log({ checkResult });
  } else {
    console.log('Init vault first...');
  }
};
userInterface.onLoginClick(startLogin);

userInterface.onLogoutClick(() => {
  fcl.unauthenticate();
});

userInterface.onDeployClick(async () => {
  const vaultContract = await generateCode(fileVaultContract);
  console.log({ vaultContract });
  await deploy(vaultContract);
  console.log("Contract deployed");
});

userInterface.onInitClick(async () => {
  console.log("Init vault!");
});

fcl
  .config()
  .put("challenge.handshake", "http://localhost:8702/flow/authenticate");

fcl.currentUser().subscribe(update);

/*
const loadCode = async () => {
  const txCode = await generateCode(mainVault, {
    query: /(0x01|0x02)/g,
    "0x01": "FIRST",
    "0x02": "SECOND",
  });
  console.log(txCode);
};
*/

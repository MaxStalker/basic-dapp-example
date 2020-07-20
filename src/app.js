import "regenerator-runtime/runtime";
import * as fcl from "@onflow/fcl";
import { userInterface } from "./ui";
import "./flow";
import { generateCode, getUrlParam } from "./utility";
import {
  checkVault,
  mint,
  deploy,
  getBalance,
  getUserAddress,
  initVault,
  transfer,
} from "./flow";

import fileVaultContract from "./contracts/Vault.cdc";
import userVault from "./transactions/user-vault.cdc";

const KEY_CONTRACT_ADDRESS = "contractAddress";

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
    userInterface.checkVaultAddress();
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
  const contractAddress = localStorage.getItem(KEY_CONTRACT_ADDRESS);
  console.log({ contractAddress });
  if (contractAddress) {
    const checkResult = await checkVault(contractAddress);
    console.log({ checkResult });
    console.log("We shall start polling for balance");
    userInterface.vaultAddressValue.innerText = contractAddress;
    userInterface.setView("manage");
    await startBalancePoll();
  } else {
    console.log("Init vault first...");
  }
};

let pollId = null;
const startBalancePoll = async () => {
  const contractAddress = localStorage.getItem(KEY_CONTRACT_ADDRESS);
  const balance = await getBalance(contractAddress);
  userInterface.setBalance(balance);
  pollId = setTimeout(startBalancePoll, 2000);
};

const startInit = () => {};

userInterface.onLoginClick(startLogin);

userInterface.onLogoutClick(() => {
  userInterface.setView("login");
  userInterface.showProfile(false);
  fcl.unauthenticate();
});

userInterface.onDeployClick(async () => {
  await deploy();
  console.log("Vault Contract Deployed! ✅");
});

userInterface.onTopUp(async () => {
  const contractAddress = userInterface.vaultContractAddress;
  const userAddress = await getUserAddress();
  const response = await mint(contractAddress, userAddress, 100);
});

userInterface.onCompleteTransfer(async () => {
  const contractAddress = localStorage.getItem(KEY_CONTRACT_ADDRESS);
  const recipient = userInterface.transferAddress.value;
  const amount = userInterface.transferAmount.value;
  const response = await transfer({ contractAddress, recipient, amount });
});

userInterface.onInitClick(async () => {
  const contractAddress = userInterface.vaultContractAddress;
  const check = await checkVault(contractAddress);

  if (!check) {
    const initResponse = await initVault(contractAddress);
    // TODO: Somehow figure out if transaction was resolved
    // maybe via response.transactionId...
    if (true) {
      localStorage.setItem(KEY_CONTRACT_ADDRESS, contractAddress);
      startBalancePoll();
    }
  } else {
    startBalancePoll();
  }
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

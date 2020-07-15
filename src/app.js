import "regenerator-runtime/runtime";
import * as fcl from "@onflow/fcl";
import { userInterface } from "./ui";
import "./flow";

const getAddress = (user) => {
  return user.addr;
};

const update = (user) => {
  if (user.cid) {
    const address = getAddress(user);
    userInterface.showProfile(true);
    userInterface.setUserAddress(address);
    userInterface.showLoginButton(false);
    userInterface.showLoginProcess(false);
    userInterface.setView("init");
  } else {
    userInterface.showProfile(false);
    userInterface.clearUserAddress();
    userInterface.showLoginButton(true);
  }
};

userInterface.onLoginClick(async () => {
  userInterface.showLoginButton(false);
  userInterface.showLoginProcess(true);
  await fcl.authenticate();
});

userInterface.onLogoutClick(() => {
  fcl.unauthenticate();
});

fcl
  .config()
  .put("challenge.handshake", "http://localhost:8702/flow/authenticate");

fcl.currentUser().subscribe(update);

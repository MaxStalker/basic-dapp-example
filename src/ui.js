import { nodeWithId, validateAddress } from "./utility";

export const statusContainer = nodeWithId("status");
export const statusLabel = nodeWithId("status-label");
export const statusValue = nodeWithId("status-value");

export const setStatus = (active) => {
  if (active) {
    statusContainer.classList.remove("inactive");
  } else {
    statusContainer.classList.add("inactive");
  }
};
export const toggleStatus = () => {
  statusContainer.classList.toggle("inactive");
};

export const activate = setStatus(true);

export const setStatusLabel = (newLabel) => {
  statusLabel.innerText = newLabel;
};

export const setStatusValue = (newValue) => {
  statusValue.innerText = newValue;
};

export const vaultAddress = nodeWithId("vault-address");
export const toAddress = nodeWithId("to-address");
export const startBtn = nodeWithId("start");
export const cancelBtn = nodeWithId("cancel");
export const depositMain = nodeWithId("deposit-main");
export const depositForm = nodeWithId("deposit-form");
export const showDepositUI = (show) => {
  if (show) {
    depositForm.classList.remove("hidden");
    depositMain.classList.add("hidden");
    vaultAddress.classList.add("hidden");
    toAddress.focus();
  } else {
    depositForm.classList.add("hidden");
    depositMain.classList.remove("hidden");
    vaultAddress.classList.remove("hidden");
  }
};

cancelBtn.addEventListener("click", () => {
  showDepositUI(false);
});

startBtn.addEventListener("click", () => {
  showDepositUI(true);
});

/*
export const controls = nodeWithId("controls");
const twoButtons = controls.querySelector(".two-button-group");
const processing = controls.querySelector(".processing");
controls.addEventListener("click", () => {
  twoButtons.classList.toggle("hidden");
  processing.classList.toggle("hidden");
});
*/

const showNode = (node, show) => {
  const operation = show ? "remove" : "add";
  node.classList[operation]("hidden");
};

class UserInterface {
  constructor() {
    this.loginView = nodeWithId("login-view");
    this.initView = nodeWithId("init-view");
    this.manageView = nodeWithId("manage-view");
    this.views = document.querySelectorAll(".view");

    this.adminBlock = nodeWithId("admin-block");
    this.profileBlock = nodeWithId("profile-block");
    this.userAddress = this.profileBlock.querySelector(".address-block__value");

    this.initForm = nodeWithId("init-form");
    this.vaultContractInput = nodeWithId("vault-contract-address");
    this.vaultContractAddress = "";
    this.initProcessing = this.initView.querySelector(".processing");

    this.balanceValue = nodeWithId("balance-value");
    this.vaultAddressValue = nodeWithId("vault-address-value");

    this.btnDeploy = nodeWithId("deploy-contract");
    this.btnTopUp = nodeWithId("top-up");

    this.btnInit = nodeWithId("init-vault");
    this.btnLogin = nodeWithId("login");
    this.loginProcessing = this.loginView.querySelector(".processing");

    this.btnLogout = nodeWithId("logout");

    this.btnSend = nodeWithId("send");
    this.transferAddress = nodeWithId("to-address");
    this.transferAmount = nodeWithId("to-amount");
    // Add listeners
    this.vaultContractInput.addEventListener(
      "input",
      this.handleVaultContractInput
    );
  }

  setView = (name) => {
    this.views.forEach((view) => {
      showNode(view, view.id === `${name}-view`);
    });

    if (name === "init") {
      console.log("Reset init view fields");
      this.btnInit.disabled = true;
      this.vaultContractInput.value = "";
    }
  };

  setBalance = (balance) => {
    this.balanceValue.innerText = balance;
  };

  showLoginProcess = (show) => {
    showNode(this.loginProcessing, show);
  };

  showLoginButton = (show) => {
    showNode(this.btnLogin, show);
  };

  showProfile = (show) => {
    showNode(this.profileBlock, show);
  };

  showAdmin = (show) => {
    showNode(this.adminBlock, show);
  };

  setUserAddress = (address) => {
    this.userAddress.textContent = `0x${address}`;
  };

  clearUserAddress = () => {
    this.userAddress.textContent = "--";
  };

  handleVaultContractInput = (event) => {
    const { value } = event.target;
    this.vaultContractAddress = value;
    const { error } = validateAddress(value);
    console.log({ error });
    // TODO: add address verification here
    this.btnInit.disabled = error;
    if (error) {
    }
  };

  checkVaultAddress = () => {
    this.vaultContractAddress = localStorage.getItem("contractAddress") || "";
    if (this.vaultContractAddress) {
      // show balance view
      // start pinging balance
    } else {
      showNode(this.initForm, true);
      showNode(this.initProcessing, false);
    }
  };

  onLoginClick = (callback) => {
    this.btnLogin.onclick = callback;
  };

  onLogoutClick = (callback) => {
    this.btnLogout.onclick = callback;
  };

  onDeployClick = (callback) => {
    this.btnDeploy.onclick = callback;
  };

  onInitClick = (callback) => {
    this.btnInit.onclick = callback;
  };

  onTopUp = (callback) => {
    this.btnTopUp.onclick = callback;
  };

  onCompleteTransfer = (callback) => {
    this.btnSend.onclick = callback;
  };
}

export const userInterface = new UserInterface();

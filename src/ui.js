export const statusContainer = document.getElementById("status");
export const statusLabel = document.getElementById("status-label");
export const statusValue = document.getElementById("status-value");

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

export const setBalance = setStatusValue;

export const vaultAddress = document.getElementById("vault-address");
export const toAddress = document.getElementById("to-address");
export const startBtn = document.getElementById("start");
export const cancelBtn = document.getElementById("cancel");
export const depositMain = document.getElementById("deposit-main");
export const depositForm = document.getElementById("deposit-form");
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
export const controls = document.getElementById("controls");
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
    this.loginView = document.getElementById("login-view");
    this.initView = document.getElementById("init-view");
    this.manageView = document.getElementById("manage-view");
    this.views = document.querySelectorAll(".view");

    this.adminBlock = document.getElementById("admin-block");
    this.profileBlock = document.getElementById("profile-block");
    this.userAddress = this.profileBlock.querySelector(".address-block__value");

    this.btnDeploy = document.getElementById("deploy-contract");
    this.btnInit = document.getElementById("init-vault");
    this.btnLogin = document.getElementById("login");
    this.loginProcessing = this.loginView.querySelector(".processing");

    this.btnLogout = document.getElementById("logout");
  }

  setView = (name) => {
    this.views.forEach((view) => {
      showNode(view, view.id === `${name}-view`);
    });
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
}

export const userInterface = new UserInterface();

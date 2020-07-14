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

export const toAddress = document.getElementById("to-address");
export const startBtn = document.getElementById("start");
export const cancelBtn = document.getElementById("cancel");
export const depositMain = document.getElementById("deposit-main");
export const depositForm = document.getElementById("deposit-form");
export const showDepositUI = (show) => {
  if (!show) {
    depositForm.style.display = "none";
    depositMain.style.display = "block";
  } else {
    depositForm.style.display = "block";
    depositMain.style.display = "none";
    toAddress.focus();
  }
};

cancelBtn.addEventListener("click", () => {
  showDepositUI(false);
});

startBtn.addEventListener("click", () => {
  showDepositUI(true);
});

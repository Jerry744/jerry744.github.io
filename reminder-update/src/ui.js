import { t } from "./i18n.js";

const onboardingProgress = document.getElementById("onboardingProgress");
const step1Card = document.getElementById("step1Card");
const step2Card = document.getElementById("step2Card");
const step3Card = document.getElementById("step3Card");
const prevStepBtn = document.getElementById("prevStepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");
const browserStatusText = document.getElementById("browserStatusText");
const portStatusText = document.getElementById("portStatusText");
const selectPortBtn = document.getElementById("selectPortBtn");
const doneStatusText = document.getElementById("doneStatusText");
const flashBtn = document.getElementById("flashBtn");
const cancelFlashBtn = document.getElementById("cancelFlashBtn");
const copyHelpBtn = document.getElementById("copyHelpBtn");
const restartBtn = document.getElementById("restartBtn");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const statusText = document.getElementById("statusText");
const logArea = document.getElementById("logArea");
const browserErrorCard = document.getElementById("browserErrorCard");
const mainFlow = document.getElementById("mainFlow");

let busy = false;
let currentStep = 1;

export function isBusy() {
  return busy;
}

export function setBusy(value) {
  busy = value;
}

export function getCurrentStep() {
  return currentStep;
}

export function setCurrentStep(value) {
  currentStep = value;
}

export function getSelectedPort() {
  return window.__selectedPort ?? null;
}

export function setSelectedPort(port) {
  window.__selectedPort = port;
}

export const terminal = {
  clean() {
    logArea.textContent = "";
  },
  writeLine(data) {
    logArea.textContent += `${data}\n`;
    logArea.scrollTop = logArea.scrollHeight;
  },
  write(data) {
    logArea.textContent += data;
    logArea.scrollTop = logArea.scrollHeight;
  },
};

export function setStatus(text, type = "") {
  statusText.textContent = `${t("statusPrefix")}${text}`;
  statusText.className = `status ${type}`.trim();
}

export function setSimpleStatus(el, text, type = "") {
  el.textContent = `${t("statusPrefix")}${text}`;
  el.className = `status ${type}`.trim();
}

export function setProgress(percent) {
  const safe = Math.max(0, Math.min(100, percent));
  progressBar.style.width = `${safe}%`;
  progressText.textContent = `${t("progressPrefix")}${safe.toFixed(1)}%`;
}

export function browserSupported() {
  const hasSerial = typeof navigator !== "undefined" && "serial" in navigator;
  return hasSerial;
}

export function lockUI(locked) {
  busy = locked;
  flashBtn.disabled = locked;
  selectPortBtn.disabled = locked;
  prevStepBtn.disabled = locked || currentStep === 1;
  nextStepBtn.disabled = locked || currentStep === 3;

  if (locked) {
    flashBtn.textContent = t("flashBtnBusy");
    cancelFlashBtn.classList.remove("hidden");
  } else {
    flashBtn.textContent = t("flashBtnIdle");
    cancelFlashBtn.classList.add("hidden");
  }
}

export function updateStepUI() {
  const cards = [step1Card, step2Card, step3Card];
  cards.forEach((card, index) => {
    const stepNumber = index + 1;
    card.classList.toggle("hidden", stepNumber !== currentStep);
  });

  const waitingPortSelection = currentStep === 2 && !getSelectedPort();

  onboardingProgress.textContent = t("onboardingStep", currentStep, 3);
  prevStepBtn.disabled = busy || currentStep === 1;
  nextStepBtn.disabled = busy || currentStep === 3;
  nextStepBtn.classList.toggle("primary", !waitingPortSelection && currentStep !== 3);
}

export function highlightSelectPortButton() {
  selectPortBtn.classList.remove("needs-attention");
  // Force reflow so repeated clicks can replay highlight animation.
  void selectPortBtn.offsetWidth;
  selectPortBtn.classList.add("needs-attention");
}

export function showBrowserError() {
  browserErrorCard.classList.remove("hidden");
  mainFlow.classList.add("hidden");
}

export function hideBrowserError() {
  browserErrorCard.classList.add("hidden");
  mainFlow.classList.remove("hidden");
}

export function showLog() {
  logArea.classList.remove("hidden-debug");
  logArea.setAttribute("aria-hidden", "false");
}

export function hideLog() {
  logArea.classList.add("hidden-debug");
  logArea.setAttribute("aria-hidden", "true");
}

export function showCopyHelp() {
  copyHelpBtn.style.display = "";
}

export function hideCopyHelp() {
  copyHelpBtn.style.display = "none";
}

export function showRestart() {
  restartBtn.classList.remove("hidden");
  flashBtn.classList.add("hidden");
}

export function hideRestart() {
  restartBtn.classList.add("hidden");
  flashBtn.classList.remove("hidden");
}

export function showDoneStatus(text, type = "ok") {
  doneStatusText.className = `status ${type}`;
  doneStatusText.textContent = text;
  doneStatusText.classList.remove("hidden");
}

export function hideDoneStatus() {
  doneStatusText.classList.add("hidden");
}

export {
  prevStepBtn,
  nextStepBtn,
  selectPortBtn,
  flashBtn,
  cancelFlashBtn,
  copyHelpBtn,
  restartBtn,
  browserStatusText,
  portStatusText,
  statusText,
  progressBar,
  progressText,
  logArea,
};

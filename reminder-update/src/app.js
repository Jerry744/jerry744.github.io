import { TOTAL_STEPS } from "./constants.js";
import {
  browserSupported,
  getCurrentStep,
  setCurrentStep,
  updateStepUI,
  lockUI,
  setSimpleStatus,
  setStatus,
  showBrowserError,
  hideBrowserError,
  hideLog,
  hideRestart,
  hideCopyHelp,
  hideDoneStatus,
  setSelectedPort,
  getSelectedPort,
  setProgress,
  portStatusText,
  highlightSelectPortButton,
  browserStatusText,
  prevStepBtn,
  nextStepBtn,
  selectPortBtn,
  flashBtn,
  cancelFlashBtn,
  copyHelpBtn,
  restartBtn,
} from "./ui.js";
import { doFlash, cancelFlash, selectPort, copyHelp } from "./flash.js";
import {
  detectLanguageToken,
  applyPageI18n,
  setLanguageToken,
  t,
} from "./i18n.js";

function canGoToStep(step) {
  if (step === 2) return browserSupported();
  if (step === 3) return !!getSelectedPort();
  return true;
}

function goNextStep() {
  const next = getCurrentStep() + 1;
  if (next <= TOTAL_STEPS && canGoToStep(next)) {
    setCurrentStep(next);
    updateStepUI();
  } else if (next === 2 && !browserSupported()) {
    setSimpleStatus(browserStatusText, t("browserNotSupportedNext"), "error");
  } else if (next === 3 && !getSelectedPort()) {
    setSimpleStatus(portStatusText, t("selectPortDialogHint"), "error");
    highlightSelectPortButton();
    setStatus(t("selectPortInStep2"), "error");
  }
}

function goPrevStep() {
  const prev = getCurrentStep() - 1;
  if (prev >= 1) {
    setCurrentStep(prev);
    updateStepUI();
  }
}

async function handleSelectPort() {
  await selectPort();
  updateStepUI();
}

function handleRestart() {
  setSelectedPort(null);
  setCurrentStep(1);
  hideRestart();
  hideCopyHelp();
  hideDoneStatus();
  setProgress(0);
  setStatus(t("waitingStart"), "");
  hideLog();
  updateStepUI();
}

function init() {
  detectLanguageToken();
  applyPageI18n();
  const langEnBtn = document.getElementById("langEnBtn");
  const langZhBtn = document.getElementById("langZhBtn");
  langEnBtn?.addEventListener("click", () => {
    setLanguageToken("en");
    applyPageI18n();
    updateStepUI();
    setStatus(t("waitingStart"), "");
  });
  langZhBtn?.addEventListener("click", () => {
    setLanguageToken("zh-CN");
    applyPageI18n();
    updateStepUI();
    setStatus(t("waitingStart"), "");
  });
  if (!browserSupported()) {
    showBrowserError();
    setSimpleStatus(browserStatusText, t("browserNotSupportedLong"), "error");
    setStatus(t("browserCheckFailed"), "error");
  } else {
    hideBrowserError();
    setSimpleStatus(browserStatusText, t("browserCheckPassed"), "ok");
    setStatus(t("waitingStart"), "");
  }

  hideRestart();
  hideCopyHelp();
  hideDoneStatus();
  updateStepUI();

  prevStepBtn.addEventListener("click", goPrevStep);
  nextStepBtn.addEventListener("click", goNextStep);
  selectPortBtn.addEventListener("click", handleSelectPort);
  flashBtn.addEventListener("click", doFlash);
  cancelFlashBtn.addEventListener("click", cancelFlash);
  copyHelpBtn.addEventListener("click", copyHelp);
  restartBtn.addEventListener("click", handleRestart);
}

init();

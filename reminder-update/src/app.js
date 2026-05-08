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
  hideCompletionModal,
  setSelectedPort,
  getSelectedPort,
  setSelectedManualFirmware,
  setProgress,
  portStatusText,
  highlightSelectPortButton,
  browserStatusText,
  prevStepBtn,
  nextStepBtn,
  selectPortBtn,
  manualUploadBtn,
  manualUploadInput,
  flashBtn,
  cancelFlashBtn,
  copyHelpBtn,
  restartBtn,
  completionConfirmBtn,
} from "./ui.js";
import { doFlash, cancelFlash, selectPort, copyHelp } from "./flash.js";
import {
  LANGUAGE,
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

function handleManualUpload() {
  if (!manualUploadInput) return;
  manualUploadInput.value = "";
  manualUploadInput.click();
}

function handleManualUploadChange(event) {
  const target = event.target;
  const file = target?.files?.[0] ?? null;
  setSelectedManualFirmware(file);

  if (file) {
    setStatus(`${t("manualUploadSelected")}: ${file.name}`, "ok");
  }
}

function syncRuntimeStatusTexts() {
  if (!browserSupported()) {
    setSimpleStatus(browserStatusText, t("browserNotSupportedLong"), "error");
  } else {
    setSimpleStatus(browserStatusText, t("browserCheckPassed"), "ok");
  }

  if (getSelectedPort()) {
    setSimpleStatus(portStatusText, t("portSelected"), "ok");
  } else {
    setSimpleStatus(portStatusText, t("notSelectedPort"));
  }
}

function handleRestart() {
  setSelectedPort(null);
  setSelectedManualFirmware(null);
  setCurrentStep(1);
  hideRestart();
  hideCopyHelp();
  hideDoneStatus();
  hideCompletionModal();
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
    syncRuntimeStatusTexts();
    updateStepUI();
    setStatus(t("waitingStart"), "");
  });
  langZhBtn?.addEventListener("click", () => {
    setLanguageToken(LANGUAGE.ZH);
    applyPageI18n();
    syncRuntimeStatusTexts();
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
  completionConfirmBtn.addEventListener("click", handleRestart);
  manualUploadBtn?.addEventListener("click", handleManualUpload);
  manualUploadInput?.addEventListener("change", handleManualUploadChange);
}

init();

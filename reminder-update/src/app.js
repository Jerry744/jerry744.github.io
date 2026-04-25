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
  setSelectedFirmwareFile,
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
  firmwareFileInput,
  toggleFileInputBtn,
} from "./ui.js";
import {
  doFlash,
  cancelFlash,
  selectPort,
  copyHelp,
  onFirmwareFileSelected,
} from "./flash.js";

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
    setSimpleStatus(browserStatusText, "浏览器不支持，无法进入下一步。", "error");
  } else if (next === 3 && !getSelectedPort()) {
    setSimpleStatus(portStatusText, "请先点击“选择串口”并在弹窗中选中设备端口。", "error");
    highlightSelectPortButton();
    setStatus("请先在第二步选择串口", "error");
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
  setSelectedFirmwareFile(null);
  setCurrentStep(1);
  hideRestart();
  hideCopyHelp();
  hideDoneStatus();
  setProgress(0);
  setStatus("等待开始", "");
  hideLog();
  updateStepUI();
}

function init() {
  if (!browserSupported()) {
    showBrowserError();
    setSimpleStatus(
      browserStatusText,
      "浏览器不支持在线刷写，请使用桌面版 Chrome 或 Edge 打开本页面。",
      "error"
    );
    setStatus("浏览器检查未通过", "error");
  } else {
    hideBrowserError();
    setSimpleStatus(browserStatusText, "浏览器检查通过，可以进入下一步。", "ok");
    setStatus("等待开始", "");
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
  firmwareFileInput.addEventListener("change", onFirmwareFileSelected);
  toggleFileInputBtn.addEventListener("click", () => {
    firmwareFileInput.classList.toggle("hidden");
  });
}

init();

const LANGUAGE = {
  ZH: "zh-CN",
  EN: "en",
};

let languageToken = LANGUAGE.EN;

const MESSAGES = {
  [LANGUAGE.ZH]: {
    pageTitle: "更新固件，解锁 Halfmind Reminder 的 AI 功能",
    eyebrow: "Halfmind Reminder 固件升级",
    browserErrorTitle: "浏览器不支持",
    browserErrorDesc:
      "在线刷写功能需要使用 Chrome 或 Edge 浏览器的最新版本。请下载支持的浏览器后重新打开本页面。",
    supportWechat: "请加微信halfmind-kaike获取一对一帮助",
    downloadEdge: "下载 Edge",
    onboardingStep: (step, total) => `第 ${step} / ${total} 步`,
    step1Title: "第一步：连接设备",
    step1Desc: "使用附带磁吸数据线连接设备，如图示方向。请加微信halfmind-kaike获取一对一帮助。",
    step1ImageAlt: "磁吸数据线连接设备方向示意图",
    step2Title: "第二步：选择串口",
    step2Desc:
      "点击下方按钮后，请在系统弹窗里选择你的设备端口（通常会显示为 USB Serial / USB 串口 等名称，适用于 macOS 和 Windows）。",
    selectPortBtn: "选择串口",
    step3Title: "第三步：刷入固件",
    step3Desc: "系统会根据语言自动选择固件，无需手动下载或上传本地 .bin 文件。",
    flashBtnIdle: "开始刷入固件",
    flashBtnBusy: "正在刷入...",
    cancelFlashBtn: "取消刷写",
    copyHelpBtn: "复制故障排查步骤",
    restartBtn: "重新升级另一台设备",
    tips: "操作建议：升级期间请勿断开数据线；如果失败，先重启设备后再试一次。",
    prevBtn: "返回",
    nextBtn: "下一步",
    statusPrefix: "状态：",
    progressPrefix: "进度：",
    donePrefix: "完成：",
    waitingStart: "等待开始",
    browserChecking: "浏览器检查中...",
    notSelectedPort: "尚未选择串口",
    browserNotSupportedNext: "浏览器不支持，无法进入下一步。",
    selectPortInStep2: "请先在第二步选择串口",
    selectPortDialogHint: "请先点击“选择串口”并在弹窗中选中设备端口。",
    browserNotSupportedLong: "浏览器不支持在线刷写，请使用桌面版 Chrome 或 Edge 打开本页面。",
    browserCheckFailed: "浏览器检查未通过",
    browserCheckPassed: "浏览器检查通过，可以进入下一步。",
    pleaseSelectPortFirst: "请先在第二步选择串口",
    preparingConnection: "正在准备连接...",
    loadedFirmware: "已加载固件",
    connectingDevice: "正在连接设备...",
    connectTimeout: "连接设备超时，请检查设备是否已正确连接并可响应。",
    chipConnected: "已连接芯片",
    flashCancelled: "刷写已取消",
    flashingFirmware: "正在刷写固件，请勿断开连接...",
    flashDone: "刷写完成，设备已自动重启",
    firmwareUpgradeDone: "完成：固件升级已完成。现在可以断开设备连接。",
    flashSuccess: "刷写成功。",
    flashFailed: "刷写失败",
    errorPrefix: "错误",
    disconnectWarning: "断开串口时出现提示",
    portSelected: "已选择串口，可进入第三步刷写。",
    portReady: "串口已准备就绪",
    portNotSelected: "未选择串口",
    troubleshootingHelp:
      "故障排查建议：\n1. 使用 Chrome 或 Edge 最新版本。\n2. 更换支持数据传输的 USB 线。\n3. 关闭串口调试工具后重试。\n4. 断电重启设备后，再次连接刷写。",
    helpCopied: "故障排查步骤已复制",
    clipboardNotAllowed: "当前浏览器不允许剪贴板写入，请手动复制故障排查步骤",
  },
  [LANGUAGE.EN]: {
    pageTitle: "Update firmware to unlock Halfmind Reminder AI features",
    eyebrow: "Halfmind Reminder Firmware Update",
    browserErrorTitle: "Browser Not Supported",
    browserErrorDesc:
      "Online flashing requires the latest desktop Chrome or Edge. Please install a supported browser and reopen this page.",
    supportWechat: "Add WeChat halfmind-kaike for one-on-one help",
    downloadEdge: "Download Edge",
    onboardingStep: (step, total) => `Step ${step} / ${total}`,
    step1Title: "Step 1: Connect Device",
    step1Desc:
      "Connect the device with the magnetic data cable in the illustrated direction. Add WeChat halfmind-kaike for one-on-one help.",
    step1ImageAlt: "Illustration of magnetic data cable connection direction",
    step2Title: "Step 2: Select Serial Port",
    step2Desc:
      "Click the button below, then choose your device port in the system dialog (usually shown as USB Serial, on macOS and Windows).",
    selectPortBtn: "Select Serial Port",
    step3Title: "Step 3: Flash Firmware",
    step3Desc: "Firmware is selected automatically by language. No manual .bin download or upload is required.",
    flashBtnIdle: "Start Flashing",
    flashBtnBusy: "Flashing...",
    cancelFlashBtn: "Cancel",
    copyHelpBtn: "Copy Troubleshooting Steps",
    restartBtn: "Flash Another Device",
    tips: "Tip: Keep the cable connected during upgrade. If it fails, restart the device and try again.",
    prevBtn: "Back",
    nextBtn: "Next",
    statusPrefix: "Status:",
    progressPrefix: "Progress:",
    donePrefix: "Done:",
    waitingStart: "Waiting to start",
    browserChecking: "Checking browser support...",
    notSelectedPort: "No serial port selected",
    browserNotSupportedNext: "Browser is not supported. Cannot continue.",
    selectPortInStep2: "Please select a serial port in step 2 first",
    selectPortDialogHint: "Click Select Serial Port and choose your device in the popup.",
    browserNotSupportedLong:
      "Browser does not support online flashing. Please use desktop Chrome or Edge.",
    browserCheckFailed: "Browser check failed",
    browserCheckPassed: "Browser check passed. You can continue.",
    pleaseSelectPortFirst: "Please select a serial port in step 2 first",
    preparingConnection: "Preparing connection...",
    loadedFirmware: "Firmware loaded",
    connectingDevice: "Connecting to device...",
    connectTimeout: "Device connection timed out. Check cable and device response.",
    chipConnected: "Chip connected",
    flashCancelled: "Flashing canceled",
    flashingFirmware: "Flashing firmware. Do not disconnect...",
    flashDone: "Flashing completed. Device restarted automatically",
    firmwareUpgradeDone: "Done: Firmware upgrade completed. You can disconnect now.",
    flashSuccess: "Flashing succeeded.",
    flashFailed: "Flashing failed",
    errorPrefix: "Error",
    disconnectWarning: "Disconnect warning",
    portSelected: "Serial port selected. You can proceed to step 3.",
    portReady: "Serial port is ready",
    portNotSelected: "Serial port not selected",
    troubleshootingHelp:
      "Troubleshooting:\n1. Use latest Chrome or Edge.\n2. Try a USB data cable.\n3. Close serial monitor tools and retry.\n4. Power-cycle device and retry.",
    helpCopied: "Troubleshooting steps copied",
    clipboardNotAllowed: "Clipboard write is blocked in this browser. Please copy manually.",
  },
};

function isChineseLocale(locale) {
  if (!locale) return false;
  return locale.toLowerCase().startsWith("zh");
}

export function detectLanguageToken() {
  const localeList = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language];
  const hasChinese = localeList.some(isChineseLocale);
  languageToken = hasChinese ? LANGUAGE.ZH : LANGUAGE.EN;
  return languageToken;
}

export function getLanguageToken() {
  return languageToken;
}

export function setLanguageToken(token) {
  languageToken = token === LANGUAGE.ZH ? LANGUAGE.ZH : LANGUAGE.EN;
  return languageToken;
}

export function t(key, ...args) {
  const value = MESSAGES[languageToken][key];
  if (typeof value === "function") {
    return value(...args);
  }
  return value ?? key;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

export function applyPageI18n() {
  document.documentElement.lang = languageToken;
  setText("title", t("pageTitle"));
  setText(".eyebrow", t("eyebrow"));
  setText("h1", t("pageTitle"));
  setText("#browserErrorCard h2", t("browserErrorTitle"));
  setText("#browserErrorCard p:nth-of-type(1)", t("browserErrorDesc"));
  setText("#browserErrorCard p:nth-of-type(2)", t("supportWechat"));
  setText("#browserErrorCard a", t("downloadEdge"));
  setText("#step1Card .step-title", t("step1Title"));
  setText("#step1Card .step-desc", t("step1Desc"));
  setText("#step2Card .step-title", t("step2Title"));
  setText("#step2Card .step-desc", t("step2Desc"));
  setText("#selectPortBtn", t("selectPortBtn"));
  setText("#step3Card .step-title", t("step3Title"));
  setText("#step3Card .step-desc", t("step3Desc"));
  setText("#flashBtn", t("flashBtnIdle"));
  setText("#cancelFlashBtn", t("cancelFlashBtn"));
  setText("#copyHelpBtn", t("copyHelpBtn"));
  setText("#restartBtn", t("restartBtn"));
  setText(".tips", t("tips"));
  setText("#prevStepBtn", t("prevBtn"));
  setText("#nextStepBtn", t("nextBtn"));
  const stepImage = document.querySelector("#step1Card .step-illustration");
  if (stepImage) {
    stepImage.alt = t("step1ImageAlt");
  }
  setText("#browserStatusText", `${t("statusPrefix")}${t("browserChecking")}`);
  setText("#portStatusText", `${t("statusPrefix")}${t("notSelectedPort")}`);
  setText("#statusText", `${t("statusPrefix")}${t("waitingStart")}`);
  setText("#progressText", `${t("progressPrefix")}0%`);
  setText("#doneStatusText", `${t("donePrefix")} ${t("waitingStart")}`);
  const langEnBtn = document.getElementById("langEnBtn");
  const langZhBtn = document.getElementById("langZhBtn");
  langEnBtn?.classList.toggle("active", languageToken === LANGUAGE.EN);
  langZhBtn?.classList.toggle("active", languageToken === LANGUAGE.ZH);
}

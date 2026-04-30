function setStatusClass(el, type = "") {
  if (!el) return;
  el.className = `status ${type}`.trim();
}

function setStatusText(el, text) {
  if (!el) return;
  el.textContent = `${isChineseLanguage() ? "状态：" : "Status:"}${text}`;
}

function isChineseLanguage() {
  const preferredLocale = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages[0]
    : navigator.language;
  return (preferredLocale ?? "").toLowerCase().startsWith("zh");
}

async function initBootstrap() {
  const browserErrorCard = document.getElementById("browserErrorCard");
  const mainFlow = document.getElementById("mainFlow");
  const browserStatusText = document.getElementById("browserStatusText");

  const hasSerial = typeof navigator !== "undefined" && "serial" in navigator;
  if (!hasSerial) {
    browserErrorCard?.classList.remove("hidden");
    mainFlow?.classList.add("hidden");
    setStatusText(
      browserStatusText,
      isChineseLanguage()
        ? "浏览器不支持在线刷写，请使用桌面版 Chrome 或 Edge 打开本页面。"
        : "Browser does not support online flashing. Please use desktop Chrome or Edge."
    );
    setStatusClass(browserStatusText, "error");
    return;
  }

  setStatusText(
    browserStatusText,
    isChineseLanguage()
      ? "浏览器检查通过，正在加载刷机模块..."
      : "Browser check passed. Loading flasher module..."
  );
  setStatusClass(browserStatusText, "");

  try {
    await import("./flasher.bundle.js");
  } catch (_error) {
    setStatusText(
      browserStatusText,
      isChineseLanguage()
        ? "刷机模块加载失败，请刷新页面重试。"
        : "Failed to load flasher module. Please refresh and try again."
    );
    setStatusClass(browserStatusText, "error");
  }
}

initBootstrap();

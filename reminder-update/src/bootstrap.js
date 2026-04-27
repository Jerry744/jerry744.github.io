function setStatusClass(el, type = "") {
  if (!el) return;
  el.className = `status ${type}`.trim();
}

function setStatusText(el, text) {
  if (!el) return;
  el.textContent = `状态：${text}`;
}

async function initBootstrap() {
  const browserErrorCard = document.getElementById("browserErrorCard");
  const mainFlow = document.getElementById("mainFlow");
  const browserStatusText = document.getElementById("browserStatusText");

  const hasSerial = typeof navigator !== "undefined" && "serial" in navigator;
  if (!hasSerial) {
    browserErrorCard?.classList.remove("hidden");
    mainFlow?.classList.add("hidden");
    setStatusText(browserStatusText, "浏览器不支持在线刷写，请使用桌面版 Chrome 或 Edge 打开本页面。");
    setStatusClass(browserStatusText, "error");
    return;
  }

  setStatusText(browserStatusText, "浏览器检查通过，正在加载刷机模块...");
  setStatusClass(browserStatusText, "");

  try {
    await import("./flasher.bundle.js");
  } catch (_error) {
    setStatusText(browserStatusText, "刷机模块加载失败，请刷新页面重试。");
    setStatusClass(browserStatusText, "error");
  }
}

initBootstrap();

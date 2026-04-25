import { ESPLoader, Transport } from "esptool-js";
import { FIRMWARE_PATH, FIXED_BAUDRATE, FLASH_TIMEOUT_MS } from "./constants.js";
import {
  terminal,
  setStatus,
  setSimpleStatus,
  setProgress,
  lockUI,
  showLog,
  showCopyHelp,
  hideCopyHelp,
  showRestart,
  hideRestart,
  showDoneStatus,
  hideDoneStatus,
  getSelectedPort,
  setSelectedPort,
  getSelectedFirmwareFile,
  setSelectedFirmwareFile,
  isBusy,
  portStatusText,
  browserStatusText,
  firmwareFileInput,
} from "./ui.js";

let abortController = null;

export async function getFirmwareData() {
  const builtInFirmwareURL = new URL(FIRMWARE_PATH, import.meta.url).toString();
  const res = await fetch(builtInFirmwareURL, { cache: "no-store" });
  if (res.ok) {
    return {
      data: new Uint8Array(await res.arrayBuffer()),
      label: `在线内置固件：${builtInFirmwareURL}`,
    };
  }

  if (!getSelectedFirmwareFile()) {
    throw new Error(
      `无法读取在线内置固件：${builtInFirmwareURL}。请在第三步选择本地 .bin 固件文件后再刷写。`
    );
  }

  const buf = await getSelectedFirmwareFile().arrayBuffer();
  return {
    data: new Uint8Array(buf),
    label: `本地文件：${getSelectedFirmwareFile().name}`,
  };
}

function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ]);
}

export async function doFlash() {
  if (isBusy()) return;
  if (!getSelectedPort()) {
    setStatus("请先在第二步选择串口", "error");
    return;
  }

  abortController = new AbortController();
  const { signal } = abortController;

  lockUI(true);
  hideRestart();
  hideCopyHelp();
  setProgress(0);
  hideDoneStatus();
  setStatus("正在准备连接...", "");
  terminal.clean();
  showLog();

  let transport = null;
  try {
    const firmwarePayload = await getFirmwareData();
    const firmware = firmwarePayload.data;
    terminal.writeLine(`已加载固件：${firmwarePayload.label}（${firmware.length} bytes）`);

    transport = new Transport(getSelectedPort(), true);
    const loader = new ESPLoader({
      transport,
      baudrate: FIXED_BAUDRATE,
      terminal,
      debugLogging: false,
    });

    setStatus("正在连接设备...", "");
    const chip = await withTimeout(
      loader.main(),
      FLASH_TIMEOUT_MS,
      "连接设备超时，请检查设备是否已正确连接并可响应。"
    );
    terminal.writeLine(`已连接芯片：${chip}`);

    if (signal.aborted) {
      throw new Error("刷写已取消");
    }

    setStatus("正在刷写固件，请勿断开连接...", "");
    await loader.writeFlash({
      fileArray: [{ data: firmware, address: 0x0 }],
      flashMode: "keep",
      flashFreq: "keep",
      flashSize: "keep",
      eraseAll: false,
      compress: true,
      reportProgress: (_fileIndex, written, total) => {
        setProgress((written / total) * 100);
      },
    });

    await loader.after("hard_reset");
    setProgress(100);
    setStatus("刷写完成，设备已自动重启", "ok");
    showDoneStatus("完成：固件升级已完成。现在可以断开设备连接。", "ok");
    terminal.writeLine("刷写成功。");
    showRestart();
    hideCopyHelp();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("取消") || msg.includes("aborted")) {
      setStatus("刷写已取消", "");
      terminal.writeLine("刷写已取消。");
    } else {
      setStatus(`刷写失败：${msg}`, "error");
      terminal.writeLine(`错误：${msg}`);
      showCopyHelp();
    }
    showLog();
  } finally {
    if (transport) {
      try {
        await transport.disconnect();
      } catch (e) {
        terminal.writeLine(`断开串口时出现提示：${String(e)}`);
      }
    }
    lockUI(false);
    abortController = null;
  }
}

export function cancelFlash() {
  if (abortController) {
    abortController.abort();
  }
}

export async function selectPort() {
  if (isBusy()) return;

  try {
    const port = await navigator.serial.requestPort();
    setSelectedPort(port);
    setSimpleStatus(portStatusText, "已选择串口，可进入第三步刷写。", "ok");
    setStatus("串口已准备就绪", "");
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setSimpleStatus(portStatusText, `未选择串口：${msg}`, "error");
    return false;
  }
}

export async function copyHelp() {
  const helpText =
    "故障排查建议：\n" +
    "1. 使用 Chrome 或 Edge 最新版本。\n" +
    "2. 更换支持数据传输的 USB 线。\n" +
    "3. 关闭串口调试工具后重试。\n" +
    "4. 断电重启设备后，再次连接刷写。";
  try {
    await navigator.clipboard.writeText(helpText);
    setStatus("故障排查步骤已复制", "ok");
  } catch (_e) {
    terminal.writeLine(helpText);
    setStatus("当前浏览器不允许剪贴板写入，请手动复制故障排查步骤", "");
  }
}

export function onFirmwareFileSelected() {
  const file = firmwareFileInput.files?.[0] ?? null;
  setSelectedFirmwareFile(file);
  if (file) {
    setStatus(`已选择本地固件：${file.name}`, "ok");
  } else {
    setStatus("未选择本地固件，将使用在线内置固件", "");
  }
}

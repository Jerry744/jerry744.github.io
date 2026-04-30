import { ESPLoader, Transport } from "esptool-js";
import {
  FIRMWARE_MANIFEST_PATH,
  FIRMWARE_FALLBACK_PATH,
  FIXED_BAUDRATE,
  FLASH_TIMEOUT_MS,
} from "./constants.js";
import { getLanguageToken, t } from "./i18n.js";
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
  isBusy,
  portStatusText,
  browserStatusText,
} from "./ui.js";

let abortController = null;

function buildFirmwareFileName(version, channel = "R01C") {
  const languageToken = getLanguageToken();
  const languageSuffix = languageToken === "zh-CN" ? "zh-CN" : "EN";
  return `${version}_${channel}_${languageSuffix}.bin`;
}

export async function getFirmwareData() {
  const manifestURL = new URL(FIRMWARE_MANIFEST_PATH, window.location.href).toString();
  const fallbackURL = new URL(FIRMWARE_FALLBACK_PATH, window.location.href).toString();

  const candidateURLs = [];
  try {
    const manifestRes = await fetch(manifestURL, { cache: "no-store" });
    if (manifestRes.ok) {
      const manifest = await manifestRes.json();
      if (manifest?.firmwareUrl) {
        candidateURLs.push(new URL(manifest.firmwareUrl, manifestURL).toString());
      }

      if (manifest?.version) {
        const channel = manifest?.channel ?? "R01C";
        const versionedFileName = buildFirmwareFileName(manifest.version, channel);
        candidateURLs.push(new URL(versionedFileName, manifestURL).toString());
      }
    }
  } catch (_error) {
    terminal.writeLine(`Hint: Failed to read firmware manifest, fallback will be used: ${manifestURL}`);
  }

  candidateURLs.push(fallbackURL);

  for (const firmwareURL of candidateURLs) {
    const res = await fetch(firmwareURL, { cache: "no-store" });
    if (!res.ok) continue;
    return {
      data: new Uint8Array(await res.arrayBuffer()),
      label: firmwareURL,
    };
  }

  throw new Error(
    `Unable to download online firmware. Please provide version or firmwareUrl in ${manifestURL}, and ensure firmware files exist in ../firmware/.`
  );
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
    setStatus(t("pleaseSelectPortFirst"), "error");
    return;
  }

  abortController = new AbortController();
  const { signal } = abortController;

  lockUI(true);
  hideRestart();
  hideCopyHelp();
  setProgress(0);
  hideDoneStatus();
  setStatus(t("preparingConnection"), "");
  terminal.clean();
  showLog();

  let transport = null;
  try {
    const firmwarePayload = await getFirmwareData();
    const firmware = firmwarePayload.data;
    terminal.writeLine(`${t("loadedFirmware")}: ${firmwarePayload.label} (${firmware.length} bytes)`);

    transport = new Transport(getSelectedPort(), true);
    const loader = new ESPLoader({
      transport,
      baudrate: FIXED_BAUDRATE,
      terminal,
      debugLogging: false,
    });

    setStatus(t("connectingDevice"), "");
    const chip = await withTimeout(
      loader.main(),
      FLASH_TIMEOUT_MS,
      t("connectTimeout")
    );
    terminal.writeLine(`${t("chipConnected")}: ${chip}`);

    if (signal.aborted) {
      throw new Error(t("flashCancelled"));
    }

    setStatus(t("flashingFirmware"), "");
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
    setStatus(t("flashDone"), "ok");
    showDoneStatus(t("firmwareUpgradeDone"), "ok");
    terminal.writeLine(t("flashSuccess"));
    showRestart();
    hideCopyHelp();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("aborted") || msg === t("flashCancelled")) {
      setStatus(t("flashCancelled"), "");
      terminal.writeLine(t("flashCancelled"));
    } else {
      setStatus(`${t("flashFailed")}: ${msg}`, "error");
      terminal.writeLine(`${t("errorPrefix")}: ${msg}`);
      showCopyHelp();
    }
    showLog();
  } finally {
    if (transport) {
      try {
        await transport.disconnect();
      } catch (e) {
        terminal.writeLine(`${t("disconnectWarning")}: ${String(e)}`);
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
    setSimpleStatus(portStatusText, t("portSelected"), "ok");
    setStatus(t("portReady"), "");
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setSimpleStatus(portStatusText, `${t("portNotSelected")}: ${msg}`, "error");
    return false;
  }
}

export async function copyHelp() {
  const helpText = t("troubleshootingHelp");
  try {
    await navigator.clipboard.writeText(helpText);
    setStatus(t("helpCopied"), "ok");
  } catch (_e) {
    terminal.writeLine(helpText);
    setStatus(t("clipboardNotAllowed"), "");
  }
}

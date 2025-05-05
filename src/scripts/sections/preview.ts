import { $ } from "../common";
import {
  activeBookmark,
  deleteActive,
  keepActive,
  updateTitle,
  updateUrl,
} from "../controllers/activeBookmark";

const iframe = $<HTMLIFrameElement>("preview-iframe");
const titleInput = $<HTMLInputElement>("preview-input-title");
const urlInput = $<HTMLInputElement>("preview-input-url");
const titleUpdateBtn = $<HTMLButtonElement>("preview-btn-update-title");
const urlUpdateBtn = $<HTMLButtonElement>("preview-btn-update-url");
const newTabBtn = $<HTMLButtonElement>("preview-btn-new-tab");
const reloadBtn = $<HTMLButtonElement>("preview-btn-reload");
const deleteBtn = $<HTMLButtonElement>("preview-btn-delete");
const keepBtn = $<HTMLButtonElement>("preview-btn-keep");

function disableControls(): void {
  titleInput.value = "";
  urlInput.value = "";
  iframe.src = "about:blank";

  titleInput.disabled = true;
  urlInput.disabled = true;
  titleUpdateBtn.disabled = true;
  urlUpdateBtn.disabled = true;
  newTabBtn.disabled = true;
  reloadBtn.disabled = true;
  deleteBtn.disabled = true;
  keepBtn.disabled = true;
}

function enableControls(): void {
  if (!titleInput.disabled) return;

  titleInput.disabled = false;
  urlInput.disabled = false;
  titleUpdateBtn.disabled = false;
  urlUpdateBtn.disabled = false;
  newTabBtn.disabled = false;
  reloadBtn.disabled = false;
  deleteBtn.disabled = false;
  keepBtn.disabled = false;
}

export function updatePreview(): void {
  if (!activeBookmark) {
    disableControls();
    return;
  }

  enableControls();

  iframe.src = activeBookmark.url;
  titleInput.value = activeBookmark.title;
  urlInput.value = activeBookmark.url;
}

titleUpdateBtn.addEventListener("click", () => updateTitle(titleInput.value));
titleInput.addEventListener(
  "keydown",
  (e) => e.key == "Enter" && updateTitle(titleInput.value)
);

urlUpdateBtn.addEventListener("click", () => updateUrl(urlInput.value));
urlInput.addEventListener(
  "keydown",
  (ev) => ev.key == "Enter" && updateUrl(urlInput.value)
);

newTabBtn.addEventListener(
  "click",
  () => activeBookmark && window.open(activeBookmark.url, "_blank")?.focus()
);

reloadBtn.addEventListener(
  "click",
  () => (iframe.src = activeBookmark?.url || "about:blank")
);

deleteBtn.addEventListener("click", () => deleteActive());
keepBtn.addEventListener("click", () => keepActive());

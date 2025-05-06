import { $ } from "../common";
import {
  activeBookmark,
  deleteActive,
  keepActive,
  resetTitle,
  resetUrl,
  updateBookmarkTitle,
  updateUrl,
} from "../controllers/activeBookmark";

const iframe = $<HTMLIFrameElement>("preview-iframe");
const titleInput = $<HTMLInputElement>("preview-input-title");
const urlInput = $<HTMLInputElement>("preview-input-url");
const titleResetBtn = $<HTMLButtonElement>("preview-btn-reset-title");
const urlResetBtn = $<HTMLButtonElement>("preview-btn-reset-url");
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
  titleResetBtn.disabled = true;
  urlResetBtn.disabled = true;
  newTabBtn.disabled = true;
  reloadBtn.disabled = true;
  deleteBtn.disabled = true;
  keepBtn.disabled = true;
}

function enableControls(): void {
  if (!titleInput.disabled) return;

  titleInput.disabled = false;
  urlInput.disabled = false;
  titleResetBtn.disabled = false;
  urlResetBtn.disabled = false;
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

  if (iframe.src != activeBookmark.url) iframe.src = activeBookmark.url;
  if (titleInput.value != activeBookmark.title)
    titleInput.value = activeBookmark.title;
  if (urlInput.value != activeBookmark.url) urlInput.value = activeBookmark.url;
}

titleResetBtn.addEventListener("click", () => resetTitle());
urlResetBtn.addEventListener("click", () => resetUrl());

titleInput.addEventListener(
  "keydown",
  (e) => e.key == "Enter" && updateBookmarkTitle(titleInput.value)
);

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

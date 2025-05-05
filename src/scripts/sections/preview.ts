import { $ } from "../common";
import { outputGroup } from "../controllers/bookmarkGroups";
import { activeBookmark } from "../controllers/activeBookmark";

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

function updateTitle(): void {
  if (!activeBookmark || !titleInput.value) return;
  activeBookmark.title = titleInput.value;
}

titleUpdateBtn.addEventListener("click", updateTitle);
titleInput.addEventListener(
  "keydown",
  (e) => e.key == "Enter" && updateTitle()
);

function updateUrl(): void {
  if (!activeBookmark || !urlInput.value) return;
  activeBookmark.url = urlInput.value;
}

urlUpdateBtn.addEventListener("click", updateUrl);
urlInput.addEventListener("keydown", (ev) => ev.key == "Enter" && updateUrl());

newTabBtn.addEventListener(
  "click",
  () => activeBookmark && window.open(activeBookmark.url, "_blank")?.focus()
);

reloadBtn.addEventListener(
  "click",
  () => activeBookmark && (iframe.src = activeBookmark.url)
);

deleteBtn.addEventListener("click", () => {
  if (!activeBookmark) return;

  activeBookmark.parent!.removeChild(activeBookmark.id);
});

keepBtn.addEventListener("click", () => {
  if (!activeBookmark) return;

  let bookmark = activeBookmark;

  activeBookmark.parent!.removeChild(activeBookmark.id);

  outputGroup.appendChild(bookmark);
});

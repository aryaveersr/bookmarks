import { $ } from "../common";
import bookmark from "../bookmark";

const iframe = $<HTMLIFrameElement>("preview-iframe");
const titleInput = $<HTMLInputElement>("preview-input-title");
const urlInput = $<HTMLInputElement>("preview-input-url");
const titleResetBtn = $<HTMLButtonElement>("preview-btn-reset-title");
const urlResetBtn = $<HTMLButtonElement>("preview-btn-reset-url");
const newTabBtn = $<HTMLButtonElement>("preview-btn-new-tab");
const reloadBtn = $<HTMLButtonElement>("preview-btn-reload");
const deleteBtn = $<HTMLButtonElement>("preview-btn-delete");
const keepBtn = $<HTMLButtonElement>("preview-btn-keep");

newTabBtn.addEventListener("click", () => bookmark.openInNewTab());
deleteBtn.addEventListener("click", () => bookmark.deleteActiveBookmark());
keepBtn.addEventListener("click", () => bookmark.keepActiveBookmark());

titleResetBtn.addEventListener("click", () => {
  bookmark.resetBookmarkTitle();

  titleInput.value = bookmark.activeBookmark?.title || "";
});

urlResetBtn.addEventListener("click", () => {
  bookmark.resetBookmarkUrl();

  urlInput.value = bookmark.activeBookmark?.url || "";
});

titleInput.addEventListener("keydown", (ev) => {
  if (ev.key != "Enter") return;

  bookmark.activeBookmark!.title = titleInput.value;
});

urlInput.addEventListener("keydown", (ev) => {
  if (ev.key != "Enter") return;

  bookmark.activeBookmark!.url = urlInput.value;
});

reloadBtn.addEventListener(
  "click",
  () => (iframe.src = bookmark.activeBookmark?.url || "about:blank")
);

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
  if (!bookmark.activeBookmark) {
    disableControls();
    return;
  }

  enableControls();

  iframe.src = bookmark.activeBookmark.url;
  titleInput.value = bookmark.activeBookmark.title;
  urlInput.value = bookmark.activeBookmark.url;
}

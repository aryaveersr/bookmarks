import { BookmarkEntry } from "./entry";
import { $ } from "./common";
import { outputGroup } from "./bookmarks";

export let activeBookmark: BookmarkEntry | null;

const iframe = $<HTMLIFrameElement>("preview-iframe");
const titleInput = $<HTMLInputElement>("preview-input-title");
const urlInput = $<HTMLInputElement>("preview-input-url");
const titleUpdateBtn = $<HTMLButtonElement>("preview-btn-update-title");
const urlUpdateBtn = $<HTMLButtonElement>("preview-btn-update-url");
const newTabBtn = $<HTMLButtonElement>("preview-btn-new-tab");
const reloadBtn = $<HTMLButtonElement>("preview-btn-reload");
const deleteBtn = $<HTMLButtonElement>("preview-btn-delete");
const keepBtn = $<HTMLButtonElement>("preview-btn-keep");

export function setActive(entry: BookmarkEntry | null) {
  if (entry == null) {
    activeBookmark = null;
    return;
  }

  activeBookmark?.onInactive();
  activeBookmark = entry;

  iframe.src = activeBookmark.url;
  titleInput.value = activeBookmark.title;
  urlInput.value = activeBookmark.url;
}

function updateTitle() {
  if (!activeBookmark || !titleInput.value) return;
  activeBookmark.title = titleInput.value;
}

titleUpdateBtn.addEventListener("click", updateTitle);
titleInput.addEventListener(
  "keydown",
  (e) => e.key == "Enter" && updateTitle()
);

function updateUrl() {
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

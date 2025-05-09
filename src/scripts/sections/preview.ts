import bookmarks from "../bookmarks";
import { $ } from "../common";

const form = $<HTMLFormElement>("form");
const deleteBtn = $<HTMLButtonElement>("#preview-delete");
const saveBtn = $<HTMLButtonElement>("#preview-save");
const resetBtn = $<HTMLButtonElement>("#preview-reset");
const titleInput = $<HTMLInputElement>(".preview input[name='title']");
const urlInput = $<HTMLInputElement>(".preview input[name='url']");

const iframe = $<HTMLIFrameElement>("iframe");

form.addEventListener("submit", () => bookmarks.saveActiveBookmark());
form.addEventListener("reset", (ev) => {
  if (!bookmarks.activeBookmark) return;
  ev.preventDefault();

  bookmarks.activeBookmark.title = bookmarks.originalTitle;
  bookmarks.activeBookmark.url = bookmarks.originalUrl;

  titleInput.value = bookmarks.originalTitle;
  urlInput.value = bookmarks.originalUrl;
});

deleteBtn.addEventListener("click", () => bookmarks.deleteActiveBookmark());
form.addEventListener("keydown", (ev) => {
  if ((ev.key == "Backspace" || ev.key == "Delete") && ev.altKey) {
    bookmarks.deleteActiveBookmark();
  }
});

function disablePreview() {
  iframe.src = "about:blank";
  titleInput.value = "";
  urlInput.value = "";

  titleInput.disabled = true;
  urlInput.disabled = true;
  deleteBtn.disabled = true;
  saveBtn.disabled = true;
  resetBtn.disabled = true;
}

function enablePreview() {
  if (!titleInput.disabled) return;

  titleInput.disabled = false;
  urlInput.disabled = false;
  deleteBtn.disabled = false;
  saveBtn.disabled = false;
  resetBtn.disabled = false;

  titleInput.focus();
}

export function updatePreview(): void {
  if (!bookmarks.activeBookmark) {
    disablePreview();
    return;
  }

  enablePreview();

  titleInput.value = bookmarks.activeBookmark.title;
  urlInput.value = bookmarks.activeBookmark.url;
  iframe.src = bookmarks.activeBookmark.url;
}

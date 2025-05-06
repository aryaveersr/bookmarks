import type { BookmarkEntry } from "../models/entry";
import { updatePreview } from "../sections/preview";
import { activeGroup } from "./activeGroup";
import { inputGroup } from "./bookmarkGroups";

export let activeBookmark: BookmarkEntry | null;

let originalTitle: string = "";
let originalUrl: string = "";

export function setActiveBookmark(entry: BookmarkEntry | null) {
  if (entry?.id == activeBookmark?.id) return;

  activeBookmark?.onInactive();
  activeBookmark = entry;

  originalTitle = entry?.title || "";
  originalUrl = entry?.url || "";

  if (!entry && inputGroup.children.length != 0) {
    inputGroup.children[0]!.onActive();
    return;
  }

  updatePreview();
}

export function updateBookmarkTitle(newTitle: string): void {
  if (!activeBookmark || !newTitle) return;
  activeBookmark.title = newTitle;
}

export function updateUrl(newUrl: string): void {
  if (!activeBookmark || !newUrl) return;
  activeBookmark.url = newUrl;
}

export function resetTitle(): void {
  if (!activeBookmark) return;

  activeBookmark.title = originalTitle;
  updatePreview();
}

export function resetUrl(): void {
  if (!activeBookmark) return;

  activeBookmark.url = originalUrl;
  updatePreview();
}

export function deleteActive(): void {
  if (!activeBookmark) return;

  const parent = activeBookmark.parent!;
  const index = parent.removeChild(activeBookmark.id);

  if (parent.children.length == 0) {
    setActiveBookmark(null);
  } else if (parent.children.length == index) {
    parent.children[index - 1]!.onActive();
  } else {
    parent.children[index]!.onActive();
  }
}

export function keepActive(): void {
  if (!activeBookmark) return;

  let bookmark = activeBookmark;
  deleteActive();
  activeGroup!.appendChild(bookmark);
}

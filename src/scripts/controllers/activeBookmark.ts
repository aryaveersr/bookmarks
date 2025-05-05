import type { BookmarkEntry } from "../models/entry";
import { updatePreview } from "../sections/preview";
import { inputGroup, outputGroup } from "./bookmarkGroups";

export let activeBookmark: BookmarkEntry | null;

export function setActive(entry: BookmarkEntry | null) {
  if (entry?.id == activeBookmark?.id) return;

  activeBookmark?.onInactive();
  activeBookmark = entry;

  if (!entry && inputGroup.children.length != 0) {
    inputGroup.children[0]!.onActive();
    return;
  }

  updatePreview();
}

export function updateTitle(newTitle: string): void {
  if (!activeBookmark || !newTitle) return;
  activeBookmark.title = newTitle;
}

export function updateUrl(newUrl: string): void {
  if (!activeBookmark || !newUrl) return;
  activeBookmark.url = newUrl;
}

export function deleteActive(): void {
  if (!activeBookmark) return;

  const parent = activeBookmark.parent!;
  const index = parent.removeChild(activeBookmark.id);

  if (parent.children.length == 0) {
    setActive(null);
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
  outputGroup.appendChild(bookmark);
}

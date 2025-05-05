import type { BookmarkEntry } from "../models/entry";
import { updatePreview } from "../sections/preview";

export let activeBookmark: BookmarkEntry | null;

export function setActive(entry: BookmarkEntry | null) {
  activeBookmark?.onInactive();
  activeBookmark = entry;

  updatePreview();
}

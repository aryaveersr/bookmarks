import {
  BookmarkEntry,
  GroupEntry,
  parseFile,
  stringifyBookmarks,
} from "./entry";
import { $ } from "./common";
import { updatePreview } from "./sections/preview";
import { updateOutput } from "./sections/output";

class BookmarkManager {
  private inputGroup: GroupEntry = new GroupEntry("inputGroup", true);
  private outputGroup: GroupEntry = new GroupEntry("outputGroup", true);

  activeGroup: GroupEntry = this.outputGroup;

  activeBookmark: BookmarkEntry | null = null;

  private originalTitle: string = "";
  private originalUrl: string = "";

  constructor() {
    this.inputGroup.mount($("input-entry-menu"));
    this.outputGroup.mount($("output-entry-menu"));
  }

  private setFirstActive(): void {
    if (this.inputGroup.children.length == 0) return;

    this.setActiveBookmark(this.inputGroup.children[0] as BookmarkEntry);
  }

  importFrom(file: File): void {
    parseFile(file, (entries) => {
      for (const entry of entries) {
        this.inputGroup.appendChild(entry);
      }

      this.setFirstActive();
    });
  }

  export(): void {
    const output = stringifyBookmarks(this.outputGroup);

    const a = document.createElement("a");
    const blob = new Blob([output], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = "bookmarks.html";
    a.click();
  }

  setActiveBookmark(newEntry: BookmarkEntry | null): void {
    if (!newEntry && this.inputGroup.children.length != 0) {
      this.setActiveBookmark(this.inputGroup.children[0] as BookmarkEntry);
      return;
    }

    if (this.activeBookmark?.id == newEntry?.id) return;

    if (this.activeBookmark) this.activeBookmark.onInactive();

    this.activeBookmark = newEntry;
    this.activeBookmark?.onActive();
    this.originalTitle = newEntry?.title || "";
    this.originalUrl = newEntry?.url || "";

    updatePreview();
  }

  resetBookmarkTitle(): void {
    if (!this.activeBookmark) return;

    this.activeBookmark.title = this.originalTitle;
  }

  resetBookmarkUrl(): void {
    if (!this.activeBookmark) return;

    this.activeBookmark.url = this.originalUrl;
  }

  openInNewTab(): void {
    if (!this.activeBookmark) return;

    window.open(this.activeBookmark.url, "_blank")?.focus();
  }

  deleteActiveBookmark(): void {
    if (!this.activeBookmark) return;

    const parent = this.activeBookmark.parent!;
    const index = parent.removeChild(this.activeBookmark.id);

    if (parent.children.length == 0) {
      this.setActiveBookmark(null);
    } else if (
      parent.children.length == index &&
      parent.children[index - 1]! instanceof BookmarkEntry
    ) {
      this.setActiveBookmark(parent.children[index - 1]! as BookmarkEntry);
    } else if (parent.children[index]! instanceof BookmarkEntry) {
      this.setActiveBookmark(parent.children[index]!);
    } else {
      this.setActiveBookmark(null);
    }
  }

  keepActiveBookmark(): void {
    if (!this.activeBookmark) return;

    const bookmark = this.activeBookmark;
    this.deleteActiveBookmark();
    this.activeGroup.appendChild(bookmark);
  }

  nextBookmark(): void {
    if (!this.activeBookmark) return this.setFirstActive();

    const children = this.activeBookmark.parent!.children;
    const index = children.findIndex((e) => e.id == this.activeBookmark!.id);

    const nextChild = children[index + 1]!;

    if (index != children.length - 1 && nextChild instanceof BookmarkEntry) {
      this.setActiveBookmark(nextChild);
    }
  }

  prevBookmark(): void {
    if (!this.activeBookmark) return this.setFirstActive();

    const children = this.activeBookmark.parent!.children;
    const index = children.findIndex((e) => e.id == this.activeBookmark!.id);

    const prevChild = children[index - 1]!;

    if (index != 0 && prevChild instanceof BookmarkEntry) {
      this.setActiveBookmark(prevChild);
    }
  }

  setActiveGroup(group: GroupEntry): void {
    if (this.activeGroup.id == group.id) return;

    this.activeGroup.onInactive();
    this.activeGroup = group;
    this.activeGroup.onActive();

    updateOutput();
  }

  setOutputGroupActive(): void {
    this.setActiveGroup(this.outputGroup);
  }

  createGroup(): void {
    const title = prompt("Enter group name:");
    if (!title) return;

    const group = new GroupEntry(title);
    this.activeGroup.appendChild(group);

    this.setActiveGroup(
      this.activeGroup.children[
        this.activeGroup.children.length - 1
      ] as GroupEntry
    );
  }

  deleteActiveGroup(): void {
    if (this.activeGroup.isTopLevel) return;

    const group = this.activeGroup;
    this.setOutputGroupActive();
    group.parent!.removeChild(group.id);
  }
}

export default new BookmarkManager();

import { $ } from "./common";
import Bookmark from "./elements/bookmark";
import Group from "./elements/group";
import RootGroup from "./elements/rootgroup";
import { updatePreview } from "./sections/preview";

class BookmarkManager {
  inputRoot = $<RootGroup>(".input menu[is='c-root-group']");
  outputRoot = $<RootGroup>(".output menu[is='c-root-group']");

  activeGroup: RootGroup | Group = this.outputRoot;
  activeBookmark?: Bookmark;

  originalTitle = "";
  originalUrl = "";

  constructor() {
    window.addEventListener("keydown", (ev) => {
      if (!this.activeBookmark) return;

      if (ev.key == "ArrowDown") this.nextBookmark();
      else if (ev.key == "ArrowUp") this.prevBookmark();
      else if (
        (ev.key == "Backspace" || ev.key == "Delete") &&
        ev.altKey &&
        ev.shiftKey
      )
        this.deleteActiveGroup();
    });
  }

  setActiveBookmark(newBookmark: Bookmark | undefined): void {
    if (!newBookmark && this.inputRoot.children.length != 0) {
      this.setActiveBookmark(this.inputRoot.children[0] as Bookmark);
      return;
    }

    this.activeBookmark?.removeAttribute("data-active");
    this.activeBookmark = newBookmark;

    if (this.activeBookmark) {
      this.activeBookmark.setAttribute("data-active", "true");

      this.originalTitle = this.activeBookmark.title;
      this.originalUrl = this.activeBookmark.url;
    }

    updatePreview();
  }

  setFirstActive(): void {
    if (this.inputRoot.children.length == 0) return;
    this.setActiveBookmark(this.inputRoot.children[0] as Bookmark);
  }

  deleteActiveBookmark(): void {
    if (!this.activeBookmark) return;

    const bookmark = this.activeBookmark;

    if (bookmark.nextElementSibling instanceof Bookmark) {
      this.setActiveBookmark(bookmark.nextElementSibling);
    } else if (bookmark.previousElementSibling instanceof Bookmark) {
      this.setActiveBookmark(bookmark.previousElementSibling);
    } else {
      this.setActiveBookmark(undefined);
    }

    bookmark.remove();
  }

  saveActiveBookmark(): void {
    if (!this.activeBookmark) return;

    let newActive;

    if (this.activeBookmark.nextElementSibling instanceof Bookmark) {
      newActive = this.activeBookmark.nextElementSibling;
    } else if (this.activeBookmark.previousElementSibling instanceof Bookmark) {
      newActive = this.activeBookmark.previousElementSibling;
    } else {
      newActive = undefined;
    }

    this.activeGroup.appendChild(this.activeBookmark);
    this.setActiveBookmark(newActive);
  }

  nextBookmark(): void {
    if (!this.activeBookmark) return this.setFirstActive();

    if (this.activeBookmark.nextElementSibling instanceof Bookmark) {
      this.setActiveBookmark(this.activeBookmark.nextElementSibling);
    }
  }

  prevBookmark(): void {
    if (!this.activeBookmark) return this.setFirstActive();

    if (this.activeBookmark.previousElementSibling instanceof Bookmark) {
      this.setActiveBookmark(this.activeBookmark.previousElementSibling);
    }
  }

  setActiveGroup(group: Group | RootGroup): void {
    if (this.activeGroup == group) return;

    this.activeGroup.removeAttribute("data-active");
    this.activeGroup = group;
    this.activeGroup.setAttribute("data-active", "true");
  }

  deleteActiveGroup(): void {
    if (this.activeGroup instanceof RootGroup) return;

    this.activeGroup.remove();
    this.setActiveGroup(this.outputRoot);
  }
}

export default new BookmarkManager();

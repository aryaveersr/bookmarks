import bookmark from "./bookmark";

export interface Keybind {
  key: string;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

const defaultKeybinds: { [key: string]: Keybind } = {
  keepBookmark: { key: "Enter", ctrlKey: false, altKey: true, shiftKey: false },
  createGroup: { key: "n", ctrlKey: false, altKey: true, shiftKey: false },
  openInNewTab: { key: "o", ctrlKey: false, altKey: true, shiftKey: false },
  deleteBookmark: {
    key: "Backspace",
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
  },
  deleteGroup: {
    key: "Backspace",
    ctrlKey: false,
    altKey: true,
    shiftKey: true,
  },
  nextBookmark: {
    key: "ArrowDown",
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
  },
  prevBookmark: {
    key: "ArrowUp",
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
  },
};

const actions: { [key: string]: () => void } = {
  keepBookmark: () => bookmark.keepActiveBookmark(),
  deleteBookmark: () => bookmark.deleteActiveBookmark(),
  deleteGroup: () => bookmark.deleteActiveGroup(),
  createGroup: () => bookmark.createGroup(),
  openInNewTab: () => bookmark.openInNewTab(),
  nextBookmark: () => bookmark.nextBookmark(),
  prevBookmark: () => bookmark.prevBookmark(),
};

class KeybindsManager {
  keybindsMap = defaultKeybinds;

  constructor() {
    const keybindStr = localStorage.getItem("keybinds");
    if (keybindStr) this.keybindsMap = JSON.parse(keybindStr);
  }

  setKeybind(key: string, keybind: Keybind): void {
    this.keybindsMap[key] = keybind;

    // TODO: save to localstorage
  }

  onKeydown(userAction: Keybind): boolean {
    for (const [key, action] of Object.entries(this.keybindsMap)) {
      const condition =
        userAction.key == action.key &&
        userAction.altKey == action.altKey &&
        userAction.ctrlKey == action.ctrlKey &&
        userAction.shiftKey == action.shiftKey;

      if (!condition) continue;

      (() => {
        actions[key]!();
      })();

      return true;
    }

    return false;
  }
}

export default new KeybindsManager();

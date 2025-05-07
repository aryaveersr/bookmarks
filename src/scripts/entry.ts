import bookmark from "./bookmark";
import { $ } from "./common";

const bookmarkTemplate = $<HTMLTemplateElement>("template-bookmark-entry");
const groupTemplate = $<HTMLTemplateElement>("template-group-entry");

export abstract class Entry {
  private static idCounter = 0;

  readonly id: number;
  parent?: GroupEntry;
  root?: HTMLElement;

  abstract setParent(parent: GroupEntry, container: HTMLElement): void;

  abstract mount(root: HTMLElement): void;

  abstract unmount(): void;

  abstract onActive(): void;

  abstract onInactive(): void;

  constructor() {
    this.id = Entry.idCounter++;
  }
}

export class BookmarkEntry extends Entry {
  private _title: string;
  private _url: string;
  iconBlob?: string;
  iconUrl?: string;

  constructor({
    title,
    url,
    iconBlob,
    iconUrl,
  }: {
    title: string;
    url: string;
    iconBlob?: string;
    iconUrl?: string;
  }) {
    super();

    this._title = title;
    this._url = url;
    this.iconBlob = iconBlob;
    this.iconUrl = iconUrl;
  }

  get title() {
    return this._title;
  }

  get url() {
    return this._url;
  }

  set title(newTitle: string) {
    this._title = newTitle;
    this.root!.querySelector("[slot='title']")!.innerHTML = newTitle;
  }

  set url(newUrl: string) {
    this._url = newUrl;
    this.root!.querySelector("[slot='url']")!.innerHTML = newUrl;
  }

  setParent(parent: GroupEntry, container: HTMLElement): void {
    this.parent = parent;

    container.appendChild(bookmarkTemplate.content.cloneNode(true));
    this.mount(container.lastElementChild as HTMLElement);
  }

  mount(root: HTMLElement): void {
    this.root = root;

    this.root.querySelector("[slot='title']")!.innerHTML = this._title;
    this.root.querySelector("[slot='url']")!.innerHTML = this._url;

    (this.root.querySelector("[slot='icon']") as HTMLImageElement).src = this
      .iconBlob
      ? this.iconBlob
      : this.iconUrl
      ? this.iconUrl
      : "about:blank";

    this.root
      .querySelector("button")!
      .addEventListener("click", () => bookmark.setActiveBookmark(this));
  }

  unmount(): void {
    this.root!.remove();
    delete this.root;
    // TODO: Clean up event listeners
  }

  onActive(): void {
    this.root!.setAttribute("data-active", "true");
  }

  onInactive(): void {
    this.root?.removeAttribute("data-active");
  }
}

export class GroupEntry extends Entry {
  readonly isTopLevel: boolean;

  private _title: string;
  children: Entry[] = [];

  constructor(title: string, isTopLevel: boolean = false) {
    super();

    this._title = title;
    this.isTopLevel = isTopLevel;
  }

  get title() {
    return this._title;
  }

  set title(newTitle: string) {
    this._title = newTitle;
    this.root!.querySelector("[slot='title']")!.innerHTML = newTitle;
  }

  setParent(parent: GroupEntry, container: HTMLElement): void {
    this.parent = parent;

    container.appendChild(groupTemplate.content.cloneNode(true));
    this.mount(container.lastElementChild as HTMLElement);
  }

  mount(root: HTMLElement): void {
    this.root = root;

    if (this.isTopLevel) return;

    this.root.querySelector("[slot='title']")!.innerHTML = this._title;

    this.root!.querySelector<HTMLInputElement>(
      "[slot='radio']"
    )!.addEventListener("click", () => bookmark.setActiveGroup(this));

    this.root
      .querySelector("summary")!
      .addEventListener("click", () => bookmark.setActiveGroup(this));
  }

  unmount(): void {
    for (const child of this.children) {
      child.unmount();
    }

    this.root!.remove();
    delete this.root;
  }

  appendChild(child: Entry): void {
    child.setParent(
      this,
      this.isTopLevel
        ? this.root!
        : this.root?.querySelector("[slot='children']")!
    );

    this.children.push(child);
  }

  onActive(): void {
    if (this.isTopLevel) return;

    this.root!.setAttribute("data-active", "true");
    this.root!.querySelector<HTMLInputElement>("[slot='radio']")!.checked =
      true;
  }

  onInactive(): void {
    if (this.isTopLevel) return;

    this.root?.removeAttribute("data-active");
    this.root!.querySelector<HTMLInputElement>("[slot='radio']")!.checked =
      false;
  }

  removeChild(id: number): number {
    const index = this.children.findIndex((e) => e.id == id);

    this.children[index]!.unmount();
    this.children.splice(index, 1);

    return index;
  }
}

export function parseFile(
  file: File,
  callback: (entries: BookmarkEntry[]) => void
): void {
  const reader = new FileReader();

  reader.onload = () => {
    if (!reader.result) {
      throw new Error(`Failed to read file: ${reader.error}.`);
    }

    const nodes = new DOMParser()
      .parseFromString(reader.result as string, "text/html")
      .querySelectorAll("DT > A");

    const entries = Array.from(nodes)
      .filter((element) => element.hasAttribute("HREF"))
      .map((element) => {
        return new BookmarkEntry({
          title: element.innerHTML || "Untitled",
          url: element.getAttribute("HREF")!,
          iconBlob: element.getAttribute("ICON") || undefined,
          iconUrl: element.getAttribute("ICON_URI") || undefined,
        });
      });

    callback(entries);
  };

  reader.readAsText(file);
}

export function stringifyBookmarks(group: GroupEntry): string {
  function stringifyItems(items: Entry[]): string {
    let output = "";

    for (const entry of items as (BookmarkEntry | GroupEntry)[]) {
      if (entry instanceof BookmarkEntry) {
        output +=
          `<DT><A HREF="${entry.url}" ADD_DATE="0" ` +
          `${entry.iconUrl ? `ICON_URI="${entry.iconUrl}"` : ""} ` +
          `${entry.iconBlob ? `ICON="${entry.iconBlob}"` : ""}> ` +
          `${entry.title}</A></DT>\n`;
      } else {
        output +=
          `\n<DT><H3 FOLDED ADD_DATE="0">${entry.title}</H3></DT>\n<DL>` +
          stringifyItems(entry.children) +
          `</DL>`;
      }
    }

    return output;
  }

  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
    <!--This is an automatically generated file.
    It will be read and overwritten.
    Do Not Edit! -->
    <Title>Bookmarks</Title>
    <H1>Bookmarks</H1>
    <DL>
    ${stringifyItems(group.children)}
    </DL>`;
}

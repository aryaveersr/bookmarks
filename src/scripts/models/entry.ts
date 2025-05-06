import { setActiveBookmark } from "../controllers/activeBookmark";
import { $ } from "../common";
import { setActiveGroup } from "../controllers/activeGroup";
import { inputGroup } from "../controllers/bookmarkGroups";

const bookmarkTemplate = $<HTMLTemplateElement>("template-bookmark-entry");
const groupTemplate = $<HTMLTemplateElement>("template-group-entry");

export abstract class Entry {
  private static idCounter = 0;

  abstract kind: "bookmark" | "group";
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
  readonly kind = "bookmark";

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

    this.root.querySelector("button")!.addEventListener("click", () => {
      this.onActive();

      if (this.parent?.id != inputGroup.id) {
        this.parent?.onActive();
      }
    });
  }

  unmount(): void {
    this.root!.remove();
    delete this.root;
    // TODO: Clean up event listeners
  }

  onActive(): void {
    this.root!.setAttribute("data-active", "true");
    setActiveBookmark(this);
  }

  onInactive(): void {
    this.root?.removeAttribute("data-active");
  }
}

export class GroupEntry extends Entry {
  readonly kind = "group";
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
    )!.addEventListener("click", () => this.onActive());

    this.root
      .querySelector("summary")!
      .addEventListener("click", () => this.onActive());
  }

  unmount(): void {
    if (this.isTopLevel) {
      throw new Error("Can't unmount top level group.");
    }

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
    this.root!.setAttribute("data-active", "true");

    if (!this.isTopLevel) {
      this.root!.querySelector<HTMLInputElement>("[slot='radio']")!.checked =
        true;
    }

    setActiveGroup(this);
  }

  onInactive(): void {
    this.root?.removeAttribute("data-active");

    if (!this.isTopLevel) {
      this.root!.querySelector<HTMLInputElement>("[slot='radio']")!.checked =
        false;
    }
  }

  removeChild(id: number): number {
    const index = this.children.findIndex((e) => e.id == id);

    this.children[index]!.unmount();
    this.children.splice(index, 1);

    return index;
  }
}

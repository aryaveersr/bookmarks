import bookmarks from "../bookmarks";
import { $ } from "../common";

const template = $<HTMLTemplateElement>("#template-bookmark");

class Bookmark extends HTMLButtonElement {
  private _title: string;
  private _url: string;
  readonly iconBlob?: string;
  readonly iconUrl?: string;

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
    this.querySelector("[slot='title']")!.innerHTML = newTitle;
  }

  set url(newUrl: string) {
    this._url = newUrl;
    this.querySelector("[slot='url']")!.innerHTML = newUrl;
  }

  connectedCallback() {
    if (this.children.length != 0) return;

    for (const child of template.content.children) {
      this.appendChild(child.cloneNode(true));
    }

    this.classList.add("bookmark");
    this.querySelector("[slot='title']")!.innerHTML = this._title;
    this.querySelector("[slot='url']")!.innerHTML = this._url;
    this.querySelector("img")!.src = this.iconBlob
      ? this.iconBlob
      : this.iconUrl
      ? this.iconUrl
      : "about:blank";

    this.onclick = () => bookmarks.setActiveBookmark(this);
  }
}

customElements.define("c-bookmark", Bookmark, { extends: "button" });
export default Bookmark;

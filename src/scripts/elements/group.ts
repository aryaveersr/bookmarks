import bookmarks from "../bookmarks";
import { $ } from "../common";

const template = $<HTMLTemplateElement>("#template-group");

class Group extends HTMLDetailsElement {
  static observedAttributes = ["data-active"];

  private _title: string;

  constructor(title: string) {
    super();

    this._title = title;
  }

  get title() {
    return this._title;
  }

  set title(newTitle: string) {
    this._title = newTitle;
    this.querySelector("[slot='title']")!.innerHTML = newTitle;
  }

  connectedCallback() {
    for (const child of template.content.children) {
      this.appendChild(child.cloneNode(true));
    }

    this.classList.add("group");
    this.querySelector("[slot='title']")!.innerHTML = this._title;
    this.querySelector("summary")!.addEventListener("click", () => {
      bookmarks.setActiveGroup(this);
    });
  }

  attributeChangedCallback(name: string, _: string, value: string) {
    if (name != "data-active") return;
    this.querySelector("input")!.checked = value == "true";
  }
}

customElements.define("c-group", Group, { extends: "details" });
export default Group;

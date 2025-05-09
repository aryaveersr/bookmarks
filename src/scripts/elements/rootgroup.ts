import bookmarks from "../bookmarks";

class RootGroup extends HTMLMenuElement {
  static observedAttributes = ["data-active"];

  radio?: HTMLInputElement;

  constructor() {
    super();

    if (this.hasAttribute("data-radio")) {
      this.radio = document.getElementById(
        this.getAttribute("data-radio")!
      ) as HTMLInputElement;

      this.radio.addEventListener("click", () => {
        bookmarks.setActiveGroup(this);
      });
    }
  }

  attributeChangedCallback(name: string, _: string, value: string) {
    if (name != "data-active") return;
    this.radio!.checked = value == "true";
  }
}

customElements.define("c-root-group", RootGroup, { extends: "menu" });
export default RootGroup;

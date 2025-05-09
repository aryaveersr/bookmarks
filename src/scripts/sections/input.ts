import bookmarks from "../bookmarks";
import { $ } from "../common";
import Bookmark from "../elements/bookmark";

const importFile = $<HTMLInputElement>(".input input[type='file']");

importFile.addEventListener("change", () => {
  if (!importFile.files || importFile.files.length == 0) return;

  const reader = new FileReader();

  reader.onload = () => {
    if (!reader.result) {
      throw new Error(`Failed to read file: ${reader.error}.`);
    }

    const nodes = new DOMParser()
      .parseFromString(reader.result as string, "text/html")
      .querySelectorAll("DT > A");

    Array.from(nodes)
      .filter((element) => element.hasAttribute("HREF"))
      .map((element) => {
        return new Bookmark({
          title: element.innerHTML || "Untitled",
          url: element.getAttribute("HREF")!,
          iconBlob: element.getAttribute("ICON") || undefined,
          iconUrl: element.getAttribute("ICON_URI") || undefined,
        });
      })
      .forEach((b) => bookmarks.inputRoot.appendChild(b));

    bookmarks.setFirstActive();
  };

  reader.readAsText(importFile.files[0]!);
});

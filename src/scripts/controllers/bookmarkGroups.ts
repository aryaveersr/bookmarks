import { GroupEntry, BookmarkEntry, Entry } from "../models/entry";
import { $ } from "../common";

export let inputGroup = new GroupEntry("inputGroup", true);
export let outputGroup = new GroupEntry("outputGroup", true);

inputGroup.mount($("input-entry-menu"));
outputGroup.mount($("output-entry-menu"));

export function handleFile(
  ev: InputEvent & { currentTarget: HTMLInputElement }
): boolean {
  if (!ev.currentTarget.files || ev.currentTarget.files.length == 0) {
    return false;
  }

  const reader = new FileReader();

  reader.onload = () => {
    if (!reader.result) {
      throw new Error(`Failed to read file: ${reader.error}.`);
    }

    Array.from(
      new DOMParser()
        .parseFromString(reader.result as string, "text/html")
        .querySelectorAll("DT > A")
    )
      .filter((element) => element.hasAttribute("HREF"))
      .map(
        (element) =>
          new BookmarkEntry({
            title: element.innerHTML || "Untitled",
            url: element.getAttribute("HREF")!,
            iconBlob: element.getAttribute("ICON") || undefined,
            iconUrl: element.getAttribute("ICON_URI") || undefined,
          })
      )
      .forEach((entry) => inputGroup.appendChild(entry));

    inputGroup.onActive();
  };

  reader.readAsText(ev.currentTarget.files[0]!);
  return true;
}

export function exportBookmarks(): void {
  function stringifyItems(items: Entry[]): string {
    let output = "";

    for (const item of items) {
      if (item.kind === "bookmark") {
        const entry = item as BookmarkEntry;

        output += `<DT><A HREF="${entry.url}" ADD_DATE="0" \
        ${entry.iconUrl ? `ICON_URI="${entry.iconUrl}"` : ""}\
        ${entry.iconBlob ? `ICON="${entry.iconBlob}"` : ""}> \
        ${entry.title}</A></DT>\n`;
      } else {
        const entry = item as GroupEntry;

        output += `\n<DT><H3 FOLDED ADD_DATE="0">${entry.title}</H3></DT>\n<DL>`;
        output += stringifyItems(entry.children);
        output += `</DL>`;
      }
    }

    return output;
  }

  const output = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
    <!--This is an automatically generated file.
    It will be read and overwritten.
    Do Not Edit! -->
    <Title>Bookmarks</Title>
    <H1>Bookmarks</H1>
    <DL>
    ${stringifyItems(outputGroup.children)}
    </DL>`;

  const a = document.createElement("a");
  const blob = new Blob([output], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  a.href = url;
  a.download = "bookmarks.html";
  a.click();
}

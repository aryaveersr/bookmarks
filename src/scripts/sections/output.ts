import bookmarks from "../bookmarks";
import { $ } from "../common";
import Bookmark from "../elements/bookmark";
import Group from "../elements/group";

const exportBtn = $("#output-export");
const createGroupBtn = $("#output-create-group");

createGroupBtn.addEventListener("click", () => {
  const title = prompt("Enter group name:");
  if (!title) return;

  const group = bookmarks.activeGroup.appendChild(new Group(title));
  group.open = true;
  bookmarks.setActiveGroup(group);
});

exportBtn.addEventListener("click", () => {
  function stringifyItems(items: (Group | Bookmark)[]): string {
    let output = "";

    for (const entry of items) {
      if (entry instanceof Bookmark) {
        output +=
          `<DT><A HREF="${entry.url}" ADD_DATE="0" ` +
          `${entry.iconUrl ? `ICON_URI="${entry.iconUrl}"` : ""} ` +
          `${entry.iconBlob ? `ICON="${entry.iconBlob}"` : ""}>` +
          `${entry.title}</A></DT>\n`;
      } else {
        output +=
          `\n<DT><H3 FOLDED ADD_DATE="0">${entry.title}</H3></DT>\n<DL>` +
          stringifyItems(entry.children as any) +
          `</DL>`;
      }
    }

    return output;
  }

  const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
        <!--This is an automatically generated file.
        It will be read and overwritten.
        Do Not Edit! -->
        <Title>Bookmarks</Title>
        <H1>Bookmarks</H1>
        <DL>
        ${stringifyItems(bookmarks.outputRoot.children as any)}
        </DL>`;

  const a = document.createElement("a");
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  a.href = url;
  a.download = "bookmarks.html";
  a.click();
});

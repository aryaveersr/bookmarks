import { exportBookmarks } from "./bookmarks";
import { $ } from "./common";

const exportBtn = $<HTMLButtonElement>("output-btn-export");

exportBtn.addEventListener("click", () => exportBookmarks());

import { exportBookmarks } from "../controllers/bookmarkGroups";
import { $ } from "../common";

const exportBtn = $<HTMLButtonElement>("output-btn-export");

exportBtn.addEventListener("click", () => exportBookmarks());

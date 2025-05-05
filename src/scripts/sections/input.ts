import { handleFile } from "../controllers/bookmarkGroups";
import { $ } from "../common";

const fileInput = $<HTMLInputElement>("input-input-file");

fileInput.addEventListener("change", (ev) => handleFile(ev as any));

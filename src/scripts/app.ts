import "./sections/start";
import "./sections/input";
import "./sections/preview";
import "./sections/output";

import "./entry";

import "./bookmark";
import keybinds, { type Keybind } from "./keybinds";

window.addEventListener("keydown", (ev) => {
  const action: Keybind = {
    key: ev.key,
    ctrlKey: ev.ctrlKey,
    shiftKey: ev.shiftKey,
    altKey: ev.altKey,
  };

  if (keybinds.onKeydown(action)) ev.preventDefault();
});

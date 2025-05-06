import type { GroupEntry } from "../models/entry";
import { updateOutput } from "../sections/output";

export let activeGroup: GroupEntry | null;

export function setActiveGroup(group: GroupEntry): void {
  if (activeGroup?.id == group.id) return;

  activeGroup?.onInactive();
  activeGroup = group;

  updateOutput();
}

export function updateGroupTitle(newTitle: string): void {
  if (!newTitle) return;
  activeGroup!.title = newTitle;
}

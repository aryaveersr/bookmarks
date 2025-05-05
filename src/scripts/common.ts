export const $ = <T = HTMLElement>(id: string): T =>
  document.getElementById(id) as T;

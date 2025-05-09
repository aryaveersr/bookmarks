export const $ = <T = HTMLElement>(query: string): T =>
  document.querySelector(query) as T;

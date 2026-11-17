import { standalonePages } from "./mockData.js";

const standaloneRoutes = new Map(standalonePages.map(([id, , , path]) => [id, path]));

export function isStandalonePage(id) {
  return standaloneRoutes.has(id);
}

export function routeForPage(id) {
  return standaloneRoutes.get(id) ?? `/index.html#${id}`;
}

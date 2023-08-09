import { LemmyHttp } from "lemmy-js-client";

export const client = new LemmyHttp("https://lemmy.world", {
  fetchFunction: fetch,
});

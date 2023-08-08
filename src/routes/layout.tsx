import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";

import "./bootstrap.css";
import { client } from "./client";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 10,
  });
};

export const useSiteData = routeLoader$(async () => {
  const siteDetails = await client.getSite();

  return siteDetails;
});

export default component$(() => {
  const siteDetails = useSiteData();

  return (
    <div class="lemmy-site" id="app">
      <div class="shadow-sm">
        <nav
          class="navbar navbar-expand-md navbar-light p-0 px-3 container-lg"
          id="navbar"
        >
          <div class="container-fluid">
            <a
              href="/"
              class="active navbar-brand"
              id="navTitle"
              title={siteDetails.value.site_view.site.description}
            >
              <img
                src={siteDetails.value.site_view.site.icon}
                class="d-inline-block align-text-center mx-1"
                height="40"
                width="40"
              />
              {siteDetails.value.site_view.site.name}
            </a>
          </div>
        </nav>
      </div>
      <Slot />
    </div>
  );
});

import { component$ } from "@builder.io/qwik";
import { Community } from "lemmy-js-client";
import { getUsername, getDisplayName } from "./utils";
import { BadgeAvatar } from "./BadgeAvatar";

export const CommunityBadge = component$(
  ({ community }: { community: Community }) => {
    const username = getUsername(community);

    return (
      <a href={`/c/${username}}`} class="inline-flex items-center gap-1">
        {community.icon && <BadgeAvatar url={community.icon} />}
        {getDisplayName(community)}
      </a>
    );
  }
);

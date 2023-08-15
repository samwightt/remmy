import { component$, useSignal } from "@builder.io/qwik";
import { Person } from "lemmy-js-client";
import { getUsername, getDisplayName } from "./utils";
import { BadgeAvatar } from "./BadgeAvatar";

export const AuthorBadge = component$(({ person }: { person: Person }) => {
  const username = getUsername(person);

  return (
    <a href={`/u/${username}`} class="inline-flex items-center gap-1">
      {person.avatar && <BadgeAvatar url={person.avatar} />}
      {getDisplayName(person)}
    </a>
  );
});

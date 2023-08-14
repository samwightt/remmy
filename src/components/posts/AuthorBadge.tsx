import { component$, useSignal } from "@builder.io/qwik";
import { Person } from "lemmy-js-client";
import { getUsername, getDisplayName } from "./utils";
import { BadgeAvatar } from "./BadgeAvatar";

export const AuthorBadge = component$(({ person }: { person: Person }) => {
  const showUsername = useSignal(false);
  const username = getUsername(person);

  return (
    <a
      href={`/u/${username}`}
      class="inline-flex items-center gap-1"
      onMouseOver$={() => (showUsername.value = true)}
      onFocus$={() => (showUsername.value = true)}
      onMouseOut$={() => (showUsername.value = false)}
      onBlur$={() => (showUsername.value = false)}
    >
      {person.avatar && <BadgeAvatar url={person.avatar} />}
      {showUsername.value ? username : getDisplayName(person)}
    </a>
  );
});

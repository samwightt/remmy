import { component$, useSignal } from "@builder.io/qwik";
import { Person } from "lemmy-js-client";

interface Actor {
  name: string;
  actor_id: string;
  display_name?: string;
  local: boolean;
  title?: string;
}

function getUsername(actor: Actor) {
  const name = actor.name;

  if (!actor.local) {
    const suffix = `@${new URL(actor.actor_id).host}`;
    return name + suffix;
  }

  return name;
}

function getDisplayName(actor: Actor) {
  if (actor.title) return actor.title;
  if (actor.display_name) return actor.display_name;
  return actor.name;
}

export const PostAuthor = component$(({ person }: { person: Person }) => {
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
      {person.avatar && (
        <img
          class="w-5 h-5 rounded shadow"
          src={`${person.avatar}?format=webp&thumbnail=96`}
        />
      )}
      {showUsername.value ? username : getDisplayName(person)}
    </a>
  );
});

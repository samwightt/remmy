export interface Actor {
  name: string;
  actor_id: string;
  display_name?: string;
  local: boolean;
  title?: string;
}

export function getUsername(actor: Actor) {
  const name = actor.name;

  if (!actor.local) {
    const suffix = `@${new URL(actor.actor_id).host}`;
    return name + suffix;
  }

  return name;
}

export function getDisplayName(actor: Actor) {
  if (actor.title) return actor.title;
  if (actor.display_name) return actor.display_name;
  return actor.name;
}

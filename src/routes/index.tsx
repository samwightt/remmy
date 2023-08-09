import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { client } from "./client";
import { Community, Person, PostView } from "lemmy-js-client";
import { PostAuthor } from "./user";

export const usePosts = routeLoader$(async () => {
  const posts = await client.getPosts({
    limit: 25,
    type_: "All",
    sort: "Active",
  });

  return posts.posts;
});

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

export const PostAuthorTwo = component$(({ person }: { person: Person }) => {
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

const Community = component$(({ community }: { community: Community }) => {
  const username = getUsername(community);

  return (
    <a href={`/c/${username}}`} class="inline-flex items-center gap-1">
      {community.icon && (
        <img
          class="w-5 h-5 rounded shadow"
          src={`${community.icon}?format=webp&thumbnail=96`}
        />
      )}
      {getDisplayName(community)}
    </a>
  );
});

const PostListing = component$(({ post }: { post: PostView }) => {
  return (
    <article class="my-4">
      <h2 class="text-2xl font-medium">
        <a
          href={`/post/${post.post.id}`}
          class="text-blue-800"
          title="Comments"
        >
          {post.post.name}
        </a>
      </h2>
      {post.post.url && (
        <p class="italic text-gray-600">{new URL(post.post.url).hostname}</p>
      )}
      <p class="flex items-center gap-1 whitespace-normal">
        <PostAuthor person={post.creator} />
        <span> to </span> <Community community={post.community} />
      </p>
    </article>
  );
});

export default component$(() => {
  const posts = usePosts();

  return (
    <div>
      {posts.value.map((post) => (
        <PostListing post={post} key={post.post.id} />
      ))}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};

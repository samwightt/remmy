import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { client } from "./client";
import { Community, Person, PostView } from "lemmy-js-client";

export const usePosts = routeLoader$(async () => {
  const posts = await client.getPosts({
    limit: 25,
    type_: "All",
    sort: "Active",
  });

  return posts.posts;
});

function getUsername(actor: {
  actor_id: string;
  name: string;
  display_name?: string;
  local: boolean;
}) {
  const name = actor.display_name ?? actor.name;

  if (!actor.local) {
    const suffix = `@${new URL(actor.actor_id).host}`;
    return name + suffix;
  }

  return name;
}

const PostAuthor = component$(({ person }: { person: Person }) => {
  const username = getUsername(person);

  return (
    <a href={`/u/${username}`}>
      {person.avatar && (
        <img
          width="20"
          height="20"
          class="me-1"
          src={`${person.avatar}?format=webp&thumbnail=96`}
        />
      )}
      {username}
    </a>
  );
});

const Community = component$(({ community }: { community: Community }) => {
  const username = getUsername(community);

  return (
    <a href={`/c/${username}}`}>
      {community.icon && (
        <img
          width="20"
          height="20"
          class="me-1"
          src={`${community.icon}?format=webp&thumbnail=96`}
        />
      )}
      {username}
    </a>
  );
});

const PostListing = component$(({ post }: { post: PostView }) => {
  return (
    <article class="my-4">
      <h2 class="h5 text-break">
        <a
          href={`/post/${post.post.id}`}
          class="link-primary link-underline-opacity-0"
          title="Comments"
        >
          {post.post.name}
        </a>
      </h2>
      {post.post.url && (
        <p>
          <em>{new URL(post.post.url).hostname}</em>
        </p>
      )}
      <div>
        <PostAuthor person={post.creator} /> to{" "}
        <Community community={post.community} />
      </div>
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

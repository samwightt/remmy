import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { client } from "./client";
import { Post } from "~/components/posts/Post";

export const usePosts = routeLoader$(async () => {
  const posts = await client.getPosts({
    limit: 25,
    type_: "All",
    sort: "Active",
  });

  return posts.posts;
});

export default component$(() => {
  const posts = usePosts();

  return (
    <div>
      {posts.value.map((post) => (
        <Post postView={post} key={post.post.id} />
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

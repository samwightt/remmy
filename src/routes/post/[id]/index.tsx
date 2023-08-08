import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { client } from "~/routes/client";

export const usePost = routeLoader$(async ({ params: { id } }) => {
  const post = await client.getPost({
    id: id as unknown as number,
  });

  return post;
});

export default component$(() => {
  const postData = usePost();

  const post = postData.value.post_view.post;

  return <h1>{post.name}</h1>;
});

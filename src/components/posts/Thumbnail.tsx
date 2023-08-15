import { Post, PostView } from "lemmy-js-client";
import { component$, Slot } from "@builder.io/qwik";

export interface ThumbnailProps {
  post: Post;
}

export const ThumbnailLink = component$<ThumbnailProps>(({ post }) => {
  if (!post.url) {
    return <Slot />;
  }

  return (
    <a href={post.url} target="_blank">
      <Slot />
    </a>
  );
});

export const ThumbnailIcon = component$<ThumbnailProps>(({ post }) => {
  const classes = "w-full h-16 w-20 rounded-md shadow-sm ";

  if (post.thumbnail_url) {
    return (
      <div
        class={[classes, "bg-contain"]}
        style={{
          backgroundImage: `url('${post.thumbnail_url}?thumbnail=140&format=webp')`,
        }}
      />
    );
  }

  return (
    <div
      class={[
        classes,
        "bg-gray-500 text-5xl text-white flex items-center justify-center",
      ]}
    >
      <div>”</div>
    </div>
  );
});

export const Thumbnail = component$<ThumbnailProps>(({ post }) => {
  return (
    <ThumbnailLink post={post}>
      <ThumbnailIcon post={post} />
    </ThumbnailLink>
  );
});

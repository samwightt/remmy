import { Post } from "lemmy-js-client";
import { component$, Slot } from "@builder.io/qwik";

export interface ThumbnailProps {
  post: Post;
}

export const ThumbnailLink = component$<ThumbnailProps>(({ post }) => {
  if (!post.url) {
    return <Slot />;
  }

  return (
    <a href={post.url} target="_blank" title={post.embed_title}>
      <Slot />
    </a>
  );
});

export const ThumbnailIcon = component$<ThumbnailProps>(({ post }) => {
  const classes = "h-16 w-20 rounded-md shadow-sm ";

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

  const iconClass = "fill-current w-5 h-5";

  const icon = post.url ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class={iconClass}
    >
      <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class={iconClass}
    >
      <path d="M14 22.5L11.2 19H6C5.44772 19 5 18.5523 5 18V7.10256C5 6.55028 5.44772 6.10256 6 6.10256H22C22.5523 6.10256 23 6.55028 23 7.10256V18C23 18.5523 22.5523 19 22 19H16.8L14 22.5ZM15.8387 17H21V8.10256H7V17H11.2H12.1613L14 19.2984L15.8387 17ZM2 2H19V4H3V15H1V3C1 2.44772 1.44772 2 2 2Z"></path>
    </svg>
  );

  return (
    <div
      class={[
        classes,
        "bg-gray-500 text-5xl text-white flex items-center justify-center",
      ]}
    >
      <div>{icon}</div>
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

import { Slot, component$ } from "@builder.io/qwik";
import { Community, Person, PostView } from "lemmy-js-client";
import { AuthorBadge } from "./AuthorBadge";
import { CommunityBadge } from "./CommunityBadge";
import { Thumbnail } from "./Thumbnail";

export const PostTitle = component$(
  ({ postView: { post } }: { postView: PostView }) => {
    const urlHost = post.url && new URL(post.url).hostname;

    return (
      <div class="mb-2">
        <h2
          class={[
            "text-2xl font-medium text-blue-800",
            post.featured_local ? "text-green-700" : "text-blue-800",
          ]}
        >
          <a href={`/post/${post.id}`} title="Comments">
            {post.name}
          </a>
        </h2>
        {urlHost && (
          <p class="italic font-normal text-gray-600 text-sm">({urlHost})</p>
        )}
      </div>
    );
  }
);

export const PostBy = component$(
  (props: { person: Person; community: Community }) => {
    return (
      <p class="flex items-center gap-1 whitespace-normal">
        <AuthorBadge person={props.person} />
        <span> to </span> <CommunityBadge community={props.community} />
      </p>
    );
  }
);

export const Score = component$(({ score }: { score: number }) => {
  return (
    <p class="text-center text-gray-500 font-medium w-12 text-sm">
      {score > 1000 ? `${(score / 1000).toFixed(2)}k` : score}
    </p>
  );
});

export interface PostProps {
  postView: PostView;
}

export const Post = component$<PostProps>(({ postView }) => {
  return (
    <article class="my-4 flex flex-row gap-2">
      <div class="flex flex-row gap-2 items-center h-min mt-1">
        <Score score={postView.counts.score} />
        <Thumbnail post={postView.post} />
      </div>
      <div>
        <div class="flex space-x-2 items-center">
          <PostTitle postView={postView} />
        </div>
        <PostBy person={postView.creator} community={postView.community} />
      </div>
    </article>
  );
});

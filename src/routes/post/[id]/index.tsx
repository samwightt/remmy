import { Slot, component$, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { CommentView } from "lemmy-js-client";
import { client } from "~/routes/client";
import { micromark } from "micromark";
import sanitize from "sanitize-html";

export const usePost = routeLoader$(async ({ params: { id } }) => {
  const post = await client.getPost({
    id: id as unknown as number,
  });

  if (post.post_view.post.body) {
    post.post_view.post.body = sanitize(micromark(post.post_view.post.body));
  }

  return post;
});

export const useComments = routeLoader$(async ({ params: { id } }) => {
  const comments = await client.getComments({
    post_id: id as unknown as number,
    max_depth: 8,
  });

  const commentMap = new Map<number, CommentView>();
  const childrenIds = new Map<number, number[]>();

  for (const comment of comments.comments) {
    const path = comment.comment.path.split(".");
    const parent = parseInt(path[path.length - 2]);

    if (!childrenIds.has(parent)) {
      childrenIds.set(parent, []);
    }

    childrenIds.get(parent)?.push(comment.comment.id);
    commentMap.set(comment.comment.id, {
      ...comment,
      comment: {
        ...comment.comment,
        content: sanitize(micromark(comment.comment.content)),
      },
    });
  }

  return {
    comments: commentMap,
    children: childrenIds,
  };
});

export const Collapsible = component$(() => {
  const collapsed = useSignal(false);

  return (
    <>
      <button onClick$={() => (collapsed.value = !collapsed.value)}>
        [{collapsed.value ? "+" : "-"}]
      </button>
      {!collapsed.value && <Slot />}
    </>
  );
});

interface CommentDisplayProps {
  comments: Map<number, CommentView>;
  childrenMap: Map<number, number[]>;
  commentId: number;
}

export const CommentDisplay = component$<CommentDisplayProps>((props) => {
  const comment = props.comments.get(props.commentId);

  if (!comment) return null;

  const children = props.childrenMap.get(props.commentId) ?? [];

  return (
    <div class="my-4">
      <Collapsible>
        <div dangerouslySetInnerHTML={comment.comment.content} />
        <div class="ml-4">
          {children.map((childId) => (
            <CommentDisplay
              comments={props.comments}
              childrenMap={props.childrenMap}
              commentId={childId}
            />
          ))}
        </div>
      </Collapsible>
    </div>
  );
});

export default component$(() => {
  const postData = usePost();
  const commentData = useComments();

  const post = postData.value.post_view.post;

  const rootChildren = commentData.value.children.get(0)!;

  return (
    <div>
      <h1>{post.name}</h1>
      {post.body && <div dangerouslySetInnerHTML={post.body} />}
      {rootChildren.map((comment) => (
        <CommentDisplay
          commentId={comment}
          comments={commentData.value.comments}
          childrenMap={commentData.value.children}
        />
      ))}
    </div>
  );
});

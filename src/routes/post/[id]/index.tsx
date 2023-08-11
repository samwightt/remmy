import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { CommentView } from "lemmy-js-client";
import { client } from "~/routes/client";

export const usePost = routeLoader$(async ({ params: { id } }) => {
  const post = await client.getPost({
    id: id as unknown as number,
  });

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
    });
  }

  return {
    comments: commentMap,
    children: childrenIds,
  };
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

import { component$ } from "@builder.io/qwik";

export interface BadgeAvatarProps {
  url: string;
}

export const BadgeAvatar = component$<BadgeAvatarProps>(({ url }) => {
  return (
    <img
      class="w-5 h-5 rounded shadow"
      src={`${url}?format=webp&thumbnail=96`}
    />
  );
});

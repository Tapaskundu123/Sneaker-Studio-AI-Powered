// components/ui/tag.tsx
import { Badge, BadgeProps } from "./badge";

export function Tag(props: BadgeProps) {
  return <Badge variant="secondary" {...props} />;
}
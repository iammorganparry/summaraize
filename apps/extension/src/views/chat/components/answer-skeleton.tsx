import { Skeleton } from "@mui/material";

export const AnswerSkeleton = () => {
  return Array.from({ length: 3 }).map(() => (
    <Skeleton
      key={window.crypto.randomUUID()}
      variant="text"
      width={Math.floor(Math.random() * 350) + 100}
      height={20}
    />
  ));
};

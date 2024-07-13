import { Skeleton } from "@mui/material";
import { Message } from "./messages";

export const AnswerSkeleton = () => {
  return (
    <Message type="assistant">
      {Array.from({ length: 3 }).map(() => (
        <Skeleton
          key={window.crypto.randomUUID()}
          variant="text"
          width={Math.floor(Math.random() * 350) + 100}
          height={20}
        />
      ))}
    </Message>
  );
};

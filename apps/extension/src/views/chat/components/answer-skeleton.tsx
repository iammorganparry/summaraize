import { Box, Skeleton } from "@mui/material";

export const AnswerSkeleton = () => {
  return (
    <Box>
      {Array.from({ length: 5 }).map(() => (
        <Skeleton
          key={window.crypto.randomUUID()}
          variant="text"
          width={Math.floor(Math.random() * 350) + 100}
          height={20}
        />
      ))}
    </Box>
  );
};

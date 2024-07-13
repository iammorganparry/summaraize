import { Box, Card, Chip, Typography, styled } from "@mui/material";
import type { Message as MessageType } from "ai";

const CardContainer = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  padding: theme.spacing(2),
  fontSize: "16px",
  border: `2px solid ${theme.palette.common.white}`,
}));

export const Message = ({
  message,
  type,
  children,
}: {
  message?: string;
  type: MessageType["role"];
  children?: React.ReactNode;
}) => {
  return (
    <Box sx={{ gap: 0.5 }}>
      <Chip
        variant="outlined"
        label={type === "user" ? "You" : "Assistant"}
        sx={{ my: 1, borderRadius: 0, borderWidth: 2 }}
      />
      <CardContainer>{message ? <Typography variant="body1">{message}</Typography> : children}</CardContainer>
    </Box>
  );
};

export const WelcomeMessage = () => {
  return (
    <Message
      type="assistant"
      message="Welcome to Summaraize! 👋🏻 I'm here to help you with your video summaries. Just ask me anything about your previous summaries!"
    />
  );
};

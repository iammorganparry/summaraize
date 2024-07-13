import { Box, Container, IconButton, Input, styled } from "@mui/material";
import { useChat } from "ai/react";

import { Send01 } from "@untitled-ui/icons-react";
import { useCallback, useEffect, useRef } from "react";

import { getBaseUrl } from "~lib/trpc/react";
import { getAuthToken } from "~lib/trpc/vanilla-client";
import { useUser } from "@clerk/chrome-extension";
import { useQuery } from "@tanstack/react-query";
import { Message, WelcomeMessage } from "./components/messages";
import { AnswerSkeleton } from "./components/answer-skeleton";

const StyledFormContainer = styled("form")(({ theme }) => ({
  position: "fixed",
  bottom: "100px",
  width: "80%",
  display: "flex",
  alignItems: "center",
  border: `3px solid ${theme.palette.common.white}`,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
}));

const StyledInput = styled(Input)(({ theme }) => ({
  width: "100%",
  background: "transparent",
  outline: "none",
  border: "none",
  color: theme.palette.common.white,
}));

export const ChatWithSummaraize = () => {
  const { data: token } = useQuery({
    queryKey: ["token"],
    queryFn: getAuthToken,
  });
  const { user } = useUser();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: `${getBaseUrl()}/api/chat`,
      streamMode: "text",
      // credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

  // const { answer, askQuestion, clearAnswer, isLoading } = useAskXataDocs();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
  };

  const stopPropagation = useCallback((e: KeyboardEvent) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", stopPropagation, true);
    inputRef.current?.focus();
  }, [stopPropagation]);

  return (
    <Container
      sx={{
        overflowY: "auto",
        width: "100%",
        height: "80vh",
        display: "flex",
        gap: 1,
        flexDirection: "column-reverse",
        position: "relative",
      }}
    >
      {isLoading && <AnswerSkeleton />}
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <>
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message.content}
              type={message.role}
            />
          ))}
        </>
      )}

      <StyledFormContainer onSubmit={onSubmit}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            height: "100%",
          }}
        >
          <StyledInput
            inputRef={inputRef}
            name="prompt"
            value={input}
            onChange={onChange}
            id="input"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <IconButton type="submit">
            <Send01 />
          </IconButton>
        </Box>
      </StyledFormContainer>
    </Container>
  );
};

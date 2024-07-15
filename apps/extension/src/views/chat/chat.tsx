import { Box, Container, IconButton, Input, styled } from "@mui/material";
import { useChat } from "ai/react";

import { Send01 } from "@untitled-ui/icons-react";
import { useCallback, useEffect, useRef } from "react";

import { getBaseUrl } from "~lib/trpc/react";
import { getAuthToken } from "~lib/trpc/vanilla-client";
import { useQuery } from "@tanstack/react-query";
import { Message, WelcomeMessage } from "./components/messages";
import { Header } from "~components/header";
import { isMostRecentMessage } from "~utils";

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

export const ChatWithThatRundown = () => {
  const { data: token } = useQuery({
    queryKey: ["token"],
    queryFn: getAuthToken,
  });
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    !isLoading && handleSubmit();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
  };

  const stopPropagation = useCallback((e: KeyboardEvent) => {
    e.stopPropagation();
  }, []);

  const reversedMessages = [...messages].reverse();

  console.log("messages", messages);

  useEffect(() => {
    window.addEventListener("keydown", stopPropagation, true);
    inputRef.current?.focus();
  }, [stopPropagation]);

  return (
    <>
      <Header title="Chat" />
      <Container
        sx={{
          overflowY: "auto",
          width: "100%",
          height: "70vh",
          display: "flex",
          gap: 1,
          flexDirection: "column-reverse",
          position: "relative",
        }}
      >
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <>
            {reversedMessages.map((message) => (
              <Message
                loading={
                  isLoading &&
                  message.role === "assistant" &&
                  isMostRecentMessage(message, messages)
                }
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
    </>
  );
};

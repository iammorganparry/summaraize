import { Container, IconButton, Input, styled } from "@mui/material";
import { Send01 } from "@untitled-ui/icons-react";
import { useChat } from "ai/react";
import { useCallback, useEffect, useRef } from "react";
import { getBaseUrl } from "~lib/trpc/react";
import { getAuthToken } from "~lib/trpc/vanilla-client";

const StyledFormContainer = styled("form")(({ theme }) => ({
  position: "fixed",
  bottom: "100px",
  height: 150,
  width: "80%",
  display: "flex",
  alignItems: "center",
  border: `3px solid ${theme.palette.common.white}`,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
}));

const token = getAuthToken();

export const ChatWithSummaraize = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `${getBaseUrl()}/api/chat`,
    streamMode: "text",
    // credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const onSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
        </div>
      ))}
      <StyledFormContainer onSubmit={handleSubmit}>
        <input ref={inputRef} name="prompt" onChange={onChange} id="input" />
        <IconButton type="submit">
          <Send01 />
        </IconButton>
      </StyledFormContainer>
    </Container>
  );
};

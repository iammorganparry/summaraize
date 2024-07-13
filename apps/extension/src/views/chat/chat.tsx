import {
  Container,
  IconButton,
  Input,
  Typography,
  styled,
} from "@mui/material";
import { Send01 } from "@untitled-ui/icons-react";
import { useChat } from "ai/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBaseUrl } from "~lib/trpc/react";
import { getAuthToken } from "~lib/trpc/vanilla-client";
import { useAskXataDocs } from "./hooks";
import { AnswerSkeleton } from "./components/answer-skeleton";

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

export const ChatWithSummaraize = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [question, setQuestion] = useState("");
  const { answer, askQuestion, clearAnswer, isLoading } = useAskXataDocs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestion(question);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
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
      {isLoading ? <AnswerSkeleton /> : <Typography>{answer}</Typography>}

      <StyledFormContainer onSubmit={handleSubmit}>
        <input ref={inputRef} name="prompt" onChange={onChange} id="input" />
        <IconButton type="submit">
          <Send01 />
        </IconButton>
      </StyledFormContainer>
    </Container>
  );
};

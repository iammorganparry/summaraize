import {
  Box,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Input,
  styled,
  Typography,
} from "@mui/material";

import { Send01 } from "@untitled-ui/icons-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { api, getBaseUrl } from "~lib/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { Message, WelcomeMessage } from "./components/messages";
import { Header } from "~components/header";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import type { Message as AIMessage } from "ai";
import { useGetAuthToken } from "~lib/hooks/useGetAuthToken";
import dayjs from "dayjs";
import type { Prisma } from "@thatrundown/prisma";
import { useNavigate } from "react-router-dom";

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

const useAskSummary = ({
  onMessage,
  onSuccess,
}: {
  onMessage: (message: string) => void;
  onSuccess: (sessionId: string, records: string[]) => void;
}) => {
  const { data: token } = useGetAuthToken();
  return useMutation(["ask-summary"], ({ question }: { question: string; sessionId: string }) => {
    return new Promise((resolve) => {
      fetchEventSource(`${getBaseUrl()}/api/chat`, {
        method: "POST",
        body: JSON.stringify({ question }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        onmessage(ev) {
          try {
            const { answer = "", sessionId, records } = JSON.parse(ev.data);
            onMessage(answer);
            if (records) {
              resolve(answer);
              onSuccess(sessionId, records);
            }
          } catch (e) {}
        },
      });
    });
  });
};

export const ChatWithThatRundown = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [chatState, setChatState] = useState<{
    sessionId: string;
    messages: Partial<AIMessage>[];
    records: string[];
    input: string;
  }>({
    input: "",
    sessionId: "",
    messages: [],
    records: [],
  });

  const [answer, setAnswer] = useState("");

  const handleOnMessage = useCallback((message: string) => {
    setAnswer((prev) => `${prev}${message}`);
  }, []);

  const handleSessionId = useCallback((sessionId: string, records: string[]) => {
    setChatState((prev) => ({
      ...prev,
      sessionId,
      records,
    }));
  }, []);

  const { data: bestRecord } = api.summary.getSummaryById.useQuery(
    {
      id: chatState.records[chatState.records.length - 1],
    },
    {
      enabled: chatState.records.length > 0,
    },
  );

  console.log({ bestRecord });

  const { mutateAsync: askSummary } = useAskSummary({
    onMessage: handleOnMessage,
    onSuccess: handleSessionId,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { sessionId, input } = chatState;
    askSummary({ question: input, sessionId: sessionId });
    setChatState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        ...(answer.length > 0 ? [{ content: answer, role: "assistant" } as Partial<AIMessage>] : []),
        { content: input, role: "user" },
      ],
      input: "",
    }));
    setAnswer("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatState((prev) => ({
      ...prev,
      input: e.target.value,
    }));
  };

  const stopPropagation = useCallback((e: KeyboardEvent) => {
    // if the input is focused, don't stop propagation
    e.stopPropagation();
  }, []);

  const reversedMessages = useMemo(() => [...chatState.messages].reverse(), [chatState.messages]);

  useEffect(() => {
    window.addEventListener("keydown", stopPropagation, true);
    inputRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", stopPropagation, true);
    };
  }, [stopPropagation]);

  const utils = api.useUtils();
  const navigate = useNavigate();

  const handleViewSummary = useCallback(
    (
      summary: Prisma.SummaryGetPayload<{
        include: { video: { include: { authors: true } } };
      }>,
    ) =>
      () => {
        utils.summary.getSummaryByVideoUrl.setData({ url: summary.video_url }, summary, {
          updatedAt: Date.now(),
        });
        navigate(`/summary/${window.encodeURIComponent(summary.video_url)}`);
      },
    [navigate, utils.summary.getSummaryByVideoUrl],
  );

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
        {bestRecord && (
          <CardActionArea onClick={handleViewSummary(bestRecord)}>
            <CardMedia component="img" height="140" image={bestRecord.video?.thumbnail} src="thumbnail" />
            <CardContent sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h3">{bestRecord.name}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography variant="caption">
                  {bestRecord.video?.authors.map((author) => author.name).join(", ")}
                </Typography>
                <Typography variant="caption">{dayjs(bestRecord.created_at).fromNow()}</Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        )}
        {chatState.messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <>
            <Message key="current" message={answer} type="assistant" loading={answer.length === 0} />
            {reversedMessages.map((message) => (
              <Message key={message.id} message={message.content} type={message.role as "user" | "assistant"} />
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
            <StyledInput inputRef={inputRef} name="prompt" value={chatState.input} onChange={onChange} id="input" />
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

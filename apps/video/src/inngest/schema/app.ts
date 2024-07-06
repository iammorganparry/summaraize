type TranscribeVideoEvent = {
  name: "app/transcribe-video";
  data: {
    src: string;
    userId: string;
  };
};

type CancelTranscriptionEvent = {
  name: "app/cancel-transcription";
  data: {
    userId: string;
  };
};

export type AppEventsType = {
  "app/transcribe-video": TranscribeVideoEvent;
  "app/cancel-transcription": CancelTranscriptionEvent;
};

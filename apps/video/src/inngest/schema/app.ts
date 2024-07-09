type TranscribeVideoEvent = {
  name: "app/transcribe-video";
  data: {
    src: string;
    userId: string;
    videoId: string;
  };
};

type CancelTranscriptionEvent = {
  name: "app/cancel-transcription";
  data: {
    userId: string;
    src: string;
    videoId: string;
  };
};

export type AppEventsType = {
  "app/transcribe-video": TranscribeVideoEvent;
  "app/cancel-transcription": CancelTranscriptionEvent;
};

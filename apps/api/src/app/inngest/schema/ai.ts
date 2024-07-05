type TranscribeVideoEvent = {
	name: "ai/transcribe-video";
	data: {
		src: string;
		userId: string;
	};
};

type CancelTranscriptionEvent = {
	name: "ai/cancel-transcription";
	data: {
		userId: string;
	};
};

export type AIEvents = {
	"ai/transcribe-video": TranscribeVideoEvent;
	"ai/cancel-transcription": CancelTranscriptionEvent;
};

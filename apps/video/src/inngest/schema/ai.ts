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

export type AppEvents = {
	"app/transcribe-video": TranscribeVideoEvent;
	"app/cancel-transcription": CancelTranscriptionEvent;
};

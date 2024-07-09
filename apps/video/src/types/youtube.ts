export type YoutubeVideoResponse = {
  responseContext: ResponseContext;
  playabilityStatus: PlayabilityStatus;
  streamingData: StreamingData;
  playbackTracking: PlaybackTracking;
  captions: Captions;
  videoDetails: VideoDetails;
  playerConfig: PlayerConfig;
  storyboards: Storyboards;
  trackingParams: string;
  attestation: Attestation;
  endscreen: Endscreen;
  onResponseReceivedEndpoints: OnResponseReceivedEndpoint[];
  overlay: Overlay;
  onResponseReceivedActions: OnResponseReceivedAction[];
  adBreakHeartbeatParams: string;
  frameworkUpdates: FrameworkUpdates;
};

export type Attestation = {
  playerAttestationRenderer: PlayerAttestationRenderer;
};

export type PlayerAttestationRenderer = {
  challenge: string;
};

export type Captions = {
  playerCaptionsTracklistRenderer: PlayerCaptionsTracklistRenderer;
};

export type PlayerCaptionsTracklistRenderer = {
  captionTracks: CaptionTrack[];
  audioTracks: AudioTrack[];
  translationLanguages: TranslationLanguage[];
  defaultAudioTrackIndex: number;
  defaultTranslationSourceTrackIndices: number[];
};

export type AudioTrack = {
  captionTrackIndices: number[];
};

export type CaptionTrack = {
  baseUrl: string;
  name: Name;
  vssId: string;
  languageCode: string;
  kind: string;
  isTranslatable: boolean;
  trackName: string;
};

export type Name = {
  runs: Run[];
};

export type Run = {
  text: string;
};

export type TranslationLanguage = {
  languageCode: string;
  languageName: Name;
};

export type Endscreen = {
  endscreenRenderer: EndscreenRenderer;
};

export type EndscreenRenderer = {
  elements: Element[];
  startMs: string;
  trackingParams: string;
};

export type Element = {
  endscreenElementRenderer: EndscreenElementRenderer;
};

export type EndscreenElementRenderer = {
  style: string;
  image: ImageClass;
  icon?: EndscreenElementRendererIcon;
  left: number;
  width: number;
  top: number;
  aspectRatio: number;
  startMs: string;
  endMs: string;
  title: Title;
  metadata: Name;
  callToAction?: Name;
  dismiss?: Name;
  endpoint: EndscreenElementRendererEndpoint;
  hovercardButton?: HovercardButton;
  trackingParams: string;
  isSubscribe?: boolean;
  id: string;
  thumbnailOverlays?: ThumbnailOverlay[];
};

export type EndscreenElementRendererEndpoint = {
  clickTrackingParams: string;
  browseEndpoint?: BrowseEndpoint;
  commandMetadata?: CommandMetadata;
  watchEndpoint?: WatchEndpoint;
};

export type BrowseEndpoint = {
  browseId: string;
};

export type CommandMetadata = {
  interactionLoggingCommandMetadata: InteractionLoggingCommandMetadata;
};

export type InteractionLoggingCommandMetadata = {
  loggingExpectations: LoggingExpectations;
};

export type LoggingExpectations = {
  screenCreatedLoggingExpectations: ScreenCreatedLoggingExpectations;
};

export type ScreenCreatedLoggingExpectations = {
  expectedParentScreens: ExpectedParentScreen[];
};

export type ExpectedParentScreen = {
  screenVeType: number;
};

export type WatchEndpoint = {
  videoId: string;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
};

export type WatchEndpointSupportedOnesieConfig = {
  iosPlaybackOnesieConfig: IosPlaybackOnesieConfig;
};

export type IosPlaybackOnesieConfig = {
  commonConfig: CommonConfig;
};

export type CommonConfig = {
  url: string;
  ustreamerConfig: string;
};

export type HovercardButton = {
  subscribeButtonRenderer: SubscribeButtonRenderer;
};

export type SubscribeButtonRenderer = {
  buttonText: Name;
  subscribed: boolean;
  enabled: boolean;
  type: string;
  channelId: string;
  showPreferences: boolean;
  subscribedButtonText: Name;
  unsubscribedButtonText: Name;
  trackingParams: string;
  unsubscribeButtonText: Name;
  serviceEndpoints: ServiceEndpoint[];
};

export type ServiceEndpoint = {
  clickTrackingParams: string;
  subscribeEndpoint?: SubscribeEndpoint;
  unsubscribeEndpoint?: SubscribeEndpoint;
};

export type SubscribeEndpoint = {
  channelIds: string[];
  params: string;
};

export type EndscreenElementRendererIcon = {
  thumbnails: IconThumbnail[];
};

export type IconThumbnail = {
  url: string;
};

export type ImageClass = {
  thumbnails: ThumbnailThumbnail[];
};

export type ThumbnailThumbnail = {
  url: string;
  width: number;
  height: number;
};

export type ThumbnailOverlay = {
  thumbnailOverlayTimeStatusRenderer: ThumbnailOverlayTimeStatusRenderer;
};

export type ThumbnailOverlayTimeStatusRenderer = {
  text: Title;
  style: string;
};

export type Title = {
  runs: Run[];
  accessibility: Accessibility;
};

export type Accessibility = {
  accessibilityData: AccessibilityData;
};

export type AccessibilityData = {
  label: string;
};

export type FrameworkUpdates = {
  entityBatchUpdate: EntityBatchUpdate;
};

export type EntityBatchUpdate = {
  mutations: Mutation[];
  timestamp: Timestamp;
};

export type Mutation = {
  entityKey: string;
  type: string;
  payload: Payload;
};

export type Payload = {
  offlineabilityEntity: OfflineabilityEntity;
};

export type OfflineabilityEntity = {
  key: string;
  addToOfflineButtonState: string;
  commandWrapper: CommandWrapper;
  contentCheckOk: boolean;
  racyCheckOk: boolean;
  loggingDirectives: OfflineabilityEntityLoggingDirectives;
};

export type CommandWrapper = {
  command: Command;
  loggingDirectives: CommandWrapperLoggingDirectives;
};

export type Command = {
  innertubeCommand: NavigationEndpoint;
};

export type NavigationEndpoint = {
  clickTrackingParams: string;
  ypcGetOfflineUpsellEndpoint: YpcGetOfflineUpsellEndpoint;
};

export type YpcGetOfflineUpsellEndpoint = {
  params: string;
};

export type CommandWrapperLoggingDirectives = {
  trackingParams: string;
  enableDisplayloggerExperiment: boolean;
};

export type OfflineabilityEntityLoggingDirectives = {
  trackingParams: string;
  visibility: Visibility;
  enableDisplayloggerExperiment: boolean;
};

export type Visibility = {
  types: string;
};

export type Timestamp = {
  seconds: string;
  nanos: number;
};

export type OnResponseReceivedAction = {
  clickTrackingParams: string;
  startEomFlowCommand: StartEOMFlowCommand;
};

export type StartEOMFlowCommand = {
  eomFlowRenderer: EOMFlowRenderer;
  consentMoment: string;
};

export type EOMFlowRenderer = {
  webViewRenderer: WebViewRenderer;
};

export type WebViewRenderer = {
  url: URL;
  onFailureCommand: OnFailureCommand;
  trackingParams: string;
  webViewEntityKey: string;
  webToNativeMessageMap: WebToNativeMessageMap[];
  webViewUseCase: string;
  openInBrowserUrls: string[];
  firstPartyHostNameAllowList: string[];
};

export type OnFailureCommand = {
  clickTrackingParams: string;
  updateEomStateCommand: UpdateEOMStateCommand;
};

export type UpdateEOMStateCommand = {
  mobileEomFlowState: MobileEOMFlowState;
};

export type MobileEOMFlowState = {
  updatedVisitorData: string;
  isError: boolean;
};

export type URL = {
  privateDoNotAccessOrElseTrustedResourceUrlWrappedValue: string;
};

export type WebToNativeMessageMap = {
  key: string;
  value: Value;
};

export type Value = {
  clickTrackingParams: string;
  updateEomStateCommand?: SignInEndpoint;
  signInEndpoint?: SignInEndpoint;
};

export type SignInEndpoint = {
  hack: boolean;
};

export type OnResponseReceivedEndpoint = {
  clickTrackingParams: string;
  elementsCommand: ElementsCommand;
};

export type ElementsCommand = {
  updateEntityCommand: UpdateEntityCommand;
};

export type UpdateEntityCommand = {
  identifier: string;
  transform: string;
};

export type Overlay = {
  playerControlsOverlayRenderer: PlayerControlsOverlayRenderer;
};

export type PlayerControlsOverlayRenderer = {
  overflow: Overflow;
};

export type Overflow = {
  playerOverflowRenderer: PlayerOverflowRenderer;
};

export type PlayerOverflowRenderer = {
  endpoint: PlayerOverflowRendererEndpoint;
  trackingParams: string;
  enableListenFirst: boolean;
};

export type PlayerOverflowRendererEndpoint = {
  clickTrackingParams: string;
  menuEndpoint: MenuEndpoint;
};

export type MenuEndpoint = {
  menu: Menu;
};

export type Menu = {
  menuRenderer: MenuRenderer;
};

export type MenuRenderer = {
  items: Item[];
  trackingParams: string;
  loggingDirectives: OfflineabilityEntityLoggingDirectives;
};

export type Item = {
  menuNavigationItemRenderer?: MenuNavigationItemRenderer;
  toggleMenuServiceItemRenderer?: ToggleMenuServiceItemRenderer;
};

export type MenuNavigationItemRenderer = {
  text: Name;
  icon: DefaultIconClass;
  navigationEndpoint: MenuNavigationItemRendererNavigationEndpoint;
  trackingParams: string;
  menuItemIdentifier: string;
};

export type DefaultIconClass = {
  iconType: string;
};

export type MenuNavigationItemRendererNavigationEndpoint = {
  clickTrackingParams: string;
  videoQualityPickerEndpoint?: PickerEndpoint;
  captionPickerEndpoint?: PickerEndpoint;
  applicationHelpEndpoint?: ApplicationHelpEndpoint;
};

export type ApplicationHelpEndpoint = {
  helpContext: string;
  showFeedback: boolean;
};

export type PickerEndpoint = {
  videoId: string;
};

export type ToggleMenuServiceItemRenderer = {
  defaultText: Name;
  defaultIcon: DefaultIconClass;
  defaultServiceEndpoint: DefaultServiceEndpoint;
  toggledText: Name;
  toggledIcon: DefaultIconClass;
  toggledServiceEndpoint: ToggledServiceEndpoint;
  trackingParams: string;
  menuItemIdentifier: string;
};

export type DefaultServiceEndpoint = {
  clickTrackingParams: string;
  enableSingleVideoPlaybackLoopCommand: AbleSingleVideoPlaybackLoopCommand;
};

export type AbleSingleVideoPlaybackLoopCommand = Record<string, unknown>;

export type ToggledServiceEndpoint = {
  clickTrackingParams: string;
  disableSingleVideoPlaybackLoopCommand: AbleSingleVideoPlaybackLoopCommand;
};

export type PlayabilityStatus = {
  status: string;
  playableInEmbed: boolean;
  offlineability: Offlineability;
  pictureInPicture: PictureInPicture;
  miniplayer: Miniplayer;
  contextParams: string;
};

export type Miniplayer = {
  miniplayerRenderer: MiniplayerRenderer;
};

export type MiniplayerRenderer = {
  playbackMode: string;
};

export type Offlineability = {
  buttonRenderer: ButtonRenderer;
};

export type ButtonRenderer = {
  navigationEndpoint: NavigationEndpoint;
  trackingParams: string;
};

export type PictureInPicture = {
  pictureInPictureRenderer: PictureInPictureRenderer;
};

export type PictureInPictureRenderer = {
  offByDefault: boolean;
};

export type PlaybackTracking = {
  videostatsPlaybackUrl: EngageURLClass;
  videostatsDelayplayUrl: EngageURLClass;
  videostatsWatchtimeUrl: EngageURLClass;
  ptrackingUrl: EngageURLClass;
  qoeUrl: EngageURLClass;
  atrUrl: AtrURL;
  engageUrl: EngageURLClass;
  videostatsScheduledFlushWalltimeSeconds: number[];
  videostatsDefaultFlushIntervalSeconds: number;
};

export type AtrURL = {
  baseUrl: string;
  elapsedMediaTimeSeconds: number;
  headers: Header[];
};

export type Header = {
  headerType: HeaderType;
};

export type HeaderType = "USER_AUTH" | "VISITOR_ID";

export type EngageURLClass = {
  baseUrl: string;
  headers: Header[];
};

export type PlayerConfig = {
  hlsProxyConfig: HLSProxyConfig;
  audioConfig: AudioConfig;
  backgroundPlaybackConfig: BackgroundPlaybackConfig;
  adRequestConfig: AdRequestConfig;
  lidarSdkConfig: LidarSDKConfig;
  iosAvPlayerConfig: IosAVPlayerConfig;
  vrConfig: VRConfig;
  iosPlayerConfig: IosPlayerConfig;
  iosBandwidthEstimatorConfig: IosBandwidthEstimatorConfig;
  qoeStatsClientConfig: QoeStatsClientConfig;
  adSurveyRequestConfig: AdSurveyRequestConfig;
  hamplayerConfig: HamplayerConfig;
  daiConfig: DaiConfig;
  mediaCommonConfig: MediaCommonConfig;
  playerGestureConfig: PlayerGestureConfig;
};

export type AdRequestConfig = {
  enableOfflineDelayAllowedFlag: boolean;
  useCriticalExecOnAdsPrep: boolean;
  enableAdThrottled: number;
  enableEventReportingAlt: boolean;
  userCriticalExecOnAdsProcessing: boolean;
  enableCountdownNextToThumbnailIos: boolean;
  preskipScalingFactorIos: number;
  preskipPaddingIos: number;
};

export type AdSurveyRequestConfig = {
  useGetRequests: boolean;
};

export type AudioConfig = {
  perceptualLoudnessDb: number;
  enablePerFormatLoudness: boolean;
};

export type BackgroundPlaybackConfig = {
  enableAudioOnlyPlayer: boolean;
  audioPlayerSeekAheadSeconds: number;
  videoPlayerSeekAheadSeconds: number;
  videoPlayerMaxSyncTimeSeconds: number;
  audioPlayerMaxSyncTimeSeconds: number;
  foregroundVideoPlaybackThresholdSeconds: number;
};

export type DaiConfig = {
  gabTrimPlayerResponse: boolean;
};

export type HamplayerConfig = {
  enableOnCellular: boolean;
  qosClass: string;
  decodeQosClass: string;
  videoTrackRenderer: VideoTrackRenderer;
  stallPredictor: StallPredictor;
  live: Live;
  networkStatsSamplerConfig: NetworkStatsSamplerConfig;
  decodeTeardownOnDecodeQueue: boolean;
  decodeWaitForFramesBeforeTeardown: boolean;
  decodeSeparateQueues: boolean;
  decodeNoWaitForTerminate: boolean;
  resyncPolicyConfig: ResyncPolicyConfig;
  audioAbrConfig: OABRConfig;
  videoAbrConfig: OABRConfig;
  enableAirplayAudio: boolean;
  chunkLoaderConfig: ChunkLoaderConfig;
  sbarAudioTrackRenderer: SbarAudioTrackRenderer;
  useMultiplePeriodsPlayer: boolean;
  loadRetryConfig: LoadRetryConfig;
  renderViewType: string;
  serverAbrConfig: ServerABRConfig;
  sbVideoTrackRenderer: SbVideoTrackRenderer;
  logDebugDetailsOnLongWaitThresholdMs: number;
  playerLoopTimerIntervalMs: number;
  playerLoopTimerLeewayMs: number;
  selectDefaultTrackForMultiAudio: boolean;
  disableHfrHdFormatFilter: boolean;
  useResolutionForHfrHdFormatFilter: boolean;
  disableResolveOverlappingQualitiesByCodec: boolean;
  alwaysCreateMfc: boolean;
  platypusConfig: PlatypusConfig;
};

export type OABRConfig = {
  downshiftScalar: number;
  downshiftConstant: number;
  upshiftScalar: number;
  upshiftConstant: number;
  maxDownshiftReadaheadMs: number;
  minUpshiftReadaheadMs: number;
  upshiftReplaceMedia: boolean;
  bufferTargetReadahead: number;
  bufferMaxSizeBytes: string;
  bufferTrimBehind: number;
  bufferTrimAhead: number;
  maxChunksPerRequest: number;
  syncReadahead: number;
  stunDuration: number;
  maxConsecutiveErrors: number;
  minUpshiftReplaceChunksReadaheadMs: number;
  lowMemoryWarnBufferSizeBytes: string;
  lowMemoryCriticalBufferSizeBytes: string;
  lowMemoryBufferSizeCoolDownMs: string;
  disableHdrInLowPowerMode: boolean;
  observeNetworkActiveController: boolean;
  oversendFactor?: number;
  localMaxBitrateReadahead?: number;
  minReadaheadForAverageBitrate?: number;
  loadExtraFormats?: boolean;
  useHighReplicationFormatsWhileStunned?: boolean;
  maxMediaSecondsPerRequest?: number;
  hpqOversendFactor?: number;
};

export type ChunkLoaderConfig = {
  enableFallbackHost: boolean;
  maxFailureAttemptsBeforeFallback: number;
  primaryProbingDelay: number;
  cacheWhileStreaming: boolean;
  treatNoMediaAsCancellation: boolean;
};

export type Live = {
  enableAccurateSeek: boolean;
  accurateSeekRetryLimit: number;
  enableAccurateSeekAfterPrepared: boolean;
  enableSsDaiEmsgParsing: boolean;
};

export type LoadRetryConfig = {
  maxNonNetworkErrors: number;
};

export type NetworkStatsSamplerConfig = {
  minimumSampleSize: number;
  minimumSampleDurationMs: number;
  targetSampleDurationMs: number;
};

export type PlatypusConfig = {
  brotliCompressionQuality: number;
  manageMfcQueueForGaplessLiveMidroll: boolean;
};

export type ResyncPolicyConfig = {
  targetReadaheadMs: number;
  minRequiredTimeMs: number;
  maxElapsedTimeMs: number;
  seekToleranceMs: number;
};

export type SbVideoTrackRenderer = {
  samplesPerBuffer: number;
  readLoopIterations: number;
  maxPendingSampleCount: number;
  maxDecodingErrorRetries: number;
  maxRenderingErrorRetries: number;
  maxFallBehindMs: number;
  controlTimebaseResyncPeriodMs: number;
  maxTimestampSeconds: number;
};

export type SbarAudioTrackRenderer = {
  samplesPerBuffer: number;
  flushOnReturnFromBackground: boolean;
  trimPriming: boolean;
  feedMediaData: boolean;
  handleAutomaticFlush: boolean;
  rendererMaxRetryCount: number;
  useAllTracksForPlayabilityStatus: boolean;
};

export type ServerABRConfig = {
  fallbackOnError: boolean;
  fallbackDisableServerAbrDurationSeconds: number;
  enableLocalStreams: boolean;
  logPartialChunkEviction: boolean;
  maxFallbackAttempts: number;
  continueLoadingTimerIntervalMs: number;
  continueLoadingTimerLeewayMs: number;
  coverChunkDiscontinuity: boolean;
  allowMultipleServerSeek: boolean;
  skipFilterPreferredVideoFormats: boolean;
  useXplatMfc: boolean;
  evictPartialSegmentsOnInitMetadataMismatch: boolean;
};

export type StallPredictor = {
  hamplayerDefaultStallPredictorConfig: HamplayerDefaultStallPredictorConfig;
};

export type HamplayerDefaultStallPredictorConfig = {
  maxBufferReadaheadMs: number;
  minBufferReadaheadMs: number;
  bandwidthTweakScalar: number;
  bandwidthTweakConstant: number;
  movePlayableTimeRangeCheck: boolean;
};

export type VideoTrackRenderer = {
  hamplayerPixelBufferVideoTrackRendererConfig: HamplayerPixelBufferVideoTrackRendererConfig;
};

export type HamplayerPixelBufferVideoTrackRendererConfig = {
  minFrameQueueSize: number;
  targetFrameQueueSize: number;
  maxFrameFallBehindMs: number;
  queueMoreFramesOnRender: boolean;
};

export type HLSProxyConfig = {
  enableProxy: boolean;
  initialStreamSelectionStrategy: string;
  defaultInitialBitrate: number;
  maxInitialBitrate: number;
  enableMediaPlaylistProxy: boolean;
  hlsChunkHost: string;
  bitrateEstimateScale: number;
  playlistFetchMaxRetries: number;
  indepdendentSegments: boolean;
  condensedUrlPrefix: string;
  deterministicOutputVersion: number;
  useErrorTolerantParser: boolean;
};

export type IosAVPlayerConfig = {
  enableBackgroundErrorRetry: boolean;
  enableMediaServicesResetRetry: boolean;
  maxFailureRetryCount: number;
  usePlayerItemLogRecorder: boolean;
  useStallNotification: boolean;
  setPlayerLayerScale: boolean;
  pollPlayerItemVideoTrackForQoe: boolean;
  enableSeekToEnd: boolean;
  enableFailedToParseRetry: boolean;
  useFailedToPlayNotification: boolean;
  oversendFactor: number;
  hpqOversendFactor: number;
};

export type IosBandwidthEstimatorConfig = {
  defaultBitrate: number;
  maxAgeSeconds: number;
  maxTotalSampleWeight: number;
};

export type IosPlayerConfig = {
  continuePlaybackOnInactive: boolean;
  useInnertubeDefaultCaptions: boolean;
  displayCaptionsAbovePlayerBar: boolean;
  enlargeCaptionsInFullscreen: boolean;
  logBackgroundWithUiapplicationstate: boolean;
  enableQualitySelectionOnCellular: boolean;
  dttsToleranceBeforeMs: number;
  dttsToleranceAfterMs: number;
  scrubMinSeekIntervalMs: number;
  useInnertubeDrmService: boolean;
  requestIosguardDataAfterPlaybackStarts: boolean;
  singleVideoMediaTimeContext: string;
  useAncillaryStreamStateToFinishLiveStreams: boolean;
  enableWatchEndpointUstreamerConfig: boolean;
  minimumBufferedMediaTimeSecondsToPrefetchUpcomingTransition: string;
  upcomingViewportSizeProvider: string;
};

export type LidarSDKConfig = {
  enableActiveViewReporter: boolean;
  useMediaTime: boolean;
  sendTosMetrics: boolean;
  usePlayerState: boolean;
  enableIosAppStateCheck: boolean;
  enableImprovedSizeReportingIos: boolean;
  enableIsAndroidVideoAlwaysMeasurable: boolean;
  enableActiveViewAudioMeasurementIos: boolean;
  enableActiveViewIosShorts: boolean;
};

export type MediaCommonConfig = {
  dynamicReadaheadConfig: DynamicReadaheadConfig;
  mediaUstreamerRequestConfig: MediaUstreamerRequestConfig;
  mediaFetchRetryConfig: MediaFetchRetryConfig;
  serverReadaheadConfig: ServerReadaheadConfig;
  useServerDrivenAbr: boolean;
  sabrClientConfig: SabrClientConfig;
  serverPlaybackStartConfig: ServerPlaybackStartConfig;
  enableServerDrivenRequestCancellation: boolean;
  usePlatypus: boolean;
};

export type DynamicReadaheadConfig = {
  maxReadAheadMediaTimeMs: number;
  minReadAheadMediaTimeMs: number;
  readAheadGrowthRateMs: number;
};

export type MediaFetchRetryConfig = {
  initialDelayMs: number;
  backoffFactor: number;
  maximumDelayMs: number;
  jitterFactor: number;
};

export type MediaUstreamerRequestConfig = {
  videoPlaybackUseUmp: boolean;
  videoPlaybackUstreamerConfig: string;
};

export type SabrClientConfig = {
  defaultBackOffTimeMs: number;
  enableHostFallback: boolean;
  primaryProbingDelayMs: number;
  maxFailureAttemptsBeforeFallback: number;
};

export type ServerPlaybackStartConfig = {
  enable: boolean;
  playbackStartPolicy: PlaybackStartPolicy;
};

export type PlaybackStartPolicy = {
  startMinReadaheadPolicy: StartMinReadaheadPolicy[];
};

export type StartMinReadaheadPolicy = {
  minReadaheadMs: number;
};

export type ServerReadaheadConfig = {
  enable: boolean;
  nextRequestPolicy: NextRequestPolicy;
};

export type NextRequestPolicy = {
  targetAudioReadaheadMs: number;
  targetVideoReadaheadMs: number;
};

export type PlayerGestureConfig = {
  downAndOutLandscapeAllowed: boolean;
  downAndOutPortraitAllowed: boolean;
};

export type QoeStatsClientConfig = {
  batchedEntriesPeriodMs: string;
};

export type VRConfig = {
  useNativeVrtoolkit: boolean;
  magicWindowEduOverlayText: string;
  magicWindowEduOverlayAnimationUrl: string;
  enableIosMagicWindowEduOverlay: boolean;
};

export type ResponseContext = {
  visitorData: string;
  serviceTrackingParams: ServiceTrackingParam[];
  maxAgeSeconds: number;
};

export type ServiceTrackingParam = {
  service: string;
  params: Param[];
};

export type Param = {
  key: string;
  value: string;
};

export type Storyboards = {
  playerStoryboardSpecRenderer: PlayerStoryboardSpecRenderer;
};

export type PlayerStoryboardSpecRenderer = {
  spec: string;
  recommendedLevel: number;
};

export type StreamingData = {
  expiresInSeconds: string;
  adaptiveFormats: AdaptiveFormat[];
  hlsManifestUrl: string;
  aspectRatio: number;
  serverAbrStreamingUrl: string;
};

export type AdaptiveFormat = {
  itag: number;
  url: string;
  mimeType: string;
  bitrate: number;
  width?: number;
  height?: number;
  initRange: Range;
  indexRange: Range;
  lastModified: string;
  contentLength: string;
  quality: string;
  fps?: number;
  qualityLabel?: string;
  projectionType: "RECTANGULAR";
  averageBitrate: number;
  approxDurationMs: string;
  highReplication?: boolean;
  audioQuality?: string;
  audioSampleRate?: string;
  audioChannels?: number;
  loudnessDb?: number;
  xtags?: string;
  isDrc?: boolean;
};

export type Range = {
  start: string;
  end: string;
};

export type VideoDetails = {
  videoId: string;
  title: string;
  lengthSeconds: string;
  keywords: string[];
  channelId: string;
  isOwnerViewing: boolean;
  shortDescription: string;
  isCrawlable: boolean;
  thumbnail: ImageClass;
  allowRatings: boolean;
  viewCount: string;
  author: string;
  isPrivate: boolean;
  isUnpluggedCorpus: boolean;
  isLiveContent: boolean;
};

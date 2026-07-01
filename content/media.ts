/**
 * Media assets served from the Cloudflare CDN (not local /public). Video is
 * streamed from the CDN; the poster/captions live alongside it under /video.
 */
const VIDEO_CDN = "https://cdn.doxaplc.com/video";

export const WALKTHROUGH_VIDEO = `${VIDEO_CDN}/doxa-walkthrough.mp4`;
export const WALKTHROUGH_POSTER = `${VIDEO_CDN}/doxa-walkthrough-poster.jpg`;
export const WALKTHROUGH_CAPTIONS = `${VIDEO_CDN}/doxa-walkthrough.vtt`;

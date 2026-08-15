/**
 * Media assets served from the Cloudflare CDN (not local /public). Video is
 * streamed from the CDN; the poster/captions live alongside it under /video.
 *
 * The MP4 exports below are no longer what the site plays — the walkthrough
 * and the thank-you clip come from YouTube now (see the ids further down).
 * They are kept because the POSTER is still the pre-click still on the home
 * page, and because the FAQ clips commented out of /faq and /thank-you still
 * reference them.
 */
const VIDEO_CDN = "https://cdn.doxaplc.com/video";

export const WALKTHROUGH_VIDEO = `${VIDEO_CDN}/doxa-walkthrough.mp4`;
export const WALKTHROUGH_POSTER = `${VIDEO_CDN}/doxa-walkthrough-poster.jpg`;
export const WALKTHROUGH_CAPTIONS = `${VIDEO_CDN}/doxa-walkthrough.vtt`;

/**
 * YouTube video ids — the bare id from a watch/embed/youtu.be URL, never a
 * full URL. `OfficeVideo` builds the embed itself, through the IFrame Player
 * API, so that the player wears our controls rather than YouTube's.
 *
 * Captions are whatever is uploaded to the YouTube video; WALKTHROUGH_CAPTIONS
 * no longer reaches a player.
 */
export const WALKTHROUGH_YOUTUBE_ID = "awuPRpS0Cqw";
export const THANK_YOU_YOUTUBE_ID = "mMF-YRzn9Rg";

/**
 * Facts about the walkthrough clip, for its VideoObject structured data.
 *
 * `uploadDate` and `duration` are REQUIRED for a video rich result — a
 * VideoObject without them is invalid rather than merely sparse. Both are read
 * off the YouTube video itself, so update them if the clip is re-uploaded.
 */
export const WALKTHROUGH_VIDEO_META = {
  name: "Doxa Innovations Office Walkthrough",
  description:
    "A walk through the Doxa Innovations office in Bishoftu, Ethiopia: the room, the desks and the people who build the software.",
  /** From the video's own metadata. */
  uploadDate: "2026-08-14",
  /** ISO 8601. The clip runs 63 seconds. */
  duration: "PT1M3S",
};

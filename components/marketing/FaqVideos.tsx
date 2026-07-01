import type { FaqVideo } from "@/content/faqVideos";
import { Reveal } from "@/components/Reveal";
import { VideoEmbed } from "@/components/VideoEmbed";

/**
 * Grid of portrait FAQ video tiles (clip + question + answer). Shared by the
 * /faq page and the thank-you page so both stay in sync.
 */
export function FaqVideos({ items }: { items: FaqVideo[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
      {items.map((item, i) => (
        <Reveal key={item.question}>
          <div className="flex h-full flex-col rounded-[1.5rem] border border-line bg-panel p-5">
            <VideoEmbed
              orientation="portrait"
              src={item.videoSrc}
              poster={item.poster}
              title={`Q${i + 1}`}
              className="mx-auto w-full max-w-[230px]"
            />
            <h3 className="mt-5 font-display text-lg font-semibold text-ink">
              {item.question}
            </h3>
            <p className="mt-2 text-sm text-ink-muted">{item.answer}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

import type { AddOn, PricingTier } from "@/content/types";

/**
 * Price formatting, in one place.
 *
 * Amounts are stored as numbers so an editor can change 1700 to 1900 without
 * having to reproduce a currency symbol, a thousands separator and the word
 * "From" exactly. These functions turn them back into the copy the site has
 * always shown.
 */

const usd = new Intl.NumberFormat("en-US");

/**
 * "From $1,700" for the world, "From ETB 30,000" for Ethiopian visitors, and
 * the quote-only wording for tiers priced per project.
 *
 * The two quote labels differ on purpose: "On request" reads naturally to an
 * international buyer, while "On order" is the phrasing already used locally.
 */
export function formatTierPrice(tier: PricingTier, isEthiopia: boolean): string {
  if (tier.mode === "quote") return isEthiopia ? "On order" : "On request";

  if (isEthiopia) {
    return tier.amountEtb === null
      ? "On order"
      : `From ETB ${usd.format(tier.amountEtb)}`;
  }

  return tier.amountUsd === null
    ? "On request"
    : `From $${usd.format(tier.amountUsd)}`;
}

/** "From $100/month". Add-ons are USD only and hidden from Ethiopian visitors. */
export function formatAddOnPrice(addOn: AddOn): string {
  const base = `From $${usd.format(addOn.amountUsd)}`;
  return addOn.interval === "month" ? `${base}/month` : base;
}

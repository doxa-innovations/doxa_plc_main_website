import QRCode from "react-qr-code";
import { ShieldCheck } from "lucide-react";
import { SITE } from "@/content/site";
import { Button } from "@/components/ui/button";

/**
 * Independent verification: a scannable QR (dark modules on white for
 * reliable scanning) plus a button, both opening the Ethiopian Ministry of
 * Trade business-license checker for our license number.
 */
export function QrVerify() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-6 text-center sm:flex-row sm:text-left sm:p-7">
      <div className="shrink-0 rounded-2xl bg-white p-3">
        <QRCode
          value={SITE.etradeVerifyUrl}
          size={116}
          bgColor="#ffffff"
          fgColor="#14002e"
        />
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-ink">
          Verify our license, independently
        </h3>
        <p className="mt-1.5 text-sm text-ink-muted">
          Scan the code, or use the button, to check our business license
          directly on the Ethiopian Ministry of Trade portal. License No.{" "}
          {SITE.registration.licenseNo}.
        </p>
        <div className="mt-4">
          <Button asChild>
            <a
              href={SITE.etradeVerifyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ShieldCheck className="size-4" strokeWidth={1.75} />
              Verify on the Ministry of Trade
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

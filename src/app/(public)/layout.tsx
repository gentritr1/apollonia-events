import { ViewTransition } from "react";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <ViewTransition enter="public-page-crossfade" exit="public-page-crossfade">
        <div className="flex-1">{children}</div>
      </ViewTransition>
      <SiteFooter />
    </>
  );
}

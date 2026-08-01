import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#permbajtja" className="skip-link btn btn-primary btn-sm">
        Kaloni te përmbajtja
      </a>
      <SiteHeader />
      <main id="permbajtja" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

import { TempleLine } from "@/components/public/temple-line";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-ivory">
      <TempleLine animate="draw" loop className="h-14 w-28 text-gold" />
    </div>
  );
}

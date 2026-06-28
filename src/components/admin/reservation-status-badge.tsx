import type { ReservationStatus } from "@prisma/client";

import { statusBadgeClasses, statusLabels } from "@/lib/admin/reservations";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ReservationStatusBadge({
  status,
}: {
  status: ReservationStatus;
}) {
  return (
    <Badge variant="outline" className={cn(statusBadgeClasses[status])}>
      {statusLabels[status]}
    </Badge>
  );
}

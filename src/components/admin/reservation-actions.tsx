"use client";

import { Fragment, useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReservationStatus } from "@prisma/client";

import { updateReservationStatus } from "@/server/admin-reservations";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const actions = [
  { status: "CONFIRMED", label: "Mark confirmed" },
  { status: "DECLINED", label: "Mark declined" },
  { status: "CANCELLED", label: "Mark cancelled" },
  { status: "PENDING", label: "Reset to pending", separated: true },
] satisfies Array<{
  status: ReservationStatus;
  label: string;
  separated?: boolean;
}>;

export function ReservationActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: ReservationStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateStatus(status: ReservationStatus) {
    startTransition(async () => {
      await updateReservationStatus(id, status);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open reservation actions"
          disabled={isPending}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => (
          <Fragment key={action.status}>
            {action.separated ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem
              disabled={isPending || action.status === currentStatus}
              onSelect={() => updateStatus(action.status)}
            >
              {action.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

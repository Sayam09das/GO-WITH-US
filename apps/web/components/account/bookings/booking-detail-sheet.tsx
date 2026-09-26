"use client";

import type { BookingSummary } from "@gowithus/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  bookingDisplayLocation,
  bookingDisplayTitle,
  bookingRefundLabel,
  bookingStatusLabel,
  bookingTypeLabel,
  formatAmount,
  formatBookingDateRange,
  formatBookingGuests,
} from "@/lib/account/bookings/booking-display";
import { countTripNights } from "@/lib/account/trips/trip-display";
import { cancelBooking, getBooking } from "@/lib/api/bookings";

interface BookingDetailSheetProps {
  booking: BookingSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingUpdated: (booking: BookingSummary) => void;
}

function BookingDetailSheet({
  booking,
  open,
  onOpenChange,
  onBookingUpdated,
}: BookingDetailSheetProps) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof getBooking>> | null>(null);

  useEffect(() => {
    if (!booking || !open) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void getBooking(booking.id)
      .then((response) => {
        if (!cancelled) {
          setDetail(response);
          const roomLabel = response.items[0]?.roomLabel;
          setTitle(bookingDisplayTitle(booking, roomLabel));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTitle(bookingDisplayTitle(booking));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [booking, open]);

  if (!booking) {
    return null;
  }

  const nights = countTripNights(booking.startDate, booking.endDate);
  const paidAmount =
    detail?.payments.find((payment) => payment.status === "paid")?.amount ?? booking.totalAmount;
  const canCancel = booking.status === "pending" || booking.status === "confirmed";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-b border-border/60 pb-6 text-left">
          <SheetDescription className="text-xs uppercase tracking-[0.16em]">
            Reservation
          </SheetDescription>
          <SheetTitle className="section-heading text-2xl text-heading">
            {title || bookingDisplayTitle(booking)}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">{bookingDisplayLocation(booking)}</p>
        </SheetHeader>

        <div className="flex flex-col gap-8 py-6">
          <dl className="grid gap-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Reference</dt>
              <dd className="font-medium text-heading">{booking.reference}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium text-heading">{bookingStatusLabel(booking.status)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="font-medium text-heading">{bookingTypeLabel(booking.type)}</dd>
            </div>
          </dl>

          <section>
            <h3 className="text-sm font-semibold text-heading">Dates</h3>
            <dl className="mt-3 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Stay / experience</dt>
                <dd className="text-right font-medium text-heading">
                  {formatBookingDateRange(booking, "long")}
                </dd>
              </div>
              {booking.type === "stay" ? (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Check-in</dt>
                    <dd className="font-medium text-heading">
                      {detail?.items[0]?.checkIn ?? booking.startDate ?? "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Check-out</dt>
                    <dd className="font-medium text-heading">
                      {detail?.items[0]?.checkOut ?? booking.endDate ?? "—"}
                    </dd>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-medium text-heading">
                  {nights ? `${nights} night${nights === 1 ? "" : "s"}` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Guests</dt>
                <dd className="font-medium text-heading">
                  {formatBookingGuests(booking.guestCount)}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-heading">Payment</h3>
            <dl className="mt-3 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Total</dt>
                <dd className="font-medium text-heading">
                  {formatAmount(booking.totalAmount, booking.currency)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Paid</dt>
                <dd className="font-medium text-heading">
                  {formatAmount(paidAmount, booking.currency)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Payment status</dt>
                <dd className="capitalize font-medium text-heading">{booking.paymentStatus}</dd>
              </div>
              {booking.status === "cancelled" ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Refund</dt>
                  <dd className="font-medium text-heading">
                    {bookingRefundLabel(booking.paymentStatus)}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading reservation details…</p>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-border/60 pt-6">
            <Button type="button" variant="outline" className="rounded-full" disabled>
              View confirmation
            </Button>
            <Button type="button" variant="outline" className="rounded-full" disabled>
              Download invoice
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/account/help">Contact property</Link>
            </Button>
            {canCancel ? (
              <Button
                type="button"
                variant="destructive"
                className="rounded-full"
                disabled={isCancelling}
                onClick={() => {
                  setIsCancelling(true);
                  void cancelBooking(booking.id)
                    .then((updated) => {
                      onBookingUpdated(updated);
                      onOpenChange(false);
                    })
                    .finally(() => setIsCancelling(false));
                }}
              >
                {isCancelling ? "Cancelling…" : "Cancel booking"}
              </Button>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { BookingDetailSheet };

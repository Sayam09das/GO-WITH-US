import { Star } from "lucide-react";
import type { ReviewSectionData } from "@/lib/api/reviews";

type ReviewsSectionProps = {
  data: ReviewSectionData | null;
};

export function ReviewsSection({ data }: ReviewsSectionProps) {
  if (!data || data.reviewCount === 0) {
    return (
      <section className="rounded-[1.25rem] border border-border/60 bg-background p-5">
        <h2 className="text-lg font-semibold text-heading">Guest reviews</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No reviews yet. Be the first to share your experience.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[1.25rem] border border-border/60 bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-heading">Guest reviews</h2>
        <p className="inline-flex items-center gap-1 text-sm font-medium text-heading">
          <Star aria-hidden="true" className="size-4 fill-primary text-primary" />
          {data.averageRating.toFixed(1)} · {data.reviewCount} reviews
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {data.reviews.slice(0, 4).map((review) => (
          <article key={review.id} className="rounded-2xl bg-soft-gray p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-heading">{review.user.name}</p>
              <p className="text-sm text-muted-foreground">{review.rating}/5</p>
            </div>
            {review.title ? <p className="mt-2 font-medium text-heading">{review.title}</p> : null}
            {review.body ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

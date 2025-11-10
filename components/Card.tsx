'use client'

// components/Card.tsx
import Image from "next/image";
import Link from "next/link";

export type BadgeTone = "red" | "green" | "orange";

export interface CardProps {
  title: string;
  id?: string; // Optional to allow runtime check
  description?: string;
  subtitle?: string;
  meta?: string | string[];
  imageSrc: string;
  imageAlt?: string;
  price?: string | number;
  /** @deprecated – the component now always uses `/customizer/${id}` */
  href?: string;
  badge?: { label: string; tone?: BadgeTone };
  className?: string;
}

const toneToTextColor: Record<BadgeTone, string> = {
  red: "text-[--color-red]",
  green: "text-[--color-green]",
  orange: "text-[--color-orange]",
};

export default function Card({
  title,
  id,
  description,
  subtitle,
  meta,
  imageSrc,
  imageAlt = title,
  price,
  badge,
  className = "",
}: CardProps) {
  const displayPrice =
    price === undefined ? undefined : typeof price === "number" ? `$${price.toFixed(2)}` : price;

  const badgeElement = badge ? (
    <span
      className={`text-caption font-semibold ${badge.tone ? toneToTextColor[badge.tone] : ""}`}
    >
      {badge.label}
    </span>
  ) : null;

  const content = (
    <article
      className={`group rounded-xl bg-light-100 ring-1 ring-light-300 transition-colors hover:ring-dark-500 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-light-200">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h3 className="text-heading-3 text-dark-900">{title}</h3>
          {displayPrice && <span className="text-body-medium text-dark-900">{displayPrice}</span>}
        </div>
        {badgeElement}
        {description && <p className="text-body text-dark-700">{description}</p>}
        {subtitle && <p className="text-body text-dark-700">{subtitle}</p>}
        {meta && (
          <p className="mt-1 text-caption text-dark-700">
            {Array.isArray(meta) ? meta.join(" • ") : meta}
          </p>
        )}
      </div>
    </article>
  );

  if (!id) {
    console.warn("Card component received undefined `id`");
    return content;
  }

  return (
    <Link
      href={`/customizer/${id}`}
      aria-label={title}
      className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
    >
      {content}
    </Link>
  );
}
import Image from "next/image";
import { consoleCopy } from "@/data/console";
import type { CaptionedImage, ImageAsset } from "@/types";
import { Icon } from "@/components/console/icon";

interface EvidenceProps {
  image: ImageAsset & { caption?: string; crop?: boolean };
  number?: number;
  framed?: boolean;
  cover?: boolean;
  eager?: boolean;
}

export function Evidence({ image, number, framed = false, cover = false, eager = false }: EvidenceProps) {
  const copy = consoleCopy.dossier;
  const portrait = !framed && !cover && image.height > image.width;
  const label = number !== undefined && image.caption ? `${copy.figure} ${number}. ${image.caption}` : (image.caption ?? image.alt);
  const fit = image.position === "contain" ? " fit-contain" : image.position === "top" ? " fit-top" : "";
  return (
    <figure className={`evidence${portrait ? " evidence-portrait" : ""}${cover ? " evidence-cover" : ""}`}>
      <a
        className={`evidence-frame${framed || cover ? " evidence-crop" : ""}${fit}`}
        href={image.src}
        target="_blank"
        rel="noopener noreferrer"
        data-screen=""
        data-width={image.width}
        data-height={image.height}
        data-caption={label}
      >
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} unoptimized loading={eager ? "eager" : "lazy"} />
        <span className="evidence-zoom" aria-hidden="true">
          <Icon name="expand" />
        </span>
        <span className="sr-only">, {copy.openImage}</span>
      </a>
      {image.caption ? (
        <figcaption>
          {number !== undefined ? (
            <b>
              {copy.figure} {number}.
            </b>
          ) : null}{" "}
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export type { CaptionedImage };

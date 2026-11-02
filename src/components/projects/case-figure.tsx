import Image from "next/image";
import { ui } from "@/data/ui";
import type { CaptionedImage } from "@/types";
import { cn } from "@/lib/utils";

interface CaseFigureProps {
  image: CaptionedImage;
  framed?: boolean;
  className?: string;
}

export function CaseFigure({ image, framed = false, className }: CaseFigureProps) {
  const portrait = framed ? false : image.height > image.width;
  return (
    <figure className={cn("case-figure", portrait && "case-figure-portrait", className)}>
      <a href={image.src} target="_blank" rel="noopener noreferrer" className={cn("case-figure-frame", framed && "case-figure-crop")}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          unoptimized
          loading="lazy"
          className={cn("w-full", framed ? "h-full object-cover object-top" : "h-auto")}
        />
        <span className="sr-only">
          , {ui.project.openImage} {ui.externalSuffix}
        </span>
      </a>
      <figcaption className="case-figcaption">{image.caption}</figcaption>
    </figure>
  );
}

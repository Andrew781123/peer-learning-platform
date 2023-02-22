import clsx from "clsx";
import Image from "next/image";

import { useImageModalContext } from "@/hooks/useImageModalContext";

type MarkdownImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: (src: string) => void;
};

export const MarkdownImage = ({
  src,
  alt,
  width = 2000,
  height = 2000,
  className,
}: MarkdownImageProps) => {
  const { openImageModal } = useImageModalContext();

  return (
    <Image
      onClick={() => openImageModal(src)}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={clsx("w-full h-auto cursor-pointer", className)}
      quality={100}
    />
  );
};

import clsx from "clsx";
import Image from "next/image";

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
  return (
    <Image
      onClick={() => window.open(src!, "_blank")}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={clsx("w-full h-auto", className)}
      quality={100}
    />
  );
};

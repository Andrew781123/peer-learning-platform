import Image from "next/image";
import { ReactNode, createContext, useContext, useState } from "react";

type ImageModalContextType = {
  imageUrl: string | null;
  openImageModal: (url: string) => void;
  closeImageModal: () => void;
};

const ImageModalContext = createContext<ImageModalContextType>(null!);

export const ImageModalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const openImageModal = (url: string) => {
    setImageUrl(url);
  };

  const closeImageModal = () => {
    setImageUrl(null);
  };

  return (
    <ImageModalContext.Provider
      value={{
        imageUrl,
        openImageModal,
        closeImageModal,
      }}
    >
      {imageUrl && (
        <div
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 right-0 w-full h-full z-50 overflow-x-hidden overflow-y-auto"
          onClick={closeImageModal}
        >
          <div className="relative w-full max-w-6xl h-full flex justify-center items-center m-auto px-10">
            <Image
              width={2000}
              height={2000}
              className="w-full h-auto"
              alt="modal-image"
              src={imageUrl}
            />
          </div>
        </div>
      )}
      {children}
    </ImageModalContext.Provider>
  );
};

export const useImageModalContext = () => useContext(ImageModalContext);

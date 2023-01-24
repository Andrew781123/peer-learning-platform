type UseImgurProps = {};

export const useImgur = ({}: UseImgurProps) => {
  const uploadImage = async (base64Image: string): Promise<string> => {
    return Promise.resolve("");
  };

  return {
    uploadImage,
  };
};

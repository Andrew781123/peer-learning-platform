const generateImageMarkdown = (imageLink: string): string => {
  return `![image](${imageLink})`;
};

export const insertImageToMarkdown = ({
  currentMarkdown,
  imageLink,
}: {
  currentMarkdown: string;
  imageLink: string;
}): string => {
  const imageMarkdown = generateImageMarkdown(imageLink);
  if (currentMarkdown.trim() === "") return imageMarkdown;

  return `${currentMarkdown}\n${imageMarkdown}`;
};

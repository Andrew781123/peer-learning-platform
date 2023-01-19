const generateSolutionTitle = (solutionId: string): string => {
  return `Solution #${solutionId.slice(-7)}`;
};

export default generateSolutionTitle;

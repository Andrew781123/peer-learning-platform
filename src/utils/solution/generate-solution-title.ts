const generateSolutionTitle = (solutionId: string): string => {
  return `Submission #${solutionId.slice(-7)}`;
};

export default generateSolutionTitle;

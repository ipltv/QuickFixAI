/**
 * @description Helper function to convert a number array into the string format pgvector expects.
 * e.g., [1, 2, 3] => '[1,2,3]'
 * @param embedding - The array of numbers.
 * @returns A formatted string.
 */
export const toVectorString = (embedding: number[]): string =>
  `[${embedding.join(",")}]`;

export default toVectorString;

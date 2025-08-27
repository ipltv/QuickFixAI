// Make K fields of T optional (other fields are required)
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make all fields of T optional except K
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Reusable type utility to strongly mock functions/interfaces
export type MockedFunction<T extends (...args: any[]) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;

/**
 * Utility to mock an entire interface.
 * Ensures the mocked methods follow TypeScript argument and return types.
 */
export type MockedInterface<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any
        ? jest.Mock<ReturnType<T[K]>, Parameters<T[K]>>
        : T[K];
};
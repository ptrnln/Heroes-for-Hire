export {};

declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
            selectedAddress: string;
            on: (event: string, callback: (accounts: string[]) => void) => void;
            removeListener: (event: string, callback: (accounts: string[]) => void) => void;
        };
        sessionUser: {
            address: string;
        } | null;
        dispatch: (action: unknown) => Promise<void>;
    }
} 
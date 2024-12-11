import { UnknownAction } from "redux";

export const OPEN_AUTH_MODAL: "ui/OPEN_AUTH_MODAL";
export const CLOSE_AUTH_MODAL: "ui/CLOSE_AUTH_MODAL";

export function openAuthModalThunk(): UnknownAction;
export function closeAuthModalThunk(): UnknownAction;

interface UiState {
    authModalOpen: boolean;
}

export default function uiReducer(state: UiState, action: any): UiState;
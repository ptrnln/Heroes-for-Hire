const initialState = {
    authModalOpen: false
}

export const OPEN_AUTH_MODAL = "ui/OPEN_AUTH_MODAL"
export const CLOSE_AUTH_MODAL = "ui/CLOSE_AUTH_MODAL"

export const openAuthModalThunk = ()  => {
    return {
        type: OPEN_AUTH_MODAL
    }
}

export const closeAuthModalThunk = () => {
    return {
        type: CLOSE_AUTH_MODAL
    }
}

export default function uiReducer(state = initialState, action) {
    const newState = {...Object.freeze(state)}

    switch(action.type) {
        case OPEN_AUTH_MODAL:
            return { ...newState,
                authModalOpen: true
            }
        case CLOSE_AUTH_MODAL:
            return { ...newState,
                authModalOpen: false
            }
        default:
            return newState
    }
}
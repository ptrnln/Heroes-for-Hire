const initialState = {
    user: null
}

export const LOGIN = "session/LOGIN";
export const SIGNUP = "session/SIGNUP";
export const LOGOUT = "session/LOGOUT"

export const login = (user) => {
    return {
        user,
        type: LOGIN
    }
}

export const signup = (user) => {
    return {
        user,
        type: SIGNUP
    }
}

export const logout = () => {
    return {
        type: LOGOUT
    }
}
export default function sessionReducer (state = initialState, action) {
    const newState = {...Object.freeze(state)}

    switch(action.type) {
        case SIGNUP:
        case LOGIN:
            return {
                ...newState,
                user: action.user
            }
        case LOGOUT:
            return {
                ...newState,
                user: null
            }
        default:
            return newState
    }
}
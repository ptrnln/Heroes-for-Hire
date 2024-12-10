import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';
import {
    useAuthenticate,
    useAuthModal,
    useLogout,
    useSignerStatus,
    useUser,
} from "@account-kit/react";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from "./store/ui"

// import supabase from './SupabaseClient';

declare namespace globalThis {
    var sessionUser: any
    var dispatch: any
}

function App()
{   
    const dispatch = useDispatch();
    const user = useUser();
    const { openAuthModal, closeAuthModal, isOpen } = useAuthModal();
    const stateIsOpen = useSelector((state: any) => state.ui.authModalOpen)
    // const stateUser = useSelector((state: any) => state.session.user);
    // const { authenticate, authenticateAsync, isPending, error } = useAuthenticate({
    //     onSuccess: undefined
    // })
    const signerStatus = useSignerStatus();
    const { logout } = useLogout();


    // const [loading, setLoading] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const changeScene = () => {

        if(phaserRef.current)
        {     
            const scene = phaserRef.current.scene as MainMenu;
            
            if (scene)
            {
                scene.changeScene();
            }
        }
    }

    useEffect(() => {
        if(+stateIsOpen ^ +isOpen) {
            stateIsOpen ? openAuthModal() : closeAuthModal();
        } 
    }, [stateIsOpen, openAuthModal, closeAuthModal])

    useEffect(() => {
        globalThis.sessionUser = user
        if(user) dispatch(uiActions.closeAuthModalThunk())
    }, [user, dispatch])

    useEffect(() => {
        globalThis.dispatch = dispatch
    }, [dispatch])



    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {

        
        
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                {signerStatus.isInitializing ? (
                    <>Loading...</>
                ) : user ? (
                    <div className="flex flex-col gap-2 p-2">
                    <p className="text-xl font-bold">Success!</p>
                    You're logged in as {user.email ?? "anon"}.<button
                        className="akui-btn akui-btn-primary mt-6"
                        onClick={() => logout()}
                    >
                        Log out
                    </button>
                    </div>
                ) : (
                    <button className="akui-btn akui-btn-primary" onClick={() => dispatch(uiActions.openAuthModalThunk())}>
                    Login
                    </button>
                )}
            </div>
        </div>
    )
}

export default App

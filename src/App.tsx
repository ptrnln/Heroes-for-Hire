import { useRef, useCallback, /*useState */ } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';
import {
    /*useAuthenticate,*/
    useAuthModal,
    useLogout,
    useSignerStatus,
    useUser,
    UseUserResult,
} from "@account-kit/react";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from "./store/ui"

// import supabase from './SupabaseClient';


/** 
 * The global object
 * @sessionUser
 * The user currently signed in
 * 
 * @dispatch
 * Function for dispatching Redux actions
*/

declare namespace globalThis {
    var sessionUser: UseUserResult | null
    var dispatch: Function
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

    const beginLogout = () => {
        if(confirm("Are you sure you want to log out? \n\n(You will be returned to the main menu and any unsaved progress may be lost as a result)")) {
            logout();
        }
    }


    // const [loading, setLoading] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const changeScene = useCallback((sceneKey: string) => {
        if(phaserRef.current)
        {     
            const scene = phaserRef.current.scene as MainMenu;
            
            if (scene && sceneKey)
            {
                phaserRef.current.game?.scene.start(sceneKey)
            }
        }
    }, [])

    useEffect(() => {
        if(+stateIsOpen ^ +isOpen) {
            stateIsOpen ? openAuthModal() : closeAuthModal();
        } 
    }, [stateIsOpen, openAuthModal, closeAuthModal, isOpen])

    useEffect(() => {
        if(!isOpen) dispatch(uiActions.closeAuthModalThunk())
    }, [isOpen])

    useEffect(() => {
        globalThis.sessionUser = user ?? null
        if(user) dispatch(uiActions.closeAuthModalThunk());
    }, [user, dispatch])

    useEffect(() => {
        if(!user && phaserRef.current?.game) {

            const game = phaserRef.current.game;
            // Stop all active scenes
            game.scene.getScenes(true).forEach(scene => {
                game.scene.stop(scene.scene.key);
            });
            // Start MainMenu
            game.scene.start('MainMenu');
        }
    }, [user])

    useEffect(() => {
        if(dispatch) globalThis.dispatch = dispatch
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
                        onClick={() => beginLogout()}
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

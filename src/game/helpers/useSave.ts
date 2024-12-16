import { UseUserResult } from "@account-kit/react";
import { supabase } from "../../supabaseClient";
import { sign } from "jws";

export const useSave = async (user: UseUserResult) => {

    const now = Date.now() / 1000

    const token = sign({ payload: {
        sub: user?.userId,
        iat: now,
        exp: now + 3600
      }, secret: import.meta.env["VITE_JWT_SECRET"], header: {
        alg: "HS256", typ: "JWT"
      }});

    const headers = { "Authorization": `Bearer ${token}` };

    const { data, error } = await supabase({ headers })
        .from("game_saves")
        .select("*")
        .eq("identities.user_id", user?.userId);

    if(error) throw error
    return {
        save: async (gameSave: any) => {
            const { data, error } = await supabase({ headers })
                .from("game_saves")
                .insert({
                    ...gameSave
                });
        }
    }
}
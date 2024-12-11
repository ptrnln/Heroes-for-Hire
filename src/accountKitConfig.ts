import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { sepolia, alchemy } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";
import supabase from "./SupabaseClient";
import { getUser } from "@account-kit/core"
import { sign } from "jws"

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google", mode: "popup" },
        { type: "social", authProviderId: "facebook", mode: "popup" },
      ],
      [
        {
          type: "external_wallets",
          walletConnect: { projectId: "f6d4de40ad2c9fcbc474548819bd2f0b" },
        },
      ],
    ],
    addPasskeyOnSignup: false,
    onAuthSuccess: async () => 
    {
      const user = getUser(config);

      const now = Math.floor(Date.now() / 1000)

      const token = sign({ payload: {
        sub: user?.userId,
        iat: now,
        exp: now + 3600
      }, secret: import.meta.env["VITE_JWT_SECRET"], header: {
        alg: "HS256", typ: "JWT"
      }})

      const headers = { "Authorization": `Bearer ${token}` };

      const { data, error } = await supabase({ headers }).from("identities").select().eq("user_id", user?.userId).eq("provider_id", user?.orgId)

      if(data.length && !error) {
        await supabase({ headers }).from("identities").update({
          user_id: user?.userId,
          provider_id: user?.orgId,
          email: user?.email,
          last_signed_in_at: new Date().toISOString()
        }).eq("id", data[0]?.id)
      } else {
        await supabase({ headers }).from("identities").insert({
          user_id: user?.userId,
          provider_id: user?.orgId,
          email: user?.email,
          last_signed_in_at: new Date().toISOString()
        })
      }
    }
  },
};

export const config = createConfig(
  {
    // if you don't want to leak api keys, you can proxy to a backend and set the rpcUrl instead here
    // get this from the app config you create at https://dashboard.alchemy.com/accounts?utm_source=demo_alchemy_com&utm_medium=referral&utm_campaign=demo_to_dashboard
    transport: alchemy({ apiKey: import.meta.env["VITE_ACCOUNTKIT_APIKEY"] }),
    chain: sepolia,
    ssr: true, // set to false if you're not using server-side rendering
    enablePopupOauth: true,
  },
  uiConfig,
);

export const queryClient = new QueryClient();
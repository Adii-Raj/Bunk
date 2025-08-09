import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import * as admin from "npm:firebase-admin";

const serviceAccount = {
  projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
  clientEmail: Deno.env.get("FIREBASE_CLIENT_EMAIL"),
  privateKey: Deno.env.get("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

serve(async (req) => {
  try {
    const { tokens, title, body } = await req.json();

    const message = {
      notification: { title, body },
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);

    return new Response(
      JSON.stringify({ success: true, response }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
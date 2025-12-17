import "server-only";

import admin from "firebase-admin";
import serviceAccount from "@/firebase-back-config.json";

const app =
  admin.app("admin-app") ??
  admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
    },
    "admin-app"
  );

export default app;

import "server-only";

import { UserRecord } from "firebase-admin/auth";
import firebaseAdmin from "@/lib/firebase-back";

export default async function getUser(uid: string): Promise<UserRecord> {
  return await firebaseAdmin.auth().getUser(uid);
}

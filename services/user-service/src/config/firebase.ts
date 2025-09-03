// services/user-service/src/config/firebase.ts

import * as admin from "firebase-admin";

const serviceAccount = require("../../service-key.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

admin.initializeApp();

export const firebaseAdmin = admin;

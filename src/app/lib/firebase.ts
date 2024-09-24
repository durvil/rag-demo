import * as admin from 'firebase-admin';
import {getFirestore} from "firebase-admin/firestore";
import {vertexAI} from "@genkit-ai/vertexai";
import {configureGenkit} from "@genkit-ai/core";

const devCredentialPath = {
    // Your firebase service account
};
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(devCredentialPath as admin.ServiceAccount),
    });
    configureGenkit({
        plugins: [vertexAI({location: "northamerica-northeast1"})],
        enableTracingAndMetrics: true,
    });

}

export const firestore = getFirestore()

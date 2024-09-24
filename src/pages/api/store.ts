import {firestore} from "@/src/app/lib/firebase";
import {NextApiRequest, NextApiResponse} from "next";
import {embed} from "@genkit-ai/ai/embedder";
import {textEmbeddingGecko} from "@genkit-ai/vertexai";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {userId, content} = req.body;
        const embedding = await embed({
            embedder: textEmbeddingGecko,
            content: content,
        });

        await firestore.collection('ai-documents').add({
            userId,
            content,
            embedding
        });

        res.status(200).json({message: 'Data stored successfully'});
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}

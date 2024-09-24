import {NextApiRequest, NextApiResponse} from "next";
import {firestore} from "@/src/app/lib/firebase";
import {loadPromptFile} from "@genkit-ai/dotprompt";


export function generateEmbedding(text: string) {
    return text.split(' ').map((word) => word.length * 0.1);
}

async function generateResponse(contexts: string[], query: string): Promise<string> {
    const promptPath = `${process.cwd()}/src/prompts/recruitment-agent.prompt`;

    const prompt = await loadPromptFile(promptPath);
    const llmResponse = await prompt.generate({
        config: {
            maxOutputTokens: 400,
            stopSequences: ["<end>", "<fin>"],
            temperature: 1.2,
            topP: 0.4,
            topK: 50,
        },
        context: [
            {
                content: contexts.map((content) => {
                    return {text: content}
                })
            }
        ],
        input: {
            query
        }
    });

    return llmResponse.text();
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bestMatch: string[] = [];
    const {userId, query} = req.query;
    const queryEmbedding = generateEmbedding(query as string);


    const snapshot = await firestore.collection('ai-documents')
        .where('userId', '==', userId)
        .get();

    let highestSimilarity = -1;
    snapshot.forEach(doc => {
        const docData = doc.data();
        const similarity = calculateSimilarity(queryEmbedding, docData.embedding);

        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch.push(docData.content);
        }
    });

    if (bestMatch.length > 0) {
        const generatedResponse = await generateResponse(bestMatch, query as string);
        const bestMatchedResponses = bestMatch.join('\n\n ------- \n\n ');
        res.status(200).json({bestMatch: bestMatchedResponses, highestSimilarity, generatedResponse});
    } else {
        res.status(404).json({message: "No matching document found."});
    }

}

function calculateSimilarity(embedding1: number[], embedding2: number[]) {
    return embedding1.reduce((acc, value, index) => acc + value * embedding2[index], 0);
}

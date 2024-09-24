"use client"

import { useState } from 'react';

interface ResponseData {
    bestMatch: string;
    highestSimilarity: number;
    generatedResponse: string;
}

 

export default function Home() {
    const [userId, setUserId] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [queryText, setQueryText] = useState<string>('');
    const [result, setResult] = useState<ResponseData>();


    const storeDocument = async () => {
        try {
            const res = await fetch('/api/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, content }),
            });
            if (res.ok) {
                alert('Document stored successfully!');
            } else {
                const data = await res.json();
                alert('Error storing document: ' + data.error);
            }
        } catch (error) {
            alert('Error: ' + error?.message);
        }
    };

    const queryDocument = async () => {
        try {
            const res = await fetch(`/api/query?userId=${userId}&query=${queryText}`);
            const data = await res.json();
            setResult(data);
        } catch (error) {
            alert('Error querying document: ' + error.message);
        }
    };

    return (

        <div
            className="bg-gray-50 ">
            <div className="p-6 max-w-2xl mx-auto min-h-screen">
                <h1 className="text-2xl font-bold mb-4 text-center">RAG with Genkit and Vertex AI</h1>

                <div className="mb-4">
                    <input
                        type="text"
                        className="border p-2 text-black block mb-4 w-full"
                        placeholder="User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <textarea
                        className="border p-2 text-black block mb-4 w-full"
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button onClick={storeDocument} className="bg-blue-500 text-white p-2 ">
                        Store Document
                    </button>
                </div>

                <div className="mb-4 mt-6">
                    <input
                        type="text"
                        className="border p-2 text-black block mb-4 w-full"
                        placeholder="Query Text"
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                    />
                    <button onClick={queryDocument} className="bg-green-500 text-white p-2">
                        Query Document
                    </button>
                </div>

                {result && (
                    <div className="mt-4">
                        <div className="text-center">
                            <h2>Bests Match:</h2>
                            {result.bestMatch}</div>
                        <hr className="my-4" />
                        <p>Similarity Score: {result.highestSimilarity}</p>
                        <hr className="my-4" />
                        <div className="text-center">
                            <h2>Generated Response:</h2>
                            {result.generatedResponse}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

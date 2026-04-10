import { getWriters } from "@/services/writerService";

export async function GET() {
    const writers = await getWriters();
    return new Response(JSON.stringify(writers), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
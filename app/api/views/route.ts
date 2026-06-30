import { createClient } from 'redis';
import { NextResponse } from 'next/server';

async function getRedisClient() {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.error('Redis Client Error', err));
  
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    const client = await getRedisClient();
    
    const views = await client.incr(`views:${slug}`);
    
    await client.disconnect();
    
    return NextResponse.json({ totalViews: views });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ totalViews: 0 }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const client = await getRedisClient();
    
    const views = await client.get(`views:${slug}`);
    
    await client.disconnect();
    
    return NextResponse.json({ totalViews: Number(views) || 0 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ totalViews: 0 }, { status: 500 });
  }
}
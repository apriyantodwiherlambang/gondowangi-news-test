import { createClient, RedisClientType } from 'redis';
import { NextResponse } from 'next/server';

let client: RedisClientType | null = null;

async function getRedisClient() {
  if (client && client.isOpen) {
    return client;
  }

  client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.error('Redis Client Error', err));

  await client.connect();
  return client;
}

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    const redis = await getRedisClient();

    const views = await redis.incr(`views:${slug}`);

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
    const redis = await getRedisClient();

    const views = await redis.get(`views:${slug}`);

    return NextResponse.json({ totalViews: Number(views) || 0 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ totalViews: 0 }, { status: 500 });
  }
}
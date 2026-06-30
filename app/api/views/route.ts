import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { slug } = await request.json();
  const views = await kv.incr(`views:${slug}`);
  return NextResponse.json({ totalViews: views });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const views = await kv.get(`views:${slug}`);
  return NextResponse.json({ totalViews: views || 0 });
}
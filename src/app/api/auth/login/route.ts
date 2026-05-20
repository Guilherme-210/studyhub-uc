import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body

    // Simple mock: accept any credentials and return a token + user
    const user = {
      id: 'user-1',
      name: 'Mock User',
      email: email || 'user@example.com',
    }

    return NextResponse.json({ accessToken: 'mock-token', user }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }
}

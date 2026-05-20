import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const token = auth.split(' ')[1]
  if (token !== 'mock-token') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = {
    id: 'user-1',
    name: 'Mock User',
    email: 'user@example.com',
  }

  return NextResponse.json(user)
}

import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.nextUrl.searchParams.get('token')
  
  if (!token || token !== process.env.API_TOKEN) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard'
}

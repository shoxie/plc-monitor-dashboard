import { NextResponse } from 'next/server'
export const config = {
  matcher: ['/tool/:path*'],
}

export function middleware(request) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get('user')?.value
  const response = NextResponse.next()
//   response.cookies.set('vercel', 'fast')
//   response.cookies.set({
//     name: 'vercel',
//     value: 'fast',
//     path: '/test',
//   })
//   cookie = response.cookies.get('vercel')
//   console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/test' }
//   // The outgoing response will have a `Set-Cookie:vercel=fast;path=/test` header.

  return cookie ? response : NextResponse.redirect(new URL('/signin', request.url))
}
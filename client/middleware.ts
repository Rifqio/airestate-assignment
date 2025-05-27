import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware (request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/' || path.startsWith('/auth')

    const authCookie = request.cookies.get('nice-estate-auth')?.value
    let isAuthenticated = false

    try {
        if (authCookie) {
            const parsedCookie = JSON.parse(authCookie)
            isAuthenticated = !!parsedCookie.token
        }
    } catch (e) {
        console.error('Failed to parse auth cookie:', e)
        isAuthenticated = false
    }

    if (!isPublicPath && !isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (isAuthenticated && isPublicPath && path !== '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*']
}

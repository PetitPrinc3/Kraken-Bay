import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(request: NextRequestWithAuth) {

        if (request.nextUrl.pathname.startsWith('/admin') && request.nextauth.token?.roles !== 'admin') {
            return NextResponse.rewrite(new URL("/account", request.url))
        }

        if (request.nextauth.token?.roles == "") {
            return NextResponse.rewrite(new URL("/auth", request.url))
        }

    }, {
    callbacks: {
        authorized: ({ token }) => !!token
    }
}
)

export const config = {
    matcher: ["/admin/:path*", "/vlc/:path*", "/watch/:path*", "/account", "/home", "/latest", "/movies", "/search", "/series", "/upload", "/welcome"]
}
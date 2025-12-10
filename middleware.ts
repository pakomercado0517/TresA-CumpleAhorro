import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/groups", "/members", "/payments", "/settings", "/events"];

// Rutas de autenticación (redirigir a dashboard si ya está autenticado)
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta está protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar si es una ruta de autenticación
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // IMPORTANTE: Como Zustand guarda en localStorage (cliente), no podemos verificar
  // la autenticación en el middleware (servidor). Por lo tanto:
  // 1. Las rutas protegidas se manejan con ProtectedRoute en el cliente
  // 2. El middleware solo redirige rutas protegidas a login para usuarios sin auth
  //    pero la verificación real se hace en el cliente
  
  // Para rutas protegidas, simplemente dejamos pasar y que el componente
  // ProtectedRoute maneje la redirección si no hay auth
  if (isProtectedRoute) {
    // Permitir el acceso - ProtectedRoute se encargará de verificar
    return NextResponse.next();
  }

  // Para rutas de autenticación, también dejamos pasar
  // El hook useAuth se encargará de redirigir si ya está autenticado
  if (isAuthRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


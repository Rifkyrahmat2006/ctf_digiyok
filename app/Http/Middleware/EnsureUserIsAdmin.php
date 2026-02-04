<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            if ($request->wantsJson() || $request->inertia()) {
                abort(403, 'Access denied. Admin only.');
            }
            
            return redirect()->route('ctf.login')
                ->with('error', 'Access denied. Admin only.');
        }

        return $next($request);
    }
}

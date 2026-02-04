<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsParticipant
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->isParticipant()) {
            if ($request->wantsJson() || $request->inertia()) {
                abort(403, 'Access denied. Participants only.');
            }
            
            return redirect()->route('ctf.login')
                ->with('error', 'Access denied. Participants only.');
        }

        // Ensure participant has a team
        if (!$user->team_id) {
            if ($request->wantsJson() || $request->inertia()) {
                abort(403, 'You must be assigned to a team.');
            }
            
            return redirect()->route('ctf.login')
                ->with('error', 'You must be assigned to a team.');
        }

        return $next($request);
    }
}

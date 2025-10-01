<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')
                ->prefix('authority')
                ->as('admin.')
                ->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->use([
            // \Illuminate\Http\Middleware\TrustHosts::class,
            Illuminate\Http\Middleware\TrustProxies::class,
            Illuminate\Http\Middleware\HandleCors::class,
            Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
            Illuminate\Http\Middleware\ValidatePostSize::class,
            Illuminate\Foundation\Http\Middleware\TrimStrings::class,
            Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        ]);

        $middleware->group('web', [
            // \App\Http\Middleware\EncryptCookies::class,
            Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            Illuminate\Session\Middleware\StartSession::class,
            Illuminate\View\Middleware\ShareErrorsFromSession::class,
            App\Http\Middleware\VerifyCsrfToken::class,
            Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);

        $middleware->group('api', [
            // Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
            Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
        $middleware->alias([
            'auth' => App\Http\Middleware\Authenticate::class,
            'auth.basic' => Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
            'auth.session' => Illuminate\Session\Middleware\AuthenticateSession::class,
            'cache.headers' => Illuminate\Http\Middleware\SetCacheHeaders::class,
            'can' => Illuminate\Auth\Middleware\Authorize::class,
            'guest' => App\Http\Middleware\RedirectIfAuthenticated::class,
            'password.confirm' => Illuminate\Auth\Middleware\RequirePassword::class,
            'precognitive' => Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,
            'signed' => App\Http\Middleware\ValidateSignature::class,
            'throttle' => Illuminate\Routing\Middleware\ThrottleRequests::class,
            'verified' => Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
            'checkUserType' => App\Http\Middleware\CheckUserType::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

<?php

namespace Workbench\App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public const LOCALES = ['en', 'es'];

    protected $rootView = 'app';

    /**
     * The demo locale comes from the `demo_locale` cookie (set by the language switcher).
     */
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->cookie('demo_locale');

        App::setLocale(in_array($locale, self::LOCALES, true) ? $locale : 'en');

        return parent::handle($request, $next);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'locale'     => App::getLocale(),
            'demo'       => __('demo::demo.ui'),
            'categories' => __('demo::demo.categories'),
        ]);
    }
}

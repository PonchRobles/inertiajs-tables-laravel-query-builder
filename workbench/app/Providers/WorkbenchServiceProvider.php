<?php

namespace Workbench\App\Providers;

use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

use function Orchestra\Testbench\package_path;

class WorkbenchServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // A file based SQLite database inside workbench/, so the data persists while serving.
        $database = package_path('workbench/database/database.sqlite');

        if (!file_exists($database)) {
            touch($database);
        }

        config([
            'database.default'            => 'sqlite',
            'database.connections.sqlite' => [
                'driver'                  => 'sqlite',
                'database'                => $database,
                'prefix'                  => '',
                'foreign_key_constraints' => true,
            ],
        ]);
    }

    public function boot(): void
    {
        // The language switcher sets this cookie from JavaScript, so it is not encrypted.
        EncryptCookies::except('demo_locale');

        // Server-side labels of the demo (columns, filters, options, page texts): __('demo::demo.*').
        $this->loadTranslationsFrom(package_path('workbench/lang'), 'demo');

        // `npm run demo:dev` writes the hot file here; builds are symlinked to public/build (see testbench.yaml).
        Vite::useHotFile(package_path('workbench/public/hot'));
        Vite::useBuildDirectory('build');
    }
}

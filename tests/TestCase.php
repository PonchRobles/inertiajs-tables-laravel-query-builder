<?php

namespace PonchRobles\InertiaTable\Tests;

use Inertia\Inertia;
use Inertia\ServiceProvider as InertiaServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;
use PonchRobles\InertiaTable\InertiaTableServiceProvider;

abstract class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();

        Inertia::setRootView('app');
        config(['inertia.testing.ensure_pages_exist' => false]);

        $this->app['config']->set('view.paths', [
            __DIR__ . '/resources/views',
        ]);
    }

    protected function getPackageProviders($app): array
    {
        return [
            InertiaServiceProvider::class,
            InertiaTableServiceProvider::class,
        ];
    }

    protected function defineRoutes($router): void
    {
        //
    }
}

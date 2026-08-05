<?php

namespace PonchRobles\InertiaTable\Filters;

use Illuminate\Contracts\Support\Arrayable;

interface Filterable extends Arrayable
{
    public function getKey(): string;

    public function getType(): string;

    public function getValue(): mixed;

    public function setValue(mixed $value): void;
}

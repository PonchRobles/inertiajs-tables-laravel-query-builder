<?php

namespace PonchRobles\InertiaTable\Filters;

class ToggleFilter implements Filterable
{
    protected const TYPE = 'toggle';

    public function __construct(
        public string $key,
        public string $label,
        public ?bool $value = null,
    ) {
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function getType(): string
    {
        return self::TYPE;
    }

    public function getValue(): mixed
    {
        return $this->value;
    }

    public function setValue(mixed $value): void
    {
        $this->value = $value;
    }

    public function toArray(): array
    {
        return [
            'key'   => $this->key,
            'label' => $this->label,
            'value' => $this->value,
            'type'  => self::TYPE,
        ];
    }
}

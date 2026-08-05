<?php

namespace PonchRobles\InertiaTable\Filters;

use Illuminate\Support\Arr;

class Filter implements Filterable
{
    protected const TYPE = 'select';

    public function __construct(
        public string $key,
        public string $label,
        public array $options,
        public ?string $value = null,
        public bool $noFilterOption = true,
        public string $noFilterOptionLabel = '-',
        public string $type = 'select',
    ) {
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function getType(): string
    {
        return $this->type;
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
        $options = $this->options;

        if ($this->noFilterOption) {
            $options = Arr::prepend($options, $this->noFilterOptionLabel, '');
        }

        return [
            'key'     => $this->key,
            'label'   => $this->label,
            'options' => $options,
            'value'   => $this->value,
            'type'    => $this->type,
        ];
    }
}

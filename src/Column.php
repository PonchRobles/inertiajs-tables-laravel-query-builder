<?php

namespace PonchRobles\InertiaTable;

use Illuminate\Contracts\Support\Arrayable;

class Column implements Arrayable
{
    public function __construct(
        public string $key,
        public string $label,
        public bool $canBeHidden = true,
        public bool $hidden = false,
        public bool $sortable = false,
        public bool|string $sorted = false,
        public bool $nullsLast = false,
    ) {
    }

    public function toArray(): array
    {
        return [
            'key'           => $this->key,
            'label'         => $this->label,
            'can_be_hidden' => $this->canBeHidden,
            'hidden'        => $this->hidden,
            'sortable'      => $this->sortable,
            'sorted'        => $this->sorted,
            'nulls_last'    => $this->nullsLast,
        ];
    }
}

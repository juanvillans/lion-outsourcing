<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $data = [
            'id' => $this->id,
            'fullname' => $this->fullname,
            'email' => $this->email,
            'role' => $this->role ?? null,
            'type' => $this->type
        ];

        $permissions = $this->permissions->pluck('name')->toArray();

        $formattedPermissions = array_fill_keys($permissions, true);

        return array_merge($data, $formattedPermissions);
    }
}

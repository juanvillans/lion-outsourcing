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
    public function toArray(Request $request)
    {

        $permissionsObject = [];
        foreach ($this->permissions as $permission) {
            $permissionsObject[$permission['name']] = true;
        }

        $data = [
            'id' => $this->id,
            'fullname' => $this->fullname,
            'email' => $this->email,
            'role' => $this->role ?? null,
            'type' => $this->type,
            'email_verified_at' => $this->email_verified_at,
            'permissions' => (object) $permissionsObject
        ];

        return $data;
    }
}

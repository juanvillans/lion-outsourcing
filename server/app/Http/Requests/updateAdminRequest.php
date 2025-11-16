<?php

namespace App\Http\Requests;

use App\Enums\UserTypeEnum;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class updateAdminRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fullname' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->route('admin')),
            ],
            'role' => ['nullable', 'string', 'max:100'],
            'type' => [
                'sometimes',
                new Enum(UserTypeEnum::class),
                Rule::in([UserTypeEnum::Administrador->value]),
            ],
            'permission_names' => ['nullable', 'array'],
            'permission_names.*' => ['string', 'exists:permissions,name'],
        ];
    }

    public function messages(): array
    {
        return [
            'fullname.string' => 'El nombre completo debe ser una cadena de texto.',
            'fullname.max' => 'El nombre completo no puede exceder los 255 caracteres.',
            'email.email' => 'El correo electrónico debe ser válido.',
            'email.max' => 'El correo electrónico no puede exceder los 255 caracteres.',
            'email.unique' => 'El correo electrónico ya está registrado.',
            'type.in' => 'El tipo de usuario debe ser Administrador.',
            'permission_names.*.exists' => 'Uno o más nombres de permisos no son válidos.',
        ];
    }
}

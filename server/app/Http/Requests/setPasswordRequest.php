<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class setPasswordRequest extends FormRequest
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
            'token' => 'required|string',
            'password' => [
                'required',
                'string',
                'same:confirm_password',
                'min:6'
            ],
            'confirm_password' => 'required|string',
        ];
    }


    public function messages(): array
    {
        return [
            'token.required' => 'El token es obligatorio.',
            'token.string' => 'El token debe ser una cadena de texto válida.',

            'password.required' => 'La contraseña es obligatoria.',
            'password.string' => 'La contraseña debe ser una cadena de texto válida.',
            'password.same' => 'La contraseña y la confirmación no coinciden.',
            'password.min' => 'La contraseña debe tener al menos :min caracteres.',

            'confirm_password.required' => 'La confirmación de contraseña es obligatoria.',
            'confirm_password.string' => 'La confirmación de contraseña debe ser una cadena de texto válida.',
        ];
    }
}

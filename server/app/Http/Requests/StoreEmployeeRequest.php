<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Cambia según tu lógica de autorización
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255', 'unique:employee_requests,email'],
            'fullname' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string', 'min:8'],
            'phone_number' => ['required', 'string', 'max:20'],
            'industry_id' => ['required', 'exists:industries,id'],
            'area_id' => ['required', 'exists:areas,id'],
            'academic_title' => ['nullable', 'string', 'max:255'],
            'english_level' => ['required', Rule::in(['none', 'beginner', 'intermediate', 'advanced'])],
            'linkedin_url' => ['nullable', 'url', 'max:500'],
            'website_url' => ['nullable', 'url', 'max:500'],
            'localization' => ['required', 'string', 'max:255'],
            'desired_monthly_income' => ['required', 'integer', 'min:0'],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120'],
            'skills' => ['required', 'array'],
            'new_skills' => ['nullable', 'array'],
            'new_skills.*' => ['string', 'max:100'],
            'years_of_experience' => ['string', 'required']
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Debe ser un correo electrónico válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'fullname.required' => 'El nombre completo es obligatorio.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'phone_number.required' => 'El número de teléfono es obligatorio.',
            'industry_id.required' => 'La industria es obligatoria.',
            'industry_id.exists' => 'La industria seleccionada no es válida.',
            'area_id.required' => 'El área es obligatoria.',
            'area_id.exists' => 'El área seleccionada no es válida.',
            'english_level.required' => 'El nivel de inglés es obligatorio.',
            'english_level.in' => 'El nivel de inglés seleccionado no es válido.',
            'localization.required' => 'La localización es obligatoria.',
            'desired_monthly_income.required' => 'El ingreso mensual deseado es obligatorio.',
            'desired_monthly_income.integer' => 'El ingreso mensual debe ser un número.',
            'desired_monthly_income.min' => 'El ingreso mensual no puede ser negativo.',
            'cv.required' => 'El CV es obligatorio.',
            'cv.file' => 'El CV debe ser un archivo.',
            'cv.mimes' => 'El CV debe ser un archivo PDF, DOC o DOCX.',
            'cv.max' => 'El CV no debe superar los 10MB.',
            'photo.image' => 'La foto debe ser una imagen.',
            'photo.mimes' => 'La foto debe ser JPG, PNG, JPEG o GIF.',
            'photo.max' => 'La foto no debe superar los 5MB.',
            'skills.required' => 'Debe seleccionar al menos una habilidad.',
            'skills.array' => 'Las habilidades deben ser un array.',
            'new_skills.array' => 'Las nuevas habilidades deben ser un array.',
            'new_skills.*.string' => 'Cada nueva habilidad debe ser texto.',
            'new_skills.*.max' => 'Cada nueva habilidad no debe superar los 100 caracteres.',
            'years_of_experience.required' => 'Debe seleccionar al menos un intervalo de experiencia.',

        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'email' => 'correo electrónico',
            'fullname' => 'nombre completo',
            'password' => 'contraseña',
            'phone_number' => 'número de teléfono',
            'industry_id' => 'industria',
            'area_id' => 'área',
            'english_level' => 'nivel de inglés',
            'linkedin_url' => 'enlace de LinkedIn',
            'website_url' => 'sitio web',
            'localization' => 'localización',
            'desired_monthly_income' => 'ingreso mensual deseado',
            'cv' => 'CV',
            'photo' => 'foto',
            'skills' => 'habilidades',
            'new_skills' => 'nuevas habilidades',
            'years_of_experience' => 'Años de experiencia',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Si new_skills viene como string, convertir a array
        if ($this->has('new_skills') && is_string($this->new_skills)) {
            $this->merge([
                'new_skills' => json_decode($this->new_skills, true) ?? [],
            ]);
        }

        // Si skills viene como string, convertir a array
        if ($this->has('skills') && is_string($this->skills)) {
            $this->merge([
                'skills' => json_decode($this->skills, true) ?? [],
            ]);
        }
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (empty($this->skills) && empty($this->new_skills)) {
                $validator->errors()->add(
                    'skills',
                    'Debe proporcionar al menos una habilidad existente o nueva.'
                );
            }

            if ($this->has('desired_monthly_income') && $this->desired_monthly_income > 1000000) {
                $validator->errors()->add(
                    'desired_monthly_income',
                    'El ingreso mensual deseado parece excesivo.'
                );
            }
        });
    }
}

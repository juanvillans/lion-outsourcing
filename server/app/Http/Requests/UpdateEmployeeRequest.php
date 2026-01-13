<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
        // Obtener el ID del empleado que se está actualizando (si existe en la ruta)
        $employeeId = $this->route('employee') ? $this->route('employee')->id : null;

        return [
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('employees', 'email')->ignore($employeeId)
            ],
            'fullname' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20'],
            'industry_id' => ['nullable', 'exists:industries,id'],
            'area_id' => ['nullable', 'exists:areas,id'],
            'academic_title' => ['nullable', 'string', 'max:255'],
            'english_level' => ['required', Rule::in(['none', 'beginner', 'intermediate', 'advanced'])],
            'linkedin_url' => ['nullable', 'url', 'max:500'],
            'website_url' => ['nullable', 'url', 'max:500'],
            'localization' => ['required', 'string', 'max:255'],
            'years_of_experience' => ['required', 'string', 'max:50'],
            'desired_monthly_income' => ['required', 'integer', 'min:0'],
            'skills' => ['required', 'array'],
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
            'email.unique' => 'Este correo electrónico ya está registrado por otro empleado.',
            'fullname.required' => 'El nombre completo es obligatorio.',
            'phone_number.required' => 'El número de teléfono es obligatorio.',
            'industry_id.exists' => 'La industria seleccionada no es válida.',
            'area_id.exists' => 'El área seleccionada no es válida.',
            'english_level.required' => 'El nivel de inglés es obligatorio.',
            'english_level.in' => 'El nivel de inglés seleccionado no es válido.',
            'linkedin_url.url' => 'La URL de LinkedIn debe ser una URL válida.',
            'website_url.url' => 'La URL del sitio web debe ser una URL válida.',
            'localization.required' => 'La localización es obligatoria.',
            'years_of_experience.required' => 'Los años de experiencia son obligatorios.',
            'years_of_experience.max' => 'Los años de experiencia no deben superar los 50 caracteres.',
            'desired_monthly_income.required' => 'El ingreso mensual deseado es obligatorio.',
            'desired_monthly_income.integer' => 'El ingreso mensual debe ser un número entero.',
            'desired_monthly_income.min' => 'El ingreso mensual no puede ser negativo.',
            'cv.file' => 'El CV debe ser un archivo.',
            'cv.mimes' => 'El CV debe ser un archivo PDF, DOC o DOCX.',
            'cv.max' => 'El CV no debe superar los 10MB.',
            'photo.image' => 'La foto debe ser una imagen.',
            'photo.mimes' => 'La foto debe ser JPG, PNG, JPEG o GIF.',
            'photo.max' => 'La foto no debe superar los 5MB.',
            'skills.required' => 'Debe seleccionar al menos una habilidad.',
            'skills.array' => 'Las habilidades deben ser un array.',
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
            'phone_number' => 'número de teléfono',
            'industry_id' => 'industria',
            'area_id' => 'área',
            'academic_title' => 'título académico',
            'english_level' => 'nivel de inglés',
            'linkedin_url' => 'enlace de LinkedIn',
            'website_url' => 'sitio web',
            'localization' => 'localización',
            'years_of_experience' => 'años de experiencia',
            'desired_monthly_income' => 'ingreso mensual deseado',
            'cv' => 'CV',
            'photo' => 'foto',
            'skills' => 'habilidades',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        Log::info(['data' => $this->email]);

        // Si skills viene como string, convertir a array
        if ($this->has('skills') && is_string($this->skills)) {
            $this->merge([
                'skills' => json_decode($this->skills, true) ?? [],
            ]);
        }
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {

            // Validar límite razonable de ingreso mensual
            if ($this->has('desired_monthly_income') && $this->desired_monthly_income > 1000000) {
                $validator->errors()->add(
                    'desired_monthly_income',
                    'El ingreso mensual deseado parece excesivo.'
                );
            }
        });
    }
}

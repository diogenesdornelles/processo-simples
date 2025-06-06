<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:128',
            'description' => 'nullable|string',
            'event_id' => 'required|exists:events,id',
        ];

        if ($this->isMethod('POST')) {
            $rules['file'] = 'required|file|max:10240'; // máx 10MB
        }
        
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['file'] = 'nullable|file|max:10240';
        }

        return $rules;
    }
    public function messages(): array
    {
        return [
            'name.required' => 'O nome do documento é obrigatório.',
            'name.string' => 'O nome do documento deve ser uma string.',
            'name.max' => 'O nome do documento não pode ter mais de 128 caracteres.',
            'description.string' => 'A descrição do documento deve ser uma string.',
            'event_id.required' => 'O evento relacionado é obrigatório.',
            'event_id.exists' => 'O evento selecionado não existe.',
            'file.required' => 'O arquivo do documento é obrigatório.',
            'file.file' => 'O arquivo deve ser um arquivo válido.',
            'file.max' => 'O arquivo não pode ter mais de 10MB.',
        ];
    }
}
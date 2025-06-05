<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user') ? $this->route('user')->id : null;
        
        return [
            'name' => 'required|string|max:128',
            'password' => $this->isMethod('POST') ? 'required|string|min:6' : 'nullable|string|min:6',
            'role' => 'in:Comum,Admin',
            'email' => [
                'required',
                'email',
                'max:128',
                Rule::unique('user', 'email')->ignore($userId)
            ],
            'cpf' => [
                'required',
                'string',
                'size:11',
                Rule::unique('user', 'cpf')->ignore($userId)
            ],
            'sigle' => [
                'required',
                'string',
                'max:5',
                Rule::unique('user', 'sigle')->ignore($userId)
            ],
            'active' => 'boolean',
        ];
    }

        public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório.',
            'password.required' => 'A senha é obrigatória.',
            'role.in' => 'O papel deve ser Comum ou Admin.',
            'email.required' => 'O email é obrigatório.',
            'email.email' => 'O email deve ser um endereço de email válido.',
            'email.unique' => 'Este email já está em uso.',
            'cpf.required' => 'O CPF é obrigatório.',
            'cpf.size' => 'O CPF deve ter exatamente 11 caracteres.',
            'cpf.unique' => 'Este CPF já está em uso.',
            'sigle.required' => 'A sigla é obrigatória.',
            'sigle.max' => 'A sigla não pode ter mais de 5 caracteres.',
            'sigle.unique' => 'Esta sigla já está em uso.',
            'active.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
        ];
    }
}


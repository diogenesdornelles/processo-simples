<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'user_id'     => ['required', 'integer', 'exists:users,id'],
            'owner'       => ['required','string'],
            'description' => ['nullable','string'],
            'status'      => ['required','in:Aberto,Em Andamento,Pendente,Concluído,Cancelado'],
            'priority'    => ['nullable','in:Alta,Média,Baixa'],
            'term'        => ['required','date'],
            'number'      => ['prohibited'],
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['active'] = ['sometimes','boolean'];
        }

        return $rules;
    }
    public function messages(): array
    {
        return [
            'user_id.required' => 'O campo usuário é obrigatório.',
            'owner.required' => 'O campo proprietário é obrigatório.',
            'status.in' => 'O status deve ser um dos seguintes: Aberto, Em Andamento, Pendente, Concluído, Cancelado.',
            'priority.in' => 'A prioridade deve ser uma das seguintes: Alta, Média, Baixa.',
            'term.required' => 'O campo prazo é obrigatório.',
        ];
    }
}
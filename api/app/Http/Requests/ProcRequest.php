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
        return [
            'user_id' => 'required|exists:user,id',
            'owner' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'in:Aberto,Em Andamento,Pendente,Concluído,Cancelado',
            'priority' => 'nullable|in:Alta,Média,Baixa',
            'term' => 'required|date',
            'active' => 'boolean',
        ];
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
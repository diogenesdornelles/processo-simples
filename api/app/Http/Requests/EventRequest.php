<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|in:Criação do processo,Juntada de documento,Baixa',
            'user_id' => 'required|exists:users,id',
            'proc_id' => 'required|exists:procs,id',
            'active' => 'boolean',
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'O nome do evento é obrigatório.',
            'name.in' => 'O nome do evento deve ser um dos seguintes: Criação do processo, Juntada de documento ou Baixa',
            'user_id.required' => 'O campo usuário é obrigatório.',
            'user_id.exists' => 'O usuário selecionado não existe.',
            'proc_id.required' => 'O campo processo é obrigatório.',
            'proc_id.exists' => 'O processo selecionado não existe.',
            'active.boolean' => 'O campo ativo deve ser verdadeiro ou falso.',
        ];
    }
}
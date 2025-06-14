<?php

namespace App\Http\Controllers;

use App\Models\Proc;
use App\Models\User;
use App\Http\Requests\ProcRequest;
use Illuminate\Http\Request;

class ProcsController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Proc::class);
        return Proc::with(['user', 'events'])
                   ->where('active', true)
                   ->get();
    }

    public function store(ProcRequest $request)
    {
        $this->authorize('create', Proc::class);
        $data = $request->validated();
        
        $data['number'] = $this->generateProcNumber();
        
        $proc = Proc::create($data);
        return response()->json($proc->load('user'), 201);
    }

    private function generateProcNumber(): string
    {
        do {
            // Gerar número de 20 dígitos usando uma abordagem diferente
            $number = '';
            for ($i = 0; $i < 20; $i++) {
                $number .= mt_rand(0, 9);
            }
            // Garantir que não comece com 0
            if ($number[0] === '0') {
                $number[0] = mt_rand(1, 9);
            }
        } while (Proc::where('number', $number)->exists());
        
        return $number;
    }

    public function show(Proc $proc)
    {
        $this->authorize('view', $proc);
        return $proc->load(['user', 'events.docs']);
    }

    public function update(ProcRequest $request, Proc $proc)
    {
        $this->authorize('update', $proc);   
        $data = $request->validated();
        $proc->update($data);
        return response()->json($proc->load('user'));
    }

    public function destroy(Proc $proc)
    {
        $this->authorize('delete', $proc);
        $proc->delete();
        return response()->json(null, 204);
    }
}
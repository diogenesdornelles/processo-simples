<?php

namespace App\Http\Controllers;

use App\Models\Proc;
use App\Http\Requests\ProcRequest;
use Illuminate\Http\Request;

class ProcsController extends Controller
{
    public function index()
    {
        return Proc::with(['user', 'events'])
                   ->where('active', true)
                   ->get();
    }

    public function store(ProcRequest $request)
    {
        $data = $request->validated();
        
        // Gerar número sequencial
        $lastNumber = Proc::max('number') ?? '9999999999999999999';
        $data['number'] = (string)((int)$lastNumber + 1);
        
        $proc = Proc::create($data);
        return response()->json($proc->load('user'), 201);
    }

    public function show(Proc $proc)
    {
        return $proc->load(['user', 'events.documents']);
    }

    public function update(ProcRequest $request, Proc $proc)
    {
        $data = $request->validated();
        $proc->update($data);
        return response()->json($proc->load('user'));
    }

    public function destroy(Proc $proc)
    {
        $proc->delete();
        return response()->json(null, 204);
    }
}
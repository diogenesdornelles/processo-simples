<?php

namespace App\Http\Controllers;

use App\Models\Doc;
use App\Http\Requests\DocRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocsController extends Controller
{
    public function index()
    {
        return Doc::with('event')->get();
    }

    public function store(DocRequest $request)
    {
        $data = $request->validated();
        
        // Upload do arquivo usando Storage
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            // Gerar nome único com hash
            $extension = $file->getClientOriginalExtension();
            $fileName = time() . '_' . uniqid() . '.' . $extension;
            
            // Salvar no storage/app/public/docs
            $path = $file->storeAs('docs', $fileName, 'public');
            
            // Gerar URL correta
            $data['uri'] = asset('storage/' . $path);
            $data['ext'] = $extension;
        }
        
        // Remover 'file' dos dados
        unset($data['file']);
        
        $doc = Doc::create($data);
        return response()->json($doc->load('event'), 201);
    }

    public function show(Doc $doc)
    {
        return $doc->load('event');
    }

    public function update(DocRequest $request, Doc $doc)
    {
        $data = $request->validated();
        
        // Se enviou novo arquivo, substitui o anterior
        if ($request->hasFile('file')) {
            // Remove arquivo anterior
            if ($doc->uri) {
                $oldPath = str_replace(asset('storage/'), '', $doc->uri);
                Storage::disk('public')->delete($oldPath);
            }
            
            // Upload do novo arquivo
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $fileName = time() . '_' . uniqid() . '.' . $extension;
            
            $path = $file->storeAs('docs', $fileName, 'public');
            
            $data['uri'] = asset('storage/' . $path);
            $data['ext'] = $extension;
        }
        
        unset($data['file']);
        
        $doc->update($data);
        return response()->json($doc->load('event'));
    }

    public function destroy(Doc $doc)
    {
        // Remove arquivo do storage
        if ($doc->uri) {
            $path = str_replace(asset('storage/'), '', $doc->uri);
            Storage::disk('public')->delete($path);
        }
        
        $doc->delete();
        return response()->json(['message' => 'Documento removido com sucesso']);
    }
}
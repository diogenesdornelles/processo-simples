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
        
        // Upload do arquivo
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            // Gerar nome único para o arquivo
            $fileName = time() . '_' . $file->getClientOriginalName();
            
            // Salvar na pasta public/uploads
            $filePath = $file->move(public_path('uploads'), $fileName);
            
            // Gerar URI pública
            $data['uri'] = url('uploads/' . $fileName);
            
            // Obter extensão
            $data['ext'] = $file->getClientOriginalExtension();
        }
        
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
            // Remove arquivo anterior se existir
            $oldFileName = basename($doc->uri);
            $oldFilePath = public_path('uploads/' . $oldFileName);
            if (file_exists($oldFilePath)) {
                unlink($oldFilePath);
            }
            
            // Upload do novo arquivo
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $fileName);
            
            $data['uri'] = url('uploads/' . $fileName);
            $data['ext'] = $file->getClientOriginalExtension();
        }
        
        $doc->update($data);
        return response()->json($doc->load('event'));
    }

    public function destroy(Doc $doc)
    {
        // Remove arquivo do disco
        $fileName = basename($doc->uri);
        $filePath = public_path('uploads/' . $fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        
        $doc->delete();
        return response()->json(null, 204);
    }
}
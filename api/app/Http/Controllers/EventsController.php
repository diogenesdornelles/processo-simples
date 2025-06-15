<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\EventRequest;
use Illuminate\Http\Request;

class EventsController extends Controller
{
    public function index()
    {
        return Event::with(['user', 'proc', 'docs'])
                    ->where('active', true)
                    ->get();
    }

    public function store(EventRequest $request)
    {
        $data = $request->validated();
        $event = Event::create($data);
        if (!empty($data['name']) && $data['name'] === 'Criação do processo') {
            $event->proc()->update(['active' => true]);
        }
        return response()->json($event->load(['user', 'proc']), 201);
    }

    public function show(Event $event)
    {
        return $event->load(['user', 'proc', 'docs']);
    }

    public function update(EventRequest $request, Event $event)
    {
        $data = $request->validated();
        $event->update($data);
        return response()->json($event->load(['user', 'proc']));
    }

   public function destroy(Event $event)
    {
        $event->update(['active' => false]);
        return response()->json(['message' => 'Evento desativado com sucesso']);
    }
}
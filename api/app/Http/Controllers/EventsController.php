<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\EventRequest;
use Illuminate\Http\Request;

class EventsController extends Controller
{
    public function index()
    {
        return Event::with(['user', 'processo', 'documents'])
                    ->where('active', true)
                    ->get();
    }

    public function store(EventRequest $request)
    {
        $data = $request->validated();
        $event = Event::create($data);
        return response()->json($event->load(['user', 'processo']), 201);
    }

    public function show(Event $event)
    {
        return $event->load(['user', 'processo', 'documents']);
    }

    public function update(EventRequest $request, Event $event)
    {
        $data = $request->validated();
        $event->update($data);
        return response()->json($event->load(['user', 'processo']));
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }
}
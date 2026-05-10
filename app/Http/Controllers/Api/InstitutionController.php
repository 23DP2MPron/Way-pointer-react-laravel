<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Institution::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type'))    $query->where('type', $request->type);
        if ($request->filled('country')) $query->where('country', $request->country);
        if ($request->filled('city'))    $query->where('city', $request->city);

        $sortBy  = in_array($request->sort_by, ['rating', 'name', 'created_at']) ? $request->sort_by : 'created_at';
        $sortDir = $request->sort_dir === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        return response()->json($query->paginate($request->get('per_page', 12)));
    }

    public function show(Institution $institution): JsonResponse
    {
        $institution->load(['reviews.user']);
        return response()->json($institution);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type'        => ['required', 'in:hotel,restaurant,cafe,bar,shop,other'],
            'address'     => ['required', 'string'],
            'city'        => ['required', 'string'],
            'country'     => ['required', 'string'],
            'phone'       => ['nullable', 'string'],
            'website'     => ['nullable', 'url'],
            'latitude'    => ['nullable', 'numeric'],
            'longitude'   => ['nullable', 'numeric'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('institutions', 'public');
        }

        return response()->json(Institution::create($data), 201);
    }

    public function update(Request $request, Institution $institution): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type'        => ['sometimes', 'in:hotel,restaurant,cafe,bar,shop,other'],
            'address'     => ['sometimes', 'string'],
            'city'        => ['sometimes', 'string'],
            'country'     => ['sometimes', 'string'],
            'phone'       => ['nullable', 'string'],
            'website'     => ['nullable', 'url'],
            'latitude'    => ['nullable', 'numeric'],
            'longitude'   => ['nullable', 'numeric'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('institutions', 'public');
        }

        $institution->update($data);
        return response()->json($institution);
    }

    public function destroy(Institution $institution): JsonResponse
    {
        $institution->delete();
        return response()->json(['message' => 'Institution deleted']);
    }
}

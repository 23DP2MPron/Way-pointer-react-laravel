<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Route;
use App\Models\RoutePoint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Route::with('user')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        if (!auth()->check() || auth()->user()->role !== 'admin') {
            if (auth()->check()) {
                $query->where(function ($q) {
                    $q->where('is_published', true)
                      ->orWhere('user_id', auth()->id());
                });
            } else {
                $query->where('is_published', true);
            }
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $query->orderByDesc('created_at');

        $perPage = $request->get('per_page', 12);

        return response()->json($query->paginate($perPage));
    }

    public function myRoutes(Request $request): JsonResponse
    {
        $routes = Route::with(['points.target'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(12);

        return response()->json($routes);
    }

    public function show(Route $route): JsonResponse
    {
        if (!$route->is_published && auth()->id() !== $route->user_id && auth()->user()?->role !== 'admin') {
            abort(403);
        }

        $route->load(['user', 'points.target', 'reviews.user']);

        return response()->json($route);
    }

    public function store(Request $request): JsonResponse
    {
        // Валидируем основные поля маршрута
        $data = $request->validate([
            'title'         => ['required', 'string', 'max:255'],
            'description'   => ['nullable', 'string'],
            'country'       => ['nullable', 'string'],
            'city'          => ['nullable', 'string'],
            'duration_days' => ['nullable', 'integer', 'min:1'],
            'is_published'  => ['boolean'],
            'points'        => ['nullable', 'array'],
        ]);

        // Берём точки напрямую из запроса (до validate, чтобы не потерять)
        $rawPoints = $request->input('points', []);

        // Валидируем точки отдельно — только если они есть
        if (!empty($rawPoints)) {
            $request->validate([
                'points.*.target_type' => ['required', 'string', 'in:place,institution'],
                'points.*.target_id'   => ['required', 'integer', 'min:1'],
                'points.*.notes'       => ['nullable', 'string'],
            ]);
        }

        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('routes', 'public');
        }

        // Убираем points из $data — это не поле таблицы routes
        unset($data['points']);

        $route = Route::create($data);

        // Сохраняем точки маршрута
        foreach ($rawPoints as $index => $point) {
            $route->points()->create([
                'target_type' => $point['target_type'],
                'target_id'   => (int) $point['target_id'],
                'order_index' => $index,
                'notes'       => $point['notes'] ?? null,
            ]);
        }

        return response()->json($route->load('points.target'), 201);
    }

    public function update(Request $request, Route $route): JsonResponse
    {
        if ($request->user()->id !== $route->user_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'title'         => ['sometimes', 'string', 'max:255'],
            'description'   => ['nullable', 'string'],
            'country'       => ['nullable', 'string'],
            'city'          => ['nullable', 'string'],
            'duration_days' => ['nullable', 'integer'],
            'is_published'  => ['boolean'],
            'points'        => ['nullable', 'array'],
        ]);

        // Берём точки напрямую из запроса
        $rawPoints = $request->input('points');

        // Валидируем точки отдельно — только если они есть
        if (!empty($rawPoints)) {
            $request->validate([
                'points.*.target_type' => ['required', 'string', 'in:place,institution'],
                'points.*.target_id'   => ['required', 'integer', 'min:1'],
                'points.*.notes'       => ['nullable', 'string'],
            ]);
        }

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('routes', 'public');
        }

        unset($data['points']);
        $route->update($data);

        // Обновляем точки только если поле points было передано в запросе
        if ($rawPoints !== null) {
            $route->points()->delete();
            foreach ($rawPoints as $index => $point) {
                $route->points()->create([
                    'target_type' => $point['target_type'],
                    'target_id'   => (int) $point['target_id'],
                    'order_index' => $index,
                    'notes'       => $point['notes'] ?? null,
                ]);
            }
        }

        return response()->json($route->load('points.target'));
    }

    public function destroy(Request $request, Route $route): JsonResponse
    {
        if ($request->user()->id !== $route->user_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $route->delete();
        return response()->json(['message' => 'Route deleted']);
    }

    public function addReview(Request $request, Route $route): JsonResponse
    {
        if (!$route->is_published) {
            abort(403, 'Cannot review unpublished route');
        }

        if ($request->user()->id === $route->user_id) {
            abort(403, 'Cannot review your own route');
        }

        $data = $request->validate([
            'rating'  => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        $existingReview = $route->reviews()
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            $existingReview->update($data);
            return response()->json($existingReview->load('user'));
        }

        $review = $route->reviews()->create([
            'user_id' => $request->user()->id,
            'rating'  => $data['rating'],
            'comment' => $data['comment'],
        ]);

        return response()->json($review->load('user'), 201);
    }

    public function getReviews(Route $route): JsonResponse
    {
        if (!$route->is_published && auth()->id() !== $route->user_id && auth()->user()?->role !== 'admin') {
            abort(403);
        }

        $reviews = $route->reviews()
            ->with('user')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }
}

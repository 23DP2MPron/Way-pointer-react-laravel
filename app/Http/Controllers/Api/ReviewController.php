<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Place;
use App\Models\Institution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Review::with(['user', 'reviewable'])->latest();

        if ($request->filled('target_type') && $request->filled('target_id')) {
            $query->where('reviewable_type', $request->target_type)
                  ->where('reviewable_id', $request->target_id);
        }

        return response()->json($query->paginate(10));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'target_type' => ['required', 'in:place,institution'],
            'target_id'   => ['required', 'integer'],
            'rating'      => ['required', 'integer', 'min:1', 'max:5'],
            'comment'     => ['nullable', 'string', 'max:1000'],
        ]);

        $reviewData = [
            'user_id' => $request->user()->id,
            'reviewable_type' => $data['target_type'],
            'reviewable_id' => $data['target_id'],
            'rating' => $data['rating'],
            'comment' => $data['comment']
        ];

        $review = Review::updateOrCreate(
            [
                'user_id' => $reviewData['user_id'], 
                'reviewable_type' => $reviewData['reviewable_type'], 
                'reviewable_id' => $reviewData['reviewable_id']
            ],
            [
                'rating' => $reviewData['rating'], 
                'comment' => $reviewData['comment']
            ]
        );

        // Recalculate parent rating
        if ($data['target_type'] === 'place') {
            $place = Place::find($data['target_id']);
            if ($place && method_exists($place, 'updateRating')) {
                $place->updateRating();
            }
        } else {
            $institution = Institution::find($data['target_id']);
            if ($institution && method_exists($institution, 'updateRating')) {
                $institution->updateRating();
            }
        }

        return response()->json($review->load('user'), 201);
    }

    public function destroy(Review $review): JsonResponse
    {
        $user = auth()->user();
        if ($user->id !== $review->user_id && $user->role !== 'admin') {
            abort(403);
        }

        $targetType = $review->reviewable_type;
        $targetId   = $review->reviewable_id;
        $review->delete();

        if ($targetType === 'place') {
            $place = Place::find($targetId);
            if ($place && method_exists($place, 'updateRating')) {
                $place->updateRating();
            }
        } else {
            $institution = Institution::find($targetId);
            if ($institution && method_exists($institution, 'updateRating')) {
                $institution->updateRating();
            }
        }

        return response()->json(['message' => 'Review deleted']);
    }
}
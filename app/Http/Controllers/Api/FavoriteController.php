<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $favorites = Favorite::where('user_id', $request->user()->id)->get();

        $favorites->each(function ($fav) {
            $fav->target_detail = $fav->target_detail;
        });

        return response()->json($favorites);
    }

    public function toggle(Request $request): JsonResponse
    {
        $data = $request->validate([
            'target_type' => ['required', 'in:place,institution,route'],
            'target_id'   => ['required', 'integer'],
        ]);

        $existing = Favorite::where('user_id', $request->user()->id)
            ->where('target_type', $data['target_type'])
            ->where('target_id', $data['target_id'])
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['favorited' => false]);
        }

        Favorite::create(['user_id' => $request->user()->id, ...$data]);
        return response()->json(['favorited' => true]);
    }

    public function check(Request $request): JsonResponse
    {
        $data = $request->validate([
            'target_type' => ['required', 'string'],
            'target_id'   => ['required', 'integer'],
        ]);

        $favorited = Favorite::where('user_id', $request->user()->id)
            ->where('target_type', $data['target_type'])
            ->where('target_id', $data['target_id'])
            ->exists();

        return response()->json(['favorited' => $favorited]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CardController extends Controller
{
    private $file = 'cards.json';

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $cards = Storage::exists($this->file)
            ? json_decode(Storage::get($this->file), true)
            : [];
        return response()->json($cards);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'card_number'  => 'required|digits:16',
            'expiry_year'  => 'required|digits:2',
            'expiry_month' => 'required|digits:2',
            'cvv'          => 'required|digits:3',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $cards = Storage::exists($this->file)
            ? json_decode(Storage::get($this->file), true)
            : [];

        $card = [
            'id'           => time(),
            'card_number'  => $request->input('card_number'),
            'expiry_year'  => $request->input('expiry_year'),
            'expiry_month' => $request->input('expiry_month'),
            'cvv'          => $request->input('cvv'),
        ];

        $cards[] = $card;
        Storage::put($this->file, json_encode($cards, JSON_PRETTY_PRINT));

        return response()->json($card, 201);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use Illuminate\Http\Request;

class IndustryController extends Controller
{
    public function getIndustries()
    {
        $industries = Industry::with('areas')->get();

        return response()->json(['data' => $industries]);
    }
}

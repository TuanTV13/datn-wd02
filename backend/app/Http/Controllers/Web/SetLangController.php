<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class SetLangController extends Controller
{
    public function setLanguage($lang)
    {
        // Kiểm tra xem ngôn ngữ có hợp lệ không
        $availableLanguages = ['vi', 'en'];
        
        if (in_array($lang, $availableLanguages)) {
            // Lưu ngôn ngữ vào session
            Session::put('applocale', $lang);
        }

        // Điều hướng về trang trước đó
        return redirect()->back();
    }
}

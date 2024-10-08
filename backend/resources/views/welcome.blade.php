<!DOCTYPE html>
<html lang="{{ session('applocale') }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi-Language Example</title>
</head>
<body>
    <h1>{{ __('validation.accepted') }}</h1>

    <form action="{{ route('set.language', '') }}" method="GET">
        <select name="lang" onchange="this.form.submit()">
            <option value="vi" {{ session('applocale') == 'vi' ? 'selected' : '' }}>Tiếng Việt</option>
            <option value="en" {{ session('applocale') == 'en' ? 'selected' : '' }}>English</option>
        </select>
    </form>
</body>
</html>

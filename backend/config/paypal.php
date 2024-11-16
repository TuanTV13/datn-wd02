<?php
return [
    'client_id' => env('PAYPAL_CLIENT_ID', 'AROpFogf7EK_xv1htqwsfZoda97lqdyLCA37p98c3LbMJ-_CBsE0NgwNMWxxUsEknK_u3hKIUqC2bL-D'),
    'secret' => env('PAYPAL_CLIENT_SECRET', 'EOTjscCTq5ajLU5WxhgeA8xU36iu7HXFlEXsUvai86X-3WZ0HwnatusiAvztjQvZSzCiLdnOIvSHli8o'),
    'mode' => env('PAYPAL_MODE', 'sandbox'),
    'settings' => [
        'http.ConnectionTimeOut' => 30,
        'log.logEnabled' => true,
        'log.FileName' => storage_path('logs/paypal.log'),
        'log.LogLevel' => 'FINE'
    ],
];

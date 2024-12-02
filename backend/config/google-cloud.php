<?php
return [
    'project_id' => env('GOOGLE_CLOUD_PROJECT_ID'),
    'bucket'     => env('GOOGLE_CLOUD_STORAGE_BUCKET'),
    'key_file'   => env('GOOGLE_CLOUD_KEY_FILE'), // Đường dẫn tới file JSON tải về
];

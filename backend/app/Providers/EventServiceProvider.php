<?php

namespace App\Providers;

use App\Events\AttendeesNotified;
use App\Events\EventUpdate;
use App\Events\UserForgotPassword;
use App\Events\UserRegisterdSuccess;
use App\Listeners\AttendeesNotifiedListener;
use App\Listeners\EventUpdateNotification;
use App\Listeners\UserForgotPasswordSendCode;
use App\Listeners\UserRegisterdSuccessVerification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        UserRegisterdSuccess::class => [
            UserRegisterdSuccessVerification::class,
        ],

        UserForgotPassword::class => [
            UserForgotPasswordSendCode::class,
        ],

        EventUpdate::class => [
            EventUpdateNotification::class,
        ],
        
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}

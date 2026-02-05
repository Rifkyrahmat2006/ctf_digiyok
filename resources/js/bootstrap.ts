import axios from 'axios';
import Echo from 'laravel-echo';
import io from 'socket.io-client';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

window.io = io;

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: import.meta.env.VITE_WEBSOCKET_URL || window.location.hostname + ':6001',
    transports: ['websocket', 'polling'], // Allow polling fallback
    client: io,
    reconnection: true,
});




/// <reference types="vite/client" />

import { AxiosInstance } from 'axios';

declare global {
    interface Window {
        axios: AxiosInstance;
        Echo: any;
        io: any;
    }

}

#!/bin/sh

(cd api && php artisan serve) & 
(cd web && pnpm dev)
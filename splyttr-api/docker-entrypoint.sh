#!/bin/bash

# Give time for the DB to start
sleep 5

python manage.py migrate                  # Apply database migrations
python manage.py collectstatic --noinput  # Collect static files

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn splyttr.wsgi:application \
    --name splyttr \
    --bind 0.0.0.0:8050 \
    --workers 3 \
    --log-level=info \
    "$@"

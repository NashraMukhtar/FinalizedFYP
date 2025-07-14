#!/usr/bin/env bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Collect static files (optional but recommended)
python manage.py collectstatic --noinput

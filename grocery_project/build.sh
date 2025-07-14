#!/usr/bin/env bash
echo "⏳ Installing requirements..."
pip install -r requirements.txt

echo "⚙️ Running makemigrations..."
python manage.py makemigrations

echo "🚀 Running migrate..."
python manage.py migrate

echo "✅ Done running migrations"

# Collect static files (optional but recommended)
python manage.py collectstatic --noinput

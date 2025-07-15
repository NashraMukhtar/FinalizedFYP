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

echo "from core.models import User; User.objects.create_superuser(username='admin', email='admin@gmail.com', password='admin', role='admin')" | python manage.py shell


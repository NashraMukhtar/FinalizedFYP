# Use official Python image
FROM python:3.12

# Install system packages including Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && apt-get clean

# Set work directory
WORKDIR /app

# Copy project files
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Collect static files (optional if using static)
RUN python manage.py collectstatic --noinput

# Start app with gunicorn
CMD ["gunicorn", "grocery_project.wsgi:application", "--bind", "0.0.0.0:8000"]

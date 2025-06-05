🛒 Grocery Management & Smart Recipe Suggestion Web App

An AI-integrated web application that helps users manage grocery items and get recipe suggestions based on the ingredients they have. Built using **Django REST Framework** and **React with Material-UI**, this app ensures a personalized, intelligent, and seamless grocery management experience.

---

✨ Key Features

- 🔐 **User Authentication** (Token-based using Django REST Framework)
- 📝 **Grocery and Shopping List Management** (Add, edit, delete)
- 🧠 **AI-powered OCR Integration**: Upload images of grocery lists (handwritten or printed) and automatically extract ingredients using Optical Character Recognition
- 🍲 **Recipe Suggestions**: Smartly ranked based on ingredient matches
- 🔁 **Move-to-Grocery Functionality**: Easily transfer items from shopping list to grocery list without duplication
- 🧑‍🍳 **Admin Panel**: Review and approve user-submitted recipes (Saparate panel for Admin)

---

## 🧠 AI Integration

This project integrates OCR to extract grocery items from images of written lists. It uses Python’s `pytesseract` to:
- Recognize text in uploaded images
- Match recognized items with a master ingredient database
- Auto-populate the user's grocery list based on matched items

---

🖼 Demo

[User Dashboard]
![Screenshot (188) - Copy](https://github.com/user-attachments/assets/f2d126bf-ef93-4537-b767-56f83cfdbd30)

[Admin Dashboard]
![Screenshot (197)](https://github.com/user-attachments/assets/be26eb6c-d4b2-4f90-8cee-8f871899790b)

---

🧱 Tech Stack

**Frontend:**
- React
- Material-UI
- Axios

**Backend:**
- Django REST Framework

**AI Integration:**
- OCR using pytesseract

**Database:**
- SQLite (Dev) / PostgreSQL (Production-ready)

---

## 🚀 Setup Instructions

### Backend (Django)
```bash
cd grocery_project
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (Django)
```bash
cd frontend
npm install
npm start
```

👤 Author:
Nashra Mukhtar,
Final Year Project – Lahore College for Women University,
[LinkedIn](https://www.linkedin.com/in/nashra-mukhtar-253565279/)

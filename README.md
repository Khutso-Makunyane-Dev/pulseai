# PulseAI

**Live Demo:** [https://pulseai-vert.vercel.app](https://pulseai-vert.vercel.app)

**Smarter Automation, Real Results.**

PulseAI is a full-stack, AI-powered platform designed to help businesses and individuals automate tasks, analyze data, and generate intelligent insights. By combining modern machine learning models with user-friendly web interfaces, PulseAI empowers users to work smarter, faster, and more efficiently.

The application provides a seamless experience for text analysis, including sentiment detection, risk assessment, and summarization, all within a secure and responsive dashboard.

---

## ✨ Key Features

*   **🤖 AI-Powered Text Analysis:** Submit text for in-depth analysis, including:
    *   **Sentiment Analysis:** Detects the emotional tone (positive, negative, neutral).
    *   **Risk Detection:** Identifies potentially concerning or high-risk language.
    *   **Text Summarization:** Generates concise summaries of longer text inputs.
*   **🔐 Secure User Authentication:** Full signup and login functionality using **JWT (JSON Web Tokens)**. User sessions are persisted securely.
*   **📊 User Dashboard:** A clean, responsive interface where authenticated users can view their analysis history and manage their account.
*   **⚡ Real-time Processing:** FastAPI backend ensures quick response times (<500ms) for analysis requests.
*   **📱 Responsive Design:** Built with Tailwind CSS, the interface works flawlessly on desktops, tablets, and mobile devices.

---

## 🛠️ Technology Stack

This project is a full-stack application built with modern tools and libraries.

### Frontend
*   **Framework:** [React.js](https://reactjs.org/) (with Hooks and Functional Components)
*   **Build Tool:** [Vite](https://vitejs.dev/) for fast development and optimized builds.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) for a utility-first, responsive UI.
*   **State Management & Routing:** React Context API for global auth state, [React Router](https://reactrouter.com/) for navigation.
*   **HTTP Client:** [Axios](https://axios-http.com/) configured with interceptors for automatic JWT attachment and request logging.

### Backend
*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python) for high-performance API development.
*   **Authentication:** JWT-based authentication with password hashing (bcrypt).
*   **Database ORM:** [SQLAlchemy](https://www.sqlalchemy.org/) for database interactions.
*   **Data Validation:** [Pydantic](https://docs.pydantic.dev/) for request/response model validation.
*   **Database:** PostgreSQL (production) / SQLite (development).
*   **CORS:** Configured to securely accept requests from multiple frontend origins (localhost and Vercel preview URLs).

### AI / Machine Learning
*   **Core Libraries:** [Scikit-learn](https://scikit-learn.org/), [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/) for data processing and model logic.
*   **NLP Models:** [Hugging Face Transformers](https://huggingface.co/docs/transformers/index) for advanced Natural Language Processing tasks (sentiment, summarization).
*   **Model Integration:** Custom Python logic to preprocess input and serve predictions via FastAPI endpoints.

### DevOps & Deployment
*   **Version Control:** Git & GitHub.
*   **Frontend Hosting:** [Vercel](https://vercel.com/) with automatic CI/CD from the main branch.
*   **Backend Hosting:** [Render](https://render.com/) with environment variable configuration.
*   **Environment Management:** Uses `VITE_API_BASE` environment variable to switch between local and production backends.

## 🌍 Deployment

The application is configured for easy deployment.

*   **Frontend (Vercel):** Connect your GitHub repository to Vercel. Add the environment variable `VITE_API_BASE` with your production backend URL (e.g., `https://your-backend.onrender.com`).
*   **Backend (Render):** Create a new Web Service on Render connected to your repository. Set the `ENVIRONMENT` variable to `production` and configure your database and secret key.

---

## 🧠 Challenges Solved

During development, several key challenges were addressed:
*   **CORS Configuration:** Configured the FastAPI backend to accept requests from multiple dynamic Vercel preview URLs (e.g., `pulseai-git-main-...vercel.app`) and localhost, ensuring smooth development and deployment workflows.
*   **Unified API Client:** Consolidated multiple Axios instances into a single, pre-configured client with request/response interceptors to automatically handle JWT tokens and logging.
*   **Authentication Flow:** Fixed a critical bug where the `/auth/me` endpoint was failing due to an incorrect import in the `AuthContext`, ensuring user sessions are properly validated on app load.
*   **Environment-Based Configuration:** Implemented a robust system using `.env` files and Vite's `import.meta.env` to seamlessly switch between local and production API URLs without hardcoding.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](link-to-issues).

---

## 📬 Contact

**Khutso Makunyane**  
Junior Software Developer | junior AL/ML Developer | UX UI Designer
LinkedIn Profil: https://www.linkedin.com/in/khutso-makunyane-5353b1329
GitHub Profile URL: https://github.com/Khutso-Makunyane-Dev
khutsomakunyane1@gmail.com



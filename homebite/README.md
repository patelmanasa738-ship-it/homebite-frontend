# HomeBite – A Social Marketplace for Homemade Food

> **"Taste the Love of Home Cooking"**  
> Discover fresh, homemade meals crafted with love by cooks in your neighborhood.

HomeBite is a full-stack social marketplace web application designed as an academic capstone project. It bridges neighborhood home cooks with local food lovers seeking authentic, preservative-free, slow-cooked meals.

---

## 1. Technology Stack

- **Frontend:** React.js, JavaScript (ES6+), Vite, React Router v6, Axios, Modern Tailwind CSS
- **Backend:** Java 21, Spring Boot 3.3.4, Maven, Spring Web, Spring Data JPA, Spring Security 6, BCrypt, JJWT
- **Database:** MySQL 8 (`homebite`)
- **Architecture:** Client-Server RESTful decoupled micro-monolith with stateless JWT authentication

---

## 2. Project Directory Structure

```text
homebite/
├── database/
│   └── schema.sql                               # MySQL 8 DDL schemas & seed data
├── backend/
│   ├── pom.xml                                  # Maven dependencies (Java 21, Spring Boot 3)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/homebite/
│   │   │   │   ├── HomeBiteApplication.java     # Spring Boot application bootstrap
│   │   │   │   ├── model/                       # JPA Entities (User, Dish, Order, CookProfile, Cart, Review...)
│   │   │   │   ├── repository/                  # Spring Data JPA Repositories
│   │   │   │   ├── service/                     # Business logic, BCrypt hashing, permissions
│   │   │   │   ├── controller/                  # REST Controllers (/api/*)
│   │   │   │   ├── dto/                         # Request and response transfer objects
│   │   │   │   ├── security/                    # Spring Security 6, JWT filter, PasswordEncoder
│   │   │   │   └── exception/                   # Global exception handling & custom exceptions
│   │   │   └── resources/
│   │   │       └── application.properties       # Port 8080, MySQL connection, JWT settings
│   │   └── test/
│   │       └── java/com/homebite/               # Unit and integration test suites
├── frontend/
│   ├── package.json                             # React 18, React Router, Axios dependencies
│   ├── index.html                               # HTML5 entry with Plus Jakarta Sans & Playfair fonts
│   ├── vite.config.js                           # Vite build configuration (Port 5173)
│   └── src/
│       ├── main.jsx                             # React root bootstrap
│       ├── App.jsx                              # Routing & protected routes configuration
│       ├── api/                                 # Axios client with fallback and live backend bridge
│       ├── context/                             # AuthContext & CartContext state providers
│       ├── components/                          # Navbar, Footer, DishCard, CookCard, CartDrawer, ReviewList
│       ├── pages/                               # Home, Dishes, DishDetail, Cooks, Checkout, Dashboards
│       └── styles/                              # Design system tokens and styles
├── .gitignore
└── README.md
```

---

## 3. Windows Setup & Run Instructions

Follow these step-by-step instructions to run the application on **Windows 10 / 11**:

### Step 1: Prerequisites Installation
1. **Java Development Kit (JDK 21):**
   - Download Eclipse Temurin JDK 21 or Oracle JDK 21 from [Adoptium](https://adoptium.net/).
   - Run installer, ensure "Set JAVA_HOME variable" is checked.
   - Verify in PowerShell: `java -version`
2. **Apache Maven:**
   - Download Maven from [maven.apache.org](https://maven.apache.org/download.cgi).
   - Extract to `C:\Program Files\Maven` and add `C:\Program Files\Maven\bin` to Windows PATH.
   - Verify in PowerShell: `mvn -version`
3. **MySQL 8 Server:**
   - Download MySQL Community Server 8 from [mysql.com](https://dev.mysql.com/downloads/installer/).
   - Set root user password to `password` (or customize in `application.properties`).
4. **Node.js (v18+ or v20+):**
   - Download and install Node.js LTS from [nodejs.org](https://nodejs.org/).
   - Verify in PowerShell: `node -v` and `npm -v`

---

### Step 2: Create & Seed the MySQL Database
1. Open **MySQL Command Line Client** or **Windows PowerShell**:
```powershell
mysql -u root -p
```
*(Enter your MySQL password when prompted)*

2. Run the database creation script:
```sql
SOURCE C:/path/to/homebite/database/schema.sql;
```
*(Or create database manually: `CREATE DATABASE homebite;` then import the `schema.sql` file).*

---

### Step 3: Run the Spring Boot Backend (Port 8080)
1. Open PowerShell and navigate to the backend folder:
```powershell
cd homebite\backend
```

2. (Optional) Set environment variables if you customized your MySQL password:
```powershell
$env:DB_USER="root"
$env:DB_PASSWORD="password"
```

3. Build and launch the Spring Boot service:
```powershell
mvn clean spring-boot:run
```
The backend starts at: **`http://localhost:8080`**

---

### Step 4: Run the React Frontend (Port 5173)
1. Open a **new PowerShell window** and navigate to the frontend folder:
```powershell
cd homebite\frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the Vite development server:
```powershell
npm run dev
```

4. Open your browser and navigate to:
**`http://localhost:5173`**

---

## 4. Default Demo Accounts

For rapid grading and evaluation, pre-seeded accounts are provided:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer** | `emily@homebite.com` | `Customer@123` | Browse menu, order meals, view status, write reviews |
| **Home Cook** | `maria@homebite.com` | `Cook@123` | Kitchen dashboard, add dishes, update order preparation status |
| **Administrator** | `admin@homebite.com` | `Admin@123` | System oversight, user moderation, all orders and revenue metrics |

*(You can also click the 1-Click Quick Fill buttons on the `/login` page).*

---

## 5. REST API Endpoints Reference

### Authentication
- `POST /api/auth/register/customer` – Register a new customer
- `POST /api/auth/register/cook` – Register a new home cook with kitchen profile
- `POST /api/auth/login` – Sign in and retrieve JWT token
- `GET  /api/auth/me` – Retrieve authenticated session identity

### Homemade Dishes
- `GET    /api/dishes` – List all available homemade dishes
- `GET    /api/dishes/search?query={}&category={}` – Search dishes by keyword and category
- `GET    /api/dishes/{id}` – Get dish details, pricing, ingredients, ratings
- `POST   /api/dishes` – Cook adds a new homemade recipe
- `PUT    /api/dishes/{id}` – Cook edits recipe details
- `DELETE /api/dishes/{id}` – Cook removes a dish

### Neighborhood Cooks
- `GET /api/cooks` – List verified local cooks
- `GET /api/cooks/{id}` – Cook kitchen profile and bio
- `GET /api/cooks/{id}/dishes` – All dishes cooked by a specific cook

### Basket & Cart
- `GET    /api/cart` – Retrieve user's current basket
- `POST   /api/cart/items` – Add dish to basket
- `PUT    /api/cart/items/{id}` – Update item quantity
- `DELETE /api/cart/items/{id}` – Remove item from basket

### Orders
- `POST  /api/orders` – Place order from current basket
- `GET   /api/orders/my` – Customer order history and status tracker
- `GET   /api/orders/{id}` – Order receipt details
- `GET   /api/cook/orders` – Cook incoming orders queue
- `PATCH /api/orders/{id}/status` – Cook updates status (`CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`)

### Community Reviews
- `GET  /api/dishes/{id}/reviews` – Get verified customer reviews
- `POST /api/dishes/{id}/reviews` – Post review with 1–5 star rating

### Administration
- `GET /api/admin/dashboard` – Platform GMV, user and order totals
- `GET /api/admin/users` – User management and role inspect
- `GET /api/admin/orders` – All orders audit log
- `GET /api/admin/dishes` – Dish catalog moderation

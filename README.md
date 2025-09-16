# Digital Queue System (Front-End Prototype)

This is a front-end prototype of a digital queue management system built with React, TypeScript, and Tailwind CSS. It demonstrates a complete user and admin workflow for managing customer queues in two distinct modes, all running locally in the browser without a backend.

<!-- It's highly recommended to add a screenshot or GIF of the application in action! -->
<!-- ![Digital Queue System Screenshot](path/to/your/screenshot.png) -->

## ✨ Key Features

- **User View:** Get a ticket and track your real-time status and position in the queue.
- **Admin Dashboard:** A secure, login-protected dashboard for staff to manage the entire system.
- **Dual Queue Modes:**
  - **One-Stage:** A simple, direct "now serving" flow suitable for single-step processes.
  - **Two-Stage:** A more complex flow where users are first called for assignment and then directed to specific rooms or counters.
- **Room Management:** In Two-Stage mode, admins can manage dedicated queues for individual rooms.
- **Responsive Design:** Styled with Tailwind CSS for a clean and functional interface on both desktop and mobile devices.
- **Persistent User Session:** Remembers your ticket number even after a page refresh using the browser's Local Storage.

## 🛠️ Tech Stack

- **[React 19](https://react.dev/):** For building the component-based user interface.
- **[TypeScript](https://www.typescriptlang.org/):** For adding static types to enhance code quality and maintainability.
- **[Tailwind CSS](https://tailwindcss.com/):** Used via a CDN for utility-first styling.
- **React Context API:** For managing global application state (e.g., queue data, authentication) without prop drilling.

## 🚀 Getting Started

This project is set up to run directly in the browser without any build steps.

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
- A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/)).
- A local web server to serve the files. The easiest way is using the **Live Server** extension for VS Code.

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   ```

2. **Navigate to the project directory:**
   ```bash
   cd <your-project-directory>
   ```

3. **Run with Live Server (VS Code):**
   - Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) from the VS Code Marketplace.
   - Right-click on the `index.html` file in the explorer.
   - Select **"Open with Live Server"**.

4. Your browser will automatically open the application, typically at an address like `http://127.0.0.1:5500`.

## 📖 How to Use

### As a User

1.  Visit the homepage.
2.  Click the **"Take a Queue Number"** button.
3.  Your ticket number and current status will be displayed and updated in real-time.

### As an Admin

1.  From the homepage, click **"Staff Login"** in the header.
2.  Enter the hardcoded credentials:
    - **Username:** `admin`
    - **Password:** `password123`
3.  Upon successful login, you will be redirected to the Staff Dashboard. From here you can:
    - **Reset the Queue:** Clears all tickets and starts fresh.
    - **Switch Modes:** Toggle between the "One-Stage" and "Two-Stage" queue systems.
    - **Manage Tickets:** Call the next person in line or call for assignment, depending on the mode.
    - **Navigate to Rooms:** In Two-Stage mode, click "Manage Room" to see a detailed view of a specific room's queue.

## 📁 Project Structure

```
/
├── components/       # Reusable React components
│   ├── common/       # General-purpose components (Button, Card, etc.)
│   ├── AdminDashboard.tsx
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   └── RoomPage.tsx
├── hooks/            # Custom React hooks for logic
│   ├── useQueueState.ts # The core state management logic for the entire queue system
│   └── useLocalStorage.ts
├── App.tsx           # Main application component, handles routing and layout
├── index.tsx         # The main entry point that renders the App
├── types.ts          # Shared TypeScript type definitions and enums
├── constants.ts      # Hardcoded constants like login credentials and room names
└── index.html        # The main HTML file
```

## 📄 License

This project is open-source. Feel free to use it as a learning resource or a starting point for your own applications.

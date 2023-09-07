# AppliGate

Welcome to AppliGate! This project was created as my final assignment for [CS50’s Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/). AppliGate is a full-stack web application developed using ReactJS (TypeScript) and Django (Django Rest Framework).

## What is AppliGate?

AppliGate is a single page web application that allows you to create and share your CV. You have access to your CV anytime, anywhere, and you can edit it whenever you need. AppliGate is also mobile responsive, so you can use it on your phone. To use the app, you need to create an account, and then you can create and share your beautiful resume.

## Why I Created AppliGate?

I created AppliGate because I was searching for a job as a web developer. When I wanted to create my own resume, I discovered that most CV generators required payment, and creating one in Microsoft Word was cumbersome. While platforms like LinkedIn exist, I envisioned a dedicated web application specifically designed for CV generation and storage. Additionally, I wanted to tackle a complex project to enhance my portfolio and learn new tools to become a better web developer. I delved into authentication methods (this app uses JWT), expanded my knowledge of React and TypeScript, and explored the Django Rest Framework. In the backend, I learned how to manage images, transitioning from storing image URLs to storing the images themselves in my media folder.

## Distinctiveness and Complexity

AppliGate is significantly more complex than anything I've undertaken in my web development journey. This application was developed using React with TypeScript on the frontend and Django with Django Rest Framework on the backend. This approach allowed me to build single page application with frontend as React components without using Django templates or Jinja2. Authentication was particularly challenging; I shifted from session authentication to implementing JWT authentication in Django Rest Framework. This required managing state in my frontend (React), which was a new concept for me. To address this, I utilized the useContext React hook.

## Files and Folder Structure

My project consists of a root folder containing `requirements.txt`, listing all necessary packages for the backend, and two main folders:

### Backend:

The backend includes my SQLite3 database, which stores all user data, `manage.py` for launching the backend, and five folders:

- `app`: Contains typical Django files like `views.py`, where I handle data operations for users based on REST requests. `serializer.py` includes methods for serializing data to and from my models. `models.py` consists of seven models, one as a one-to-one relation and six as many-to-one relations. This folder also includes a function for serializing user image names and paths. In `admin.py`, I define my models, enabling data modification in the admin panel.
- `api`: Contains two files: `views.py`, which implements the backend for JWT token authentication, and `urls.py`, where two paths are defined: one for obtaining tokens and another for refreshing tokens.

- `migrations`: Lists all changes to my database as Python files.

- `AppliGate`: In this folder, you'll find two important files: `urls.py`, which contains all URLs and associated views, and `settings.py`, where additional apps like `rest_framework` are installed. It also contains configurations to enable interaction between React and Django and configure JWT authentication.

- `media`: Stores the default user image and custom user images.

### Frontend:

In the frontend folder, you will find:

- `tsconfig.json`: Contains TypeScript settings.
- `package.json` and `package-lock.json`: Store dependency data and in package.json also is proxy setup for `http://localhost:8000` to enable frontend communication with backend views.

Additionally, there are two main folders:

#### `public`:

This folder contains basic files generated by `npx create-react-app`, including `index.html`, which serves as the main HTML file used by all React components.

#### `src`:

Inside this folder, you'll find the following important files and directories:

- `index.tsx`: This is a default file created by `create-react-app`, responsible for rendering components into the HTML.
- `colors.scss`: Custom styles that override Bootstrap colors/themes.
- `App.tsx`: Manages routing and renders components like the navbar and footer. Routes are wrapped in custom components that check if the user is logged in.

Within the `src` folder, there are two subfolders:

##### `utils`:

- `AuthProvider.tsx`: Contains authentication functions and context data for logged-in users. It also provides methods for child components to access the authentication context.
- `IfNotLoggedIn.tsx`: Checks if a user context is present and renders child components if not; otherwise, it redirects to '/'.
- `InitializeDarkMode.tsx`: Looks for localStorage 'mode' and initializes dark mode if 'dark' is present.
- `PrivateRoute.tsx`: Checks if a user is not in the context; if true, it renders child components; if false, it redirects to the login form.

##### `components`:

This directory contains all React UI components:

- `SignUp.tsx`: A form for user signup.
- `LogIn.tsx`: A form for user login.
- `Navbar.tsx`: The navigation bar, also handles the addition/removal of the 'dark' class to the body element and stores this information in localStorage to persist the dark mode state in the browser.
- `Footer.tsx`: The footer.
- `Loading.tsx`: A loading bar that fills incrementally during fetch operations.
- `ErrorPage.tsx`: A universal error page that displays AxiosError details from other components, including error code and status.
- `DeleteModal.tsx`: A dynamic Bootstrap 5 modal for various data deletion operations.
- `Example.tsx`: An example CV for non-logged-in users.
- `ProfileSettings.tsx`: A menu for profile settings, including sub-components for changing username/email, password, and account deletion. Authorization for these operations requires the user's password.
- `Index.tsx`: The homepage, allowing users to edit their profiles or view an example profile.
- `Profile.tsx`: The most crucial component, responsible for all CRUD operations for the profile. It manages data for various minor profile components, including interfaces and custom types for efficient CRUD functionality. It aims to use a single set of functions for GET, PUT, DELETE, and POST operations. It includes features like preview mode for viewing the profile like a guest, switching between private and public profiles, and copying the profile link to the clipboard. An error handler is also implemented to handle errors for profile form fields, displaying error messages under each input field to guide users when input is incorrect.

Within the `components` directory, you'll find the `profileComponent` directory, which contains minor components related to `profile` component, that are responsible for managing specific sections of the CV. Each of these components is designed to handle a single part of the CV, such as Experience, Skills, and more. They offer the functionality to edit existing data or add new information.

Here's an overview of these minor components:

- `ProfilePersonal.tsx`: This component handles personal data, including first name, last name, date of birth, and place of residence. It also includes functionality for updating the profile image.

- `ProfileContact.tsx`: Contains fields for your email and phone number.

- `ProfileSummary.tsx`: Manages the professional summary section of your CV.

- `ProfileExperience.tsx`: Handles work experience data, including work position, location, start and end dates, and more. Multiple work experiences can be edited and deleted.

- `ProfileEducation.tsx`: Manages education-related data, including the school attended, educational level, start and end dates, and more.

- `ProfileCourse.tsx`: Handles data related to courses, training, and certificates. You can provide details such as course name, course organizer, finish date, and even link a certificate.

- `ProfileLanguage.tsx`: Manages information about languages and their proficiency levels. For example: "English - B2."

- `ProfileSkills.tsx`: A slightly different component where you can input skills (e.g., "TypeScript"). After entering a skill, you can click the "Add Skill" button. This will create a rectangle displaying your skill, with a "Remove" button on the right side for easy deletion.

- `ProfileAbout.tsx`: This section allows you to share your hobbies and interests.

- `ProfileLink.tsx`: Manages links to your social media profiles, GitHub, personal projects, and more.

- `ProfileAlert.tsx`: An alert component that displays when a user deletes data or makes changes to their profile. It serves as an indicator to ensure users are aware of changes without causing confusion.

- `ProfileDeleteModal.tsx`: A delete modal that appears when a user attempts to delete data. To confirm deletion, users need to confirm their intent.

- `ProfileStatus.tsx`: This component manages profile status, allowing users to switch between private and public profiles.

These components are designed to provide a user-friendly and comprehensive way to manage the various sections of a CV within the application.

## How to run AppliGate?

## Prerequisites

Before running AppliGate, make sure you have the following prerequisites installed on your system:

- [Python](https://www.python.org/downloads/) (for the Django backend) - tested on 3.10.10 and 3.11.4
- [Node.js](https://nodejs.org/en/download/) (for the React frontend)
- [npm](https://www.npmjs.com/get-npm) (Node Package Manager)

## Getting Started

Follow these steps to set up and run the AppliGate project on your local machine.

### 1. Download Repository

Download or clone this Git repository to your local machine

### 2. Navigate to the Project Folder

- Open your terminal or command prompt and navigate to the root folder of the cloned project:

  ```shell
  cd AppliGate
  ```

### Backend Setup

#### 3. Backend Folder

- Navigate to the backend folder:

  ```shell
  cd backend
  ```

#### 4. Install Python Dependencies

- Install the Python dependencies listed in `requirements.txt`:

  ```shell
  pip install -r requirements.txt
  ```

#### 5. Apply Database Migrations

- Apply the database migrations to set up the SQLite3 database:

  ```shell
  python manage.py makemigrations
  python manage.py migrate
  ```

#### 6. Run the Backend Server

- Start the Django development server:

  ```shell
  python manage.py runserver
  ```

The backend should now be running at `http://localhost:8000`.

### Frontend Setup

#### 7. Frontend Folder

- Open a new terminal or command prompt and navigate to the frontend folder:

  ```shell
  cd ../frontend
  ```

#### 8. Start the Frontend Development Server

- Start the React development server, which will automatically open a new browser window:

  ```shell
  npm start
  ```

The frontend should now be accessible at `http://localhost:3000`.

### Accessing AppliGate

1. **Open Your Web Browser:**

   Open your web browser and go to `http://localhost:3000` to access the AppliGate application.

2. **Register or Log In:**

   - If you are a new user, click on the "Sign Up" option to create an account.
   - If you already have an account, use the "Log In" option to access your account.

3. **Explore and Use the Application:**

   Once you are logged in, you can explore the application, edit your profile, add or update your CV information, and customize your settings.

That's it! You should now have AppliGate up and running on your local development environment. Enjoy using the application to manage your CV and profile.

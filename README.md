# Image Scraper

This is a full-stack application that allows users to input URLs, scrape images from those URLs, and display the images. The project uses React.js for the frontend and Django for the backend.

## Setup Instructions

### Backend (Django)

1. **Clone the repository:**
    ```bash
    git clone https://github.com/aoudichyasatish/image-scraper.git
    cd image-scraper/backend
    ```

2. **Create a virtual environment and activate it:**
    ```bash
    python -m venv env
    source env/bin/activate  # On Windows use `env\Scripts\activate`
    ```

3. **Install the required packages:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Apply the migrations:**
    ```bash
    python manage.py migrate
    ```

5. **Run the development server:**
    ```bash
    python manage.py runserver
    ```

### Frontend (React.js)

1. **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2. **Install the dependencies:**
    ```bash
    npm install
    ```

3. **Start the development server:**
    ```bash
    npm start
    ```

### Usage

1. **Register a new user** using the registration form.
2. **Login** with the registered user credentials.
3. **Enter URLs** in the provided input field and submit.
4. The images from the URLs will be displayed in a grid format.
5. Use the **Load More** button to load more images if available.

## Code Considerations

- The backend uses Django REST Framework for building the API.
- The frontend uses Material UI for styling and components.
- Authentication is handled using Django REST Framework's Token Authentication.
- Pagination is implemented to handle large number of images efficiently.
- Error handling is implemented using Material UI's Snackbar and Alert components.

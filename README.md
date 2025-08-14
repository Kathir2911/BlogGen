# Firebase Studio - Next.js Blog Platform

This is a full-stack blog application built with Next.js, MongoDB, and Tailwind CSS. It features user authentication, post and comment management, and an interactive API explorer.

## How to Run This Project Locally in VS Code

To get this project running on your local machine, follow the steps below.

### 1. Prerequisites

Before you start, make sure you have the following installed on your computer:

- **Node.js**: Download and install it from [nodejs.org](https://nodejs.org/). This will also install `npm`.
- **VS Code**: Download it from [code.visualstudio.com](https://code.visualstudio.com/).
- **MongoDB**: You need a MongoDB database. You can:
  - Run it locally using Docker or by installing MongoDB Community Server.
  - Use a free cloud-hosted instance from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
- **Twilio Account**: For the phone verification (OTP) to work, you'll need a free Twilio account. Sign up at [twilio.com](https://www.twilio.com/).

### 2. Project Setup

1.  **Download or Clone the Code**: Get the project files onto your local machine.

2.  **Create Environment File**: In the root directory of the project, create a new file named `.env.local`.

3.  **Add Environment Variables**: Open `.env.local` and add the following, replacing the placeholders with your actual credentials:

    ```bash
    # MongoDB Connection String (from your local setup or MongoDB Atlas)
    MONGODB_URI="your_mongodb_connection_string"
    MONGODB_DB="your_database_name"

    # Twilio Credentials (from your Twilio account dashboard)
    TWILIO_ACCOUNT_SID="your_twilio_account_sid"
    TWILIO_AUTH_TOKEN="your_twilio_auth_token"
    TWILIO_PHONE_NUMBER="your_twilio_phone_number"
    ```

4.  **Install Dependencies**: Open a terminal in VS Code (`View` > `Terminal`) and run the following command to install all the required packages:
    ```bash
    npm install
    ```

5.  **Run the Development Server**: After the installation is complete, start the Next.js development server:
    ```bash
    npm run dev
    ```

Your application should now be running! You can open your web browser and navigate to **http://localhost:3000** to see it in action.

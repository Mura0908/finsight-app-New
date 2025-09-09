# FinSight Budget App

FinSight is a personal finance management application that helps users track income, expenses, budgets, financial goals, debts, and repayments to friends/family. The app features a secure section for personal repayments protected by a user-defined password.

## Features

- **Dashboard**: Overview of financial status with charts and recent transactions
- **Income Tracking**: Record and categorize all sources of income
- **Expense Management**: Track spending across different categories
- **Budget Planning**: Set budgets for different spending categories
- **Financial Goals**: Define and track savings goals with deadlines
- **Debt Management**: Track debts and repayment schedules
- **Secure Repayments**: Password-protected section for tracking money owed to/from friends and family
- **Reports & Analytics**: Financial trend analysis and spending insights
- **Category Management**: Customizable income and expense categories
- **APK Download**: Direct APK download for easy installation

## Screenshots

![Dashboard](screenshots/dashboard.png)
![Income Tracking](screenshots/income.png)
![Expense Management](screenshots/expenses.png)

## Installation

### Android APK

You can download the APK directly from our [download page](app/src/main/assets/download.html) within the app, or by accessing the download.html file after deploying the assets to a web server.

For direct access, deploy the contents of `app/src/main/assets/` to a web server and navigate to the download.html page.

### Building from Source

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/finsight-app.git
   ```

2. Open the project in Android Studio

3. Build and run the app

## Usage

1. Set up your password for the secure repayments section
2. Add your income sources
3. Track your expenses by category
4. Set budgets for different spending categories
5. Define financial goals with target amounts and deadlines
6. Track debts and repayment schedules
7. Use the repayments section to manage money owed to/from friends and family

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Android WebView
- **Storage**: LocalStorage (client-side)
- **Charts**: Chart.js

## Project Structure

```
finsight-app/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── assets/
│   │   │   │   ├── index.html
│   │   │   │   ├── styles.css
│   │   │   │   ├── script.js
│   │   │   │   └── download.html
│   │   │   ├── java/
│   │   │   └── res/
│   │   └── build.gradle.kts
├── screenshots/
├── README.md
├── LICENSE
├── setup-repo.sh
├── setup-repo.bat
├── build.gradle.kts
├── gradle.properties
├── gradlew
├── gradlew.bat
└── settings.gradle.kts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or questions, please open an issue on GitHub.
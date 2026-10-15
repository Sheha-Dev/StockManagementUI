
# Stock Management UI

An Angular frontend application for managing stock requests between branches. The application integrates with the Stock Management API to manage products, branches, and stock request workflows.

## 1. Project Overview

The Stock Management UI provides a user interface for managing stock transfers between branches.

Users can create stock requests, select source and destination branches, add products and quantities, and manage request statuses.

## 2. Technologies Used

- Angular
- TypeScript
- HTML5
- SCSS
- RxJS
- Angular Reactive Forms
- Angular HttpClient
- RESTful API integration

## 3. Main Features

### Branch Management
- Retrieve branches from the API.
- Display active branches in dropdown lists.
- Prevent selecting the same source and destination branch.

### Product Management
- Retrieve active products from the API.
- Add multiple products to a stock request.
- Prevent selecting the same product more than once.
- Validate product quantities.

### Stock Request Management
- Create stock requests.
- View stock requests.
- Filter requests by status, source branch, destination branch, and product.
- Support pagination.
- Dispatch stock requests.
- Receive stock requests.
- Cancel stock requests.

### Form Validation
- Required field validation.
- Positive whole-number quantity validation.
- Duplicate product validation.
- Source and destination branch validation.
- Loading and error messages during API operations.

## 4. Prerequisites

Install the following software before running the project:

- Node.js (a version supported by the installed Angular version)
- npm
- Angular CLI
- Visual Studio Code or another code editor
- Stock Management API running and accessible

Check the installed versions:

```bash
node --version
npm --version
ng version
```

## 5. Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd StockManagementUI
```

Install dependencies:

```bash
npm install
```

## 6. Environment Configuration

Configure the API base URL in the Angular environment configuration.

Example:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7001/api'
};
```

Replace the URL with the actual base URL of your Stock Management API.

The API port and base path must match your backend configuration.

The StockRequestService uses this base URL to call endpoints such as:

```text
GET  /Request/Requests
POST /Request/Requests
POST /Request/{requestId}/dispatch
POST /Request/{requestId}/receive
POST /Request/{requestId}/cancel
```

The API must be running and reachable from the browser.

## 7. Running the Application

Start the Angular development server:

```bash
ng serve
```

Open the application in your browser:

```text
http://localhost:4200
```



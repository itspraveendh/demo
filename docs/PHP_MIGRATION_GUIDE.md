# Fab Steel Consultancy ERP — PHP 8.x + MySQL Migration Guide

This step-by-step engineering blueprint instructs backend engineers on migrating the Phase 1 pure-frontend demonstration system into a robust **Phase 2 Production PHP 8.2+ & MySQL 8.0 ERP**.

---

## 1. Target Backend Project Directory Structure

```
fab-steel-erp-backend/
├── public/
│   ├── index.php                 # Central Front Controller & REST Router
│   ├── .htaccess                 # URL rewrite engine for Apache
│   └── uploads/                  # Secure file upload directory
├── src/
│   ├── Config/
│   │   ├── Database.php          # PDO singleton connection pool
│   │   └── AppConfig.php         # Environment constants & JWT secrets
│   ├── Middleware/
│   │   ├── CorsMiddleware.php    # CORS headers for decoupled frontend
│   │   └── AuthMiddleware.php    # Bearer JWT verification & RBAC guard
│   ├── Controllers/
│   │   ├── AuthController.php    # Login, session, OTP verification
│   │   ├── EmployeeController.php# Workforce CRUD & filters
│   │   ├── InvoiceController.php # Billing calculation & payment logging
│   │   ├── PayrollController.php # Batch compensation runs
│   │   └── ReportController.php  # Executive BI aggregates
│   ├── Models/
│   │   ├── User.php
│   │   ├── Employee.php
│   │   ├── Invoice.php
│   │   └── Payroll.php
│   ├── Services/
│   │   ├── MailerService.php     # Real Gmail SMTP dispatch via PHPMailer
│   │   └── AuditLogger.php       # Transactional activity logging
│   └── Utils/
│       ├── Response.php          # Standard RFC-compliant JSON envelopes
│       └── Validator.php         # Server-side schema validation
├── scripts/
│   └── migrate_seeds.php         # LocalStorage JSON to MySQL importer
├── vendor/                       # Composer dependencies
├── composer.json
└── .env                          # Secret credentials (DB pass, JWT secret)
```

---

## 2. Composer Dependencies (`composer.json`)

```json
{
  "name": "fabsteel/erp-backend",
  "description": "Fab Steel Consultancy ERP REST API Backend",
  "type": "project",
  "require": {
    "php": ">=8.2",
    "firebase/php-jwt": "^6.10",
    "phpmailer/phpmailer": "^6.9",
    "vlucas/phpdotenv": "^5.6"
  },
  "autoload": {
    "psr-4": {
      "FabSteel\\": "src/"
    }
  }
}
```

---

## 3. Database Connection via PDO (`src/Config/Database.php`)

```php
<?php
namespace FabSteel\Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
            $port = $_ENV['DB_PORT'] ?? '3306';
            $db   = $_ENV['DB_NAME'] ?? 'fab_steel_erp';
            $user = $_ENV['DB_USER'] ?? 'root';
            $pass = $_ENV['DB_PASS'] ?? '';

            $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'status' => 500,
                    'message' => 'Database connection failed: ' . $e->getMessage()
                ]);
                exit;
            }
        }
        return self::$instance;
    }
}
```

---

## 4. Standard Response Envelope Helper (`src/Utils/Response.php`)

This guarantees complete backward compatibility with the Phase 1 frontend contracts:

```php
<?php
namespace FabSteel\Utils;

class Response {
    public static function json(bool $success, int $status, mixed $data, string $message = '', array $meta = [], array $errors = []): void {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');

        $response = [
            'success' => $success,
            'status'  => $status,
            'data'    => $data,
            'message' => $message,
            'meta'    => array_merge(['timestamp' => date('c')], $meta)
        ];

        if (!$success && !empty($errors)) {
            $response['errors'] = $errors;
        }

        echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        exit;
    }

    public static function success(mixed $data, string $message = 'Success', array $meta = []): void {
        self::json(true, 200, $data, $message, $meta);
    }

    public static function created(mixed $data, string $message = 'Created successfully'): void {
        self::json(true, 201, $data, $message);
    }

    public static function error(string $message, int $status = 400, array $errors = []): void {
        self::json(false, $status, null, $message, [], $errors);
    }
}
```

---

## 5. Front Controller & Micro-Router (`public/index.php`)

```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';

use FabSteel\Utils\Response;
use FabSteel\Controllers\AuthController;
use FabSteel\Controllers\EmployeeController;
use FabSteel\Controllers\InvoiceController;

// Enable CORS for Decoupled Frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse Request Path
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Strip prefix /api/v1
$path = preg_replace('#^/api/v1#', '', $uri);
$segments = array_values(array_filter(explode('/', $path)));
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;

// JSON Request Payload
$rawInput = file_get_contents('php://input');
$payload = !empty($rawInput) ? json_decode($rawInput, true) : $_POST;

try {
    switch ($resource) {
        case 'auth':
            $auth = new AuthController();
            if ($id === 'login' && $method === 'POST') $auth->login($payload);
            if ($id === 'forgot-password' && $method === 'POST') $auth->forgotPassword($payload);
            if ($id === 'reset-password' && $method === 'POST') $auth->resetPassword($payload);
            break;

        case 'employees':
            $emp = new EmployeeController();
            if ($method === 'GET' && !$id) $emp->index($_GET);
            if ($method === 'GET' && $id) $emp->show($id);
            if ($method === 'POST') $emp->store($payload);
            if ($method === 'PUT' && $id) $emp->update($id, $payload);
            if ($method === 'DELETE' && $id) $emp->destroy($id);
            break;

        case 'invoices':
            $inv = new InvoiceController();
            if ($method === 'GET' && !$id) $inv->index($_GET);
            if ($method === 'GET' && $id) $inv->show($id);
            if ($method === 'POST' && !$id) $inv->store($payload);
            if ($method === 'POST' && $id && ($segments[2] ?? '') === 'payment') $inv->recordPayment($id, $payload);
            break;

        default:
            Response::error("Resource not found: {$method} {$uri}", 404);
    }
} catch (\Throwable $e) {
    Response::error($e->getMessage(), 500);
}
```

---

## 6. Seed Data Migration Script (`scripts/migrate_seeds.php`)

This CLI script extracts the Phase 1 LocalStorage snapshot (saved as `snapshot.json`) and populates the MySQL database:

```php
<?php
// Run via: php scripts/migrate_seeds.php snapshot.json
require_once __DIR__ . '/../vendor/autoload.php';

use FabSteel\Config\Database;

$snapshotFile = $argv[1] ?? __DIR__ . '/snapshot.json';
if (!file_exists($snapshotFile)) {
    die("Error: Snapshot file {$snapshotFile} not found.\n");
}

$data = json_decode(file_get_contents($snapshotFile), true);
$pdo = Database::getConnection();

echo "Beginning migration of Phase 1 seeds into MySQL...\n";

// 1. Migrate Employees
if (!empty($data['employees'])) {
    $stmt = $pdo->prepare("
        INSERT INTO employees (code, department_id, name, email, phone, designation, status, join_date, location)
        VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status)
    ");
    foreach ($data['employees'] as $emp) {
        $stmt->execute([
            $emp['id'],
            $emp['name'],
            $emp['email'],
            $emp['phone'] ?? '+1 (555) 000-0000',
            $emp['designation'],
            $emp['status'] ?? 'Active',
            $emp['joinDate'] ?? date('Y-m-d'),
            $emp['location'] ?? 'Headquarters'
        ]);
    }
    echo "✔ Successfully migrated " . count($data['employees']) . " employees.\n";
}

// 2. Migrate Invoices
if (!empty($data['invoices'])) {
    $stmt = $pdo->prepare("
        INSERT INTO invoices (invoice_number, partner_id, issue_date, due_date, subtotal, tax_amount, total_amount, status)
        VALUES (?, 1, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status=VALUES(status)
    ");
    foreach ($data['invoices'] as $inv) {
        $stmt->execute([
            $inv['invoiceNumber'] ?? $inv['id'],
            $inv['date'] ?? date('Y-m-d'),
            $inv['dueDate'] ?? date('Y-m-d', strtotime('+30 days')),
            $inv['subtotal'] ?? 0,
            $inv['tax'] ?? 0,
            $inv['total'] ?? 0,
            $inv['status'] ?? 'Draft'
        ]);
    }
    echo "✔ Successfully migrated " . count($data['invoices']) . " invoices.\n";
}

echo "Migration completed successfully!\n";
```

---

## 7. Connecting Frontend to the PHP Backend

To switch the entire frontend application to consume the live PHP backend, open `assets/js/core/app-config.js` and edit:

```javascript
// Switch from 'mock' to 'php'
API_MODE: 'php',
API_BASE_URL: 'https://your-api-domain.com/api/v1',
```

Zero additional JavaScript changes are required! The `FabApiClient` will automatically begin routing requests to the PHP REST API.


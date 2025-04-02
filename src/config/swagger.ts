import { OpenAPIV3 } from 'openapi-types';

const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Mainstack Ledger',
    description:
      'API for managing authentication, accounts, and financial transactions with idempotency and concurrency control.',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Base URL for all endpoints',
    },
  ],
  paths: {
    '/auth/login': {
      post: {
        summary: 'User login',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginDto' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/accounts': {
      post: {
        summary: 'Create a new account',
        tags: ['Accounts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateAccountDto' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Account created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Account' },
              },
            },
          },
          '400': {
            description: 'Invalid request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      get: {
        summary: 'List user accounts',
        tags: ['Accounts'],
        responses: {
          '200': {
            description: 'List of user accounts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Account' },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/accounts/{accountId}': {
      get: {
        summary: 'Get account details',
        tags: ['Accounts'],
        parameters: [
          {
            in: 'path',
            name: 'accountId',
            required: true,
            schema: { type: 'string' },
            description: 'Unique account ID (e.g., acc-uuid)',
          },
        ],
        responses: {
          '200': {
            description: 'Account details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Account' },
              },
            },
          },
          '404': {
            description: 'Account not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/transactions/deposit': {
      post: {
        summary: 'Deposit funds into an account',
        tags: ['Transactions'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DepositDto' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Deposit successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TransactionResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid request or insufficient data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Duplicate request detected',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'header',
            name: 'X-Idempotency-Key',
            schema: { type: 'string' },
            required: false,
            description: 'Optional key to ensure idempotency',
          },
        ],
      },
    },
    '/transactions/withdraw': {
      post: {
        summary: 'Withdraw funds from an account',
        tags: ['Transactions'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WithdrawalDto' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Withdrawal successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TransactionResponse' },
              },
            },
          },
          '400': {
            description: 'Insufficient funds or invalid account',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Duplicate request or concurrency conflict',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'header',
            name: 'X-Idempotency-Key',
            schema: { type: 'string' },
            required: false,
            description: 'Optional key to ensure idempotency',
          },
        ],
      },
    },
    '/transactions/transfer': {
      post: {
        summary: 'Transfer funds between accounts',
        tags: ['Transactions'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TransferDto' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Transfer successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TransactionResponse' },
              },
            },
          },
          '400': {
            description:
              'Insufficient funds, currency mismatch, or same account',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Duplicate request or concurrency conflict',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'header',
            name: 'X-Idempotency-Key',
            schema: { type: 'string' },
            required: false,
            description: 'Optional key to ensure idempotency',
          },
        ],
      },
    },
    '/transactions/{transactionId}': {
      get: {
        summary: 'Get a transaction by ID',
        tags: ['Transactions'],
        parameters: [
          {
            in: 'path',
            name: 'transactionId',
            required: true,
            schema: { type: 'string' },
            description: 'Unique transaction ID (e.g., txn-uuid)',
          },
        ],
        responses: {
          '200': {
            description: 'Transaction details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Transaction' },
              },
            },
          },
          '404': {
            description: 'Transaction not found or unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/transactions': {
      get: {
        summary: 'List transactions for the authenticated user',
        tags: ['Transactions'],
        parameters: [
          {
            in: 'query',
            name: 'type',
            schema: {
              type: 'string',
              enum: ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'],
            },
            description: 'Filter by transaction type',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 10 },
            description: 'Number of transactions to return',
          },
          {
            in: 'query',
            name: 'offset',
            schema: { type: 'integer', default: 0 },
            description: 'Number of transactions to skip',
          },
        ],
        responses: {
          '200': {
            description: 'List of user transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TransactionSummary' },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/accounts/{accountId}/transactions': {
      get: {
        summary: 'List transactions for a specific account',
        tags: ['Transactions'],
        parameters: [
          {
            in: 'path',
            name: 'accountId',
            required: true,
            schema: { type: 'string' },
            description: 'Unique account ID (e.g., acc-uuid)',
          },
          {
            in: 'query',
            name: 'type',
            schema: {
              type: 'string',
              enum: ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'],
            },
            description: 'Filter by transaction type',
          },
          {
            in: 'query',
            name: 'startDate',
            schema: { type: 'string', format: 'date-time' },
            description: 'Filter by start date',
          },
          {
            in: 'query',
            name: 'endDate',
            schema: { type: 'string', format: 'date-time' },
            description: 'Filter by end date',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 10 },
            description: 'Number of transactions to return',
          },
          {
            in: 'query',
            name: 'offset',
            schema: { type: 'integer', default: 0 },
            description: 'Number of transactions to skip',
          },
        ],
        responses: {
          '200': {
            description: 'List of account transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TransactionSummary' },
                },
              },
            },
          },
          '404': {
            description: 'Account not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/transactions/{transactionId}/ledger-entries': {
      get: {
        summary: 'Get ledger entries for a transaction',
        tags: ['Transactions'],
        parameters: [
          {
            in: 'path',
            name: 'transactionId',
            required: true,
            schema: { type: 'string' },
            description: 'Unique transaction ID (e.g., txn-uuid)',
          },
        ],
        responses: {
          '200': {
            description: 'List of ledger entries',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/LedgerEntry' },
                },
              },
            },
          },
          '404': {
            description: 'No entries found or unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
  },
  components: {
    schemas: {
      LoginDto: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            example: 'user@example.com',
            description: 'User email',
          },
          password: {
            type: 'string',
            example: 'password123',
            description: 'User password',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          userId: { type: 'string', example: 'usr-123' },
        },
      },
      CreateAccountDto: {
        type: 'object',
        required: ['currency'],
        properties: {
          currency: {
            type: 'string',
            example: 'NGN',
            description: 'Account currency',
          },
        },
      },
      Account: {
        type: 'object',
        properties: {
          accountId: { type: 'string', example: 'acc-123' },
          userId: { type: 'string', example: 'usr-123' },
          balance: { type: 'string', example: '100.00' },
          currency: { type: 'string', example: 'NGN' },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE'],
            example: 'ACTIVE',
          },
          version: {
            type: 'number',
            example: 0,
            description: 'Concurrency control version',
          },
        },
      },
      DepositDto: {
        type: 'object',
        required: ['amount', 'toAccountId'],
        properties: {
          amount: {
            type: 'number',
            example: 50.0,
            description: 'Amount to deposit',
          },
          toAccountId: {
            type: 'string',
            example: 'acc-123',
            description: 'Destination account ID',
          },
        },
      },
      WithdrawalDto: {
        type: 'object',
        required: ['amount', 'fromAccountId'],
        properties: {
          amount: {
            type: 'number',
            example: 30.0,
            description: 'Amount to withdraw',
          },
          fromAccountId: {
            type: 'string',
            example: 'acc-123',
            description: 'Source account ID',
          },
        },
      },
      TransferDto: {
        type: 'object',
        required: ['amount', 'fromAccountId', 'toAccountId'],
        properties: {
          amount: {
            type: 'number',
            example: 20.0,
            description: 'Amount to transfer',
          },
          fromAccountId: {
            type: 'string',
            example: 'acc-123',
            description: 'Source account ID',
          },
          toAccountId: {
            type: 'string',
            example: 'acc-456',
            description: 'Destination account ID',
          },
        },
      },
      TransactionResponse: {
        type: 'object',
        properties: {
          transactionId: { type: 'string', example: 'txn-uuid123' },
          amount: { type: 'string', example: '50.00' },
          currency: { type: 'string', example: 'NGN' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          transactionId: { type: 'string', example: 'txn-uuid123' },
          type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'] },
          fromAccountId: { type: 'string', example: 'acc-123' },
          toAccountId: { type: 'string', example: 'acc-456' },
          amount: { type: 'string', example: '50.00' },
          currency: { type: 'string', example: 'NGN' },
          balanceBefore: { type: 'string', example: '100.00' },
          balanceAfter: { type: 'string', example: '150.00' },
          status: { type: 'string', enum: ['PENDING', 'COMPLETED'] },
          requestId: { type: 'string', example: 'req-uuid456' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-04-02T12:00:00Z',
          },
        },
      },
      TransactionSummary: {
        type: 'object',
        properties: {
          transactionId: { type: 'string', example: 'txn-uuid123' },
          type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'] },
          amount: { type: 'string', example: '50.00' },
          currency: { type: 'string', example: 'NGN' },
          status: { type: 'string', enum: ['PENDING', 'COMPLETED'] },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-04-02T12:00:00Z',
          },
        },
      },
      LedgerEntry: {
        type: 'object',
        properties: {
          entryId: { type: 'string', example: 'led-uuid789' },
          transactionId: { type: 'string', example: 'txn-uuid123' },
          accountId: { type: 'string', example: 'acc-123' },
          amount: { type: 'string', example: '-50.00' },
          entryType: { type: 'string', enum: ['DEBIT', 'CREDIT'] },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-04-02T12:00:00Z',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Duplicate request detected' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
export default swaggerSpec;

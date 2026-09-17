# BLASTGUARD

> **“Before you change production, know what will break.”**

BlastGuard is an infrastructure safety system for AWS. An engineer proposes an infrastructure modification such as `DELETE subnet-07`. BlastGuard analyzes what depends on the resource, what downstream workloads could be affected, security implications, policy violations, blast radius, deterministic risk scores, and delivers an authoritative **SAFE / REVIEW / BLOCK** decision before changes hit production.

This repository contains **STAGE 1: Core Infrastructure Intelligence Backend Foundation**.

---

## Architecture Overview

Stage 1 establishes a modular, type-safe backend foundation designed to cleanly isolate infrastructure intelligence from API presentation, without tightly coupling the application to AWS credentials or live cloud environments.

```
AWS_Blastguard/
├── .env.example               # Sample environment configuration
├── .gitignore
├── API_CONTRACT.md            # Comprehensive API data contracts & schemas
├── README.md                  # System documentation & setup guide
├── package.json               # Node dependencies & npm scripts
├── template.yaml              # AWS SAM template (Lambda + API Gateway)
├── tsconfig.json              # Strict TypeScript configuration
│
├── src/
│   ├── app.ts                 # Express application with CORS & error handlers
│   ├── server.ts              # Local standalone HTTP server entrypoint
│   │
│   ├── config/                # Typed configuration loader
│   │   └── index.ts
│   │
│   ├── models/                # Strongly-typed domain models
│   │   ├── Resource.ts        # Cloud resources (VPC, Subnet, EC2, RDS, etc.)
│   │   ├── Dependency.ts      # Resource dependency relationships
│   │   ├── ChangeRequest.ts   # Proposed infrastructure changes
│   │   ├── TopologyNode.ts    # Graph topology node
│   │   ├── TopologyEdge.ts    # Graph topology edge
│   │   ├── ImpactGraph.ts     # Blast radius topology graph
│   │   ├── SecurityFinding.ts # Security vulnerability models
│   │   ├── PolicyViolation.ts # Governance & compliance violations
│   │   ├── RiskResult.ts      # Risk scoring & decisions (SAFE/REVIEW/BLOCK)
│   │   ├── AnalysisResult.ts  # Unified analysis container
│   │   └── index.ts
│   │
│   ├── providers/             # Infrastructure abstraction layer
│   │   ├── ResourceProvider.ts     # Core interface abstraction
│   │   ├── MockResourceProvider.ts # In-memory AWS cloud topology
│   │   ├── AWSResourceProvider.ts  # AWS SDK v3 client implementation
│   │   └── index.ts                # Provider factory (mock vs aws)
│   │
│   ├── services/              # Business intelligence & lifecycle services
│   │   ├── ChangeRequestService.ts # Change request management
│   │   ├── ImpactService.ts        # Blast radius graph traversal
│   │   ├── AnalysisService.ts      # Analysis orchestrator (Stage 1 placeholder)
│   │   └── index.ts
│   │
│   ├── engine/                # Risk engine contracts (Stage 2 foundation)
│   │   ├── AnalysisEngine.ts
│   │   └── index.ts
│   │
│   ├── agents/                # Multi-agent architecture interfaces (Stage 2)
│   │   ├── BlastRadiusAgent.ts
│   │   ├── SecurityAgent.ts
│   │   ├── PolicyAgent.ts
│   │   └── index.ts
│   │
│   ├── routes/                # Express API route definitions
│   │   ├── healthRoutes.ts
│   │   ├── requestRoutes.ts
│   │   └── index.ts
│   │
│   ├── handlers/              # Route controller handlers & Lambda bridge
│   │   ├── healthHandler.ts
│   │   ├── requestHandler.ts
│   │   ├── lambda.ts          # AWS Lambda entrypoint (serverless-http)
│   │   └── index.ts
│   │
│   └── utils/                 # Validation, errors, and responses
│       ├── errors.ts          # AppError hierarchy with HTTP status codes
│       ├── validation.ts      # Zod request validation
│       ├── response.ts        # Standardized API response envelope
│       ├── logger.ts          # Structured logger
│       └── index.ts
│
└── tests/                     # Unit and integration test suite
    ├── health.test.ts         # Health & discovery endpoint tests
    ├── validation.test.ts     # Request validation & error formatting tests
    ├── requests.test.ts       # ChangeRequest, Impact, & Analyze tests
    └── mockProvider.test.ts   # MockResourceProvider topology tests
```

---

## Key Features in Stage 1

1. **Strict ResourceProvider Abstraction**:
   - decouples application logic from direct AWS SDK calls.
   - `MockResourceProvider` delivers realistic production AWS topology (VPC, Subnets, EC2, RDS, ALB, Lambda, S3, IAM, SecurityGroups).
   - Zero AWS credentials required for local development when `BLASTGUARD_MODE=mock`.

2. **Domain Models**:
   - Complete type safety covering 10 AWS resource types (`VPC`, `Subnet`, `EC2`, `ECS`, `RDS`, `Lambda`, `S3`, `IAM`, `LoadBalancer`, `SecurityGroup`).
   - Change requests with actions (`CREATE`, `UPDATE`, `DELETE`), environments (`DEV`, `STAGING`, `PRODUCTION`), and statuses (`PENDING`, `ANALYZING`, `SAFE`, `REVIEW`, `BLOCKED`, `FAILED`).
   - Full contracts for `ImpactGraph`, `SecurityFinding`, `PolicyViolation`, `RiskResult`, and `AnalysisResult`.

3. **RESTful API Foundation**:
   - `GET /api/health`
   - `POST /api/requests`
   - `GET /api/requests`
   - `GET /api/requests/:requestId`
   - `POST /api/requests/:requestId/analyze`
   - `GET /api/requests/:requestId/impact`

4. **Robust Input Validation & Error Handling**:
   - Payloads validated via Zod schemas.
   - Consistent error envelope with `error.code`, `error.message`, and `error.details`.

5. **Serverless & Local Ready**:
   - Runs locally with `npm run dev` or `npm start`.
   - Ready for AWS SAM local / Lambda API Gateway via `dist/handlers/lambda.handler` and `template.yaml`.

---

## Getting Started

### Prerequisites
- Node.js (v20.x or later)
- npm (v10.x or later)

### Installation
```bash
# Clone the repository
git clone https://github.com/Akansh475/AWS_Blastguard.git
cd AWS_Blastguard

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default variables:
```ini
AWS_REGION=ap-south-1
BLASTGUARD_MODE=mock
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Development Server
Run the local HTTP server with automatic restart:
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### Building for Production
```bash
npm run build
```
Compiles TypeScript into `./dist`.

### Running Tests
Execute the comprehensive test suite with Vitest:
```bash
npm test
```

### Running with AWS SAM Local
To run the Lambda function locally using AWS SAM CLI:
```bash
# Build TypeScript
npm run build

# Start SAM local API
sam local start-api
```

---

## API Summary

Detailed request/response schemas can be found in [`API_CONTRACT.md`](./API_CONTRACT.md).

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health, mode, uptime, and region |
| `POST` | `/api/requests` | Propose a new infrastructure change request |
| `GET` | `/api/requests` | List all proposed change requests |
| `GET` | `/api/requests/:requestId` | Fetch details of a specific change request |
| `GET` | `/api/requests/:requestId/impact` | Retrieve blast radius and dependency graph |
| `POST` | `/api/requests/:requestId/analyze` | Trigger infrastructure safety analysis (Stage 1 placeholder) |

---

## What Stage 2 Will Build On

Stage 1 establishes the clean contracts and interfaces needed for upcoming modules:
1. **Multi-Agent Intelligence Engine (`src/engine/AnalysisEngine.ts`)**:
   - Stage 2 will implement deep deterministic risk score formulas (0-100) combining blast radius, resource criticality, and environment tier.
2. **Specialized Agents (`src/agents/`)**:
   - `BlastRadiusAgent`: Multi-hop recursive graph traversal and cross-VPC peering/transit gateway analysis.
   - `SecurityAgent`: Evaluation of IAM least privilege, open security group ports (e.g. 0.0.0.0/0 ingress), and public S3 bucket policies.
   - `PolicyAgent`: Compliance rules (e.g. multi-AZ requirements, production deletion protection, backup policies).
3. **AWS Live Scanning (`src/providers/AWSResourceProvider.ts`)**:
   - Expansion of AWS SDK v3 callers to ingest real AWS environments when `BLASTGUARD_MODE=aws`.
4. **Data Contract Stability**:
   - Frontend and integration developers (Person 2) can safely integrate against `API_CONTRACT.md` today. Stage 2 will populate the `securityFindings`, `policyViolations`, and `recommendations` fields without breaking schema contracts.

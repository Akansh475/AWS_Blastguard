# BLASTGUARD

> **“Before you change production, know what will break.”**

BlastGuard is an infrastructure safety system for AWS. An engineer proposes an infrastructure modification such as `DELETE subnet-07`. BlastGuard analyzes what depends on the resource, what downstream workloads could be affected, security implications, policy violations, blast radius, deterministic risk scores, and delivers an authoritative **SAFE / REVIEW / BLOCK** decision before changes hit production.

This repository contains **STAGE 1 & STAGE 2: Core Infrastructure Intelligence & Deterministic Topology Engine**.

---

## Architecture Overview

BlastGuard adheres strictly to the architectural rule: **`API → Service → ResourceProvider → Graph`**. Infrastructure and dependency intelligence are decoupled from presentation routes and handlers.

```
AWS_Blastguard/
├── .env.example                     # Environment template (ap-south-1, mock mode)
├── .gitignore                       # Standard ignore rules
├── API_CONTRACT.md                  # Comprehensive API data contracts & schemas
├── README.md                        # System documentation & setup guide
├── package.json                     # Dependencies, build & test scripts
├── template.yaml                    # AWS SAM template (Lambda + API Gateway)
├── tsconfig.json                    # Strict TypeScript configuration
│
├── src/
│   ├── app.ts                       # Express application with CORS & error middleware
│   ├── server.ts                    # Local HTTP server entrypoint
│   │
│   ├── config/                      # Strongly typed environment configuration
│   │   └── index.ts                 # Loads AWS_REGION, BLASTGUARD_MODE, FRONTEND_URL
│   │
│   ├── models/                      # Strongly typed domain models
│   │   ├── Resource.ts              # 10+ AWS resource types, environments, criticality
│   │   ├── Dependency.ts            # HOSTS, DEPENDS_ON, CONNECTS_TO, USES, ROUTES_TO, etc.
│   │   ├── ChangeRequest.ts         # Actions, environments, statuses, DTOs
│   │   ├── TopologyNode.ts          # id, name, type, environment, criticality
│   │   ├── TopologyEdge.ts          # source, target, relationship
│   │   ├── ImpactGraph.ts           # nodes, edges, affectedNodes, criticalNodes, externalNodes
│   │   ├── SecurityFinding.ts       # Security vulnerability finding schema
│   │   ├── PolicyViolation.ts       # Governance rule violation schema
│   │   ├── RiskResult.ts            # Deterministic risk scores & decisions
│   │   ├── AnalysisResult.ts        # Comprehensive analysis container for Person 2
│   │   └── index.ts
│   │
│   ├── providers/                   # Infrastructure abstraction layer
│   │   ├── ResourceProvider.ts      # Core abstraction interface
│   │   ├── MockResourceProvider.ts  # Deterministic 20-resource AWS environment
│   │   ├── AWSResourceProvider.ts   # AWS SDK v3 client implementation
│   │   └── index.ts                 # Provider factory with mock/aws mode switching
│   │
│   ├── services/                    # Business intelligence & lifecycle services
│   │   ├── DependencyAnalysisService.ts # Cycle-safe BFS dependency graph traversal
│   │   ├── TopologyAnalysisService.ts   # Graph generator (affected, critical, external nodes)
│   │   ├── ChangeRequestService.ts      # Change request CRUD & status management
│   │   ├── ImpactService.ts             # Impact orchestrator delegating to Topology Engine
│   │   ├── AnalysisService.ts           # Analysis orchestrator
│   │   └── index.ts
│   │
│   ├── engine/                      # Risk engine contracts (Stage 3 foundation)
│   │   ├── AnalysisEngine.ts        # Analysis engine interface
│   │   └── index.ts
│   │
│   ├── agents/                      # Multi-agent architecture interfaces
│   │   ├── BlastRadiusAgent.ts      # Blast radius agent contract
│   │   ├── SecurityAgent.ts         # Security agent contract
│   │   ├── PolicyAgent.ts           # Policy agent contract
│   │   └── index.ts
│   │
│   ├── routes/                      # Express API route definitions
│   │   ├── healthRoutes.ts          # GET /api/health
│   │   ├── requestRoutes.ts         # /api/requests endpoints
│   │   ├── resourceRoutes.ts        # /api/resources endpoints
│   │   └── index.ts
│   │
│   ├── handlers/                    # API Controllers & AWS Lambda bridge
│   │   ├── healthHandler.ts         # Health check response handler
│   │   ├── requestHandler.ts        # Request CRUD, impact, and analyze handlers
│   │   ├── resourceHandler.ts       # Resource lookup & dependency handlers
│   │   ├── lambda.ts                # AWS Lambda handler (serverless-http)
│   │   └── index.ts
│   │
│   └── utils/                       # Validation, errors, and responses
│       ├── errors.ts                # Standard AppError hierarchy with HTTP codes
│       ├── validation.ts            # Zod schema validation
│       ├── response.ts              # Consistent JSON success & error envelopes
│       ├── logger.ts                # Structured logger
│       └── index.ts
│
└── tests/                           # Vitest automated test suite
    ├── health.test.ts               # Health & discovery endpoint tests
    ├── validation.test.ts           # Input validation & error format tests
    ├── requests.test.ts             # ChangeRequest, Impact, & Analyze tests
    ├── mockProvider.test.ts         # MockResourceProvider topology tests
    ├── stage2.dependencyEngine.test.ts # Cycle prevention & 11/3/2 derivation tests
    └── stage2.api.test.ts           # Resource API & Impact API endpoint tests
```

---

## Mock AWS Environment (20 Resources)

The deterministic mock environment models a production payment processing subsystem alongside an order management subsystem:

| ID | Name | Type | Criticality | Environment | Role / Description |
|---|---|---|---|---|---|
| `vpc-prod` | `vpc-prod` | VPC | HIGH | PRODUCTION | Production primary VPC (10.0.0.0/16) |
| `subnet-07` | `subnet-07` | Subnet | **CRITICAL** | PRODUCTION | **Target demo resource**: Private payment subnet in `ap-south-1` |
| `subnet-08` | `subnet-08` | Subnet | HIGH | PRODUCTION | Private database subnet for order datastores |
| `subnet-public` | `subnet-public` | Subnet | HIGH | PRODUCTION | Ingress public subnet for load balancers |
| `production-load-balancer` | `production-load-balancer` | LoadBalancer | HIGH | PRODUCTION | **External Dependency #1**: Public-facing ALB routing to `payment-api` |
| `payment-security-group` | `payment-security-group` | SecurityGroup | HIGH | PRODUCTION | Firewall rules protecting payment compute workloads |
| `payment-api` | `payment-api` | ECS | **CRITICAL** | PRODUCTION | **Critical Service #1**: Primary payment processing container service |
| `payment-worker` | `payment-worker` | EC2 | **CRITICAL** | PRODUCTION | **Critical Service #2**: EC2 payment reconciliation batch worker |
| `payment-db` | `payment-db` | RDS | HIGH | PRODUCTION | PostgreSQL transactional database storing payment records |
| `payment-notifier` | `payment-notifier` | Lambda | **CRITICAL** | PRODUCTION | **Critical Service #3**: Serverless payment webhook & customer alert dispatcher |
| `payment-data-bucket` | `payment-data-bucket` | S3 | HIGH | PRODUCTION | S3 bucket storing encrypted transaction archives & receipts |
| `iam-payment-role` | `iam-payment-role` | IAM | HIGH | PRODUCTION | IAM execution role assumed by payment workloads |
| `external-payment-gateway` | `external-payment-gateway` | External | HIGH | PRODUCTION | **External Dependency #2**: External banking settlement partner endpoint |
| `order-service` | `order-service` | ECS | HIGH | PRODUCTION | Upstream checkout client service calling `payment-api` |
| `order-db` | `order-db` | RDS | HIGH | PRODUCTION | Database for customer orders (in `subnet-08`) |
| `order-security-group` | `order-security-group` | SecurityGroup | MEDIUM | PRODUCTION | Security group protecting order datastores |
| `order-data-bucket` | `order-data-bucket` | S3 | MEDIUM | PRODUCTION | S3 bucket for purchase orders |
| `iam-order-role` | `iam-order-role` | IAM | HIGH | PRODUCTION | IAM role for order containers |
| `notification-service` | `notification-service` | Lambda | MEDIUM | PRODUCTION | Standalone notification lambda |
| `alb-security-group` | `alb-security-group` | SecurityGroup | HIGH | PRODUCTION | Ingress security group for ALB |

---

## Dependency Engine & Traversal Rules

The dependency engine (`DependencyAnalysisService`) executes graph traversal with:
- **Visited-node tracking** preventing duplicate counting.
- **Safe cycle handling** handling circular dependency paths (e.g. `payment-api` ↔ `payment-notifier`).
- **Boundary-aware propagation** correctly separating container hierarchies and upstream caller subsystems.

### The `DELETE subnet-07` Proof
For `DELETE subnet-07`, the graph traversal naturally derives:
- **11 Affected Resources**: `subnet-07`, `payment-api`, `payment-worker`, `payment-db`, `payment-notifier`, `payment-security-group`, `payment-data-bucket`, `iam-payment-role`, `order-service`, `production-load-balancer`, `external-payment-gateway`.
- **3 Critical Services**: `payment-api` (ECS), `payment-worker` (EC2), `payment-notifier` (Lambda).
- **2 External Dependencies**: `production-load-balancer` (internet-facing ALB), `external-payment-gateway` (partner banking API).

---

## API Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health, mode, uptime, and region |
| `POST` | `/api/requests` | Propose a new infrastructure change request |
| `GET` | `/api/requests` | List all proposed change requests |
| `GET` | `/api/requests/:requestId` | Fetch details of a specific change request |
| `GET` | `/api/requests/:requestId/impact` | Retrieve blast radius topology graph (`affectedNodes`, `criticalNodes`, `externalNodes`) |
| `POST` | `/api/requests/:requestId/analyze` | Trigger infrastructure safety analysis |
| `GET` | `/api/resources/:resourceId` | Fetch resource by ID from provider (404 if absent) |
| `GET` | `/api/resources` | List all 20 resources in the mock environment |
| `GET` | `/api/resources/:resourceId/dependencies` | List direct dependencies for a resource |

---

## Running Locally

```bash
# Install dependencies
npm install

# Run test suite (40 tests passing)
npm test

# Run build
npm run build

# Start local dev server
npm run dev
```

---

## Stage 3 Security & Policy Engine

Stage 3 implements complete deterministic infrastructure intelligence without AI or LLM determination:

1. **Security Analysis (`SecurityAnalysisService`)**:
   - Analyzes real infrastructure conditions: Production environments, critical databases (`payment-db`), network boundaries (`subnet-07`), Security Groups (`payment-security-group`), IAM roles (`iam-payment-role`), public exposure (`production-load-balancer`), and sensitive storage (`payment-data-bucket`).
   - Emits structured `SecurityFinding[]` with `id`, `severity`, `title`, `description`, and `resourceId`.
2. **Policy Engine (`PolicyAnalysisService`)**:
   - **`POLICY-001`**: Production infrastructure changes require approval.
   - **`POLICY-002`**: Critical resources cannot be deleted automatically.
   - **`POLICY-003`**: Resources with critical downstream dependencies require review.
   - **`POLICY-004`**: Changes affecting external dependencies require additional approval.
   - Emits structured `PolicyViolation[]` with `policyId`, `severity`, `message`, and `resourceId`.
3. **Blast Radius Service (`BlastRadiusService`)**:
   - Combines `DependencyAnalysisService`, `ImpactAnalysisService`, `SecurityAnalysisService`, and `PolicyAnalysisService`.
   - Pipeline: `ChangeRequest → ResourceProvider → Dependency analysis → Topology → Security → Impact → Policy → BlastRadius`.
   - Produces `directImpact`, `indirectImpact`, `totalAffected`, `criticalServices`, `externalDependencies`, `productionImpact`, `securityRisk`, and `policyViolations`.

---

## What Stage 4 Should Build On

Stage 3 supplies all deterministic facts, security findings, and policy violations. Stage 4 will build:
1. **Risk Engine (`RiskEngine` / `AnalysisEngine`)**:
   - Synthesize composite deterministic risk scores (0–100) weighting blast radius (`11`), critical compute services (`3`), external attack surfaces (`2`), security risk level (`CRITICAL`), and policy violations (`4`).
   - Deliver definitive `SAFE` / `REVIEW` / `BLOCK` decision enforcement.
2. **AI / Bedrock Remediation Layer (Optional / Final Stage)**:
   - Provide executive summaries and remediation scripts grounded in the deterministic findings.

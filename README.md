# BLASTGUARD

> **“Before you change production, know what will break.”**

BlastGuard is an infrastructure safety system for AWS. An engineer proposes an infrastructure modification such as `DELETE subnet-07`. BlastGuard analyzes what depends on the resource, what downstream workloads could be affected, security implications, policy violations, blast radius, deterministic risk scores, and delivers an authoritative **SAFE / REVIEW / BLOCK** decision before changes hit production.

This repository contains **STAGES 1, 2, 3 & 4: Core Infrastructure Intelligence, Topology Engine, Security & Policy Engine, Deterministic Risk & Decision Engine, and Multi-Agent Architecture**.

---

## Architecture Overview

BlastGuard adheres strictly to the architectural rule: **`API → Service → ResourceProvider → Graph`**. Infrastructure, dependency intelligence, risk scoring, and policy governance are decoupled from presentation routes and handlers.

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
│   │   ├── AnalysisResult.ts        # Finalized Stage 4 contract for Person 2
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
│   │   ├── ImpactAnalysisService.ts     # Impact categorization & metrics
│   │   ├── SecurityAnalysisService.ts   # Deterministic security rules & findings
│   │   ├── PolicyAnalysisService.ts     # Governance policy rules & violations
│   │   ├── BlastRadiusService.ts        # Combined blast radius orchestration
│   │   ├── AnalysisService.ts           # Analysis orchestrator (delegates to SupervisorAgent)
│   │   └── index.ts
│   │
│   ├── engine/                      # Deterministic risk & decision engine
│   │   ├── RiskEngine.ts            # 5-factor weighted risk calculator (0-100)
│   │   ├── DecisionEngine.ts        # SAFE / REVIEW / BLOCK decision maker
│   │   ├── AnalysisEngine.ts        # Unified pipeline coordinator
│   │   └── index.ts
│   │
│   ├── agents/                      # Modular deterministic agent architecture
│   │   ├── SupervisorAgent.ts       # End-to-end pipeline orchestrator
│   │   ├── DependencyAgent.ts       # Discovers dependencies & graph connections
│   │   ├── TopologyAgent.ts         # Computes topology nodes & edges
│   │   ├── SecurityAgent.ts         # Audits security risks & findings
│   │   ├── ImpactAgent.ts           # Evaluates impact scope & critical/external services
│   │   ├── PolicyAgent.ts           # Evaluates governance policies & guardrails
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
└── tests/                           # Vitest automated test suite (51 tests)
    ├── health.test.ts               # Health & discovery endpoint tests
    ├── validation.test.ts           # Input validation & error format tests
    ├── requests.test.ts             # ChangeRequest, Impact, & Analyze tests
    ├── mockProvider.test.ts         # MockResourceProvider topology tests
    ├── stage2.dependencyEngine.test.ts # Cycle prevention & 11/3/2 derivation tests
    ├── stage2.api.test.ts           # Resource API & Impact API endpoint tests
    ├── stage3.securityPolicyBlastRadius.test.ts # Security findings & policy tests
    └── stage4.riskDecisionAgents.test.ts # Risk engine, decision engine, & agent pipeline tests
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

# Run test suite (51 tests passing)
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

## Stage 4 Risk Engine, Decision Engine & Agent Architecture

Stage 4 introduces the deterministic decision-making layer of BlastGuard, converting infrastructure facts into authoritative **SAFE / REVIEW / BLOCK** decisions.

### 1. Risk Engine (`RiskEngine`)
Calculates a normalized 0–100 composite risk score from 5 distinct dimensions:
- **Dependency Risk (0–25 pts)**: Scales with total affected resources and external dependencies (`15 pts` for >= 10 affected + `10 pts` for 2 external dependencies).
- **Criticality Risk (0–25 pts)**: Accounts for target resource criticality and downstream critical compute services (`10 pts` for CRITICAL target + `15 pts` for 3 critical compute services).
- **Security Risk (0–20 pts)**: Evaluates security findings (`CRITICAL` = 15 pts, `HIGH` = 10 pts, `MEDIUM` = 5 pts).
- **Policy Risk (0–20 pts)**: Weighted policy violations (`5 pts` per CRITICAL violation, `2.5 pts` per HIGH violation).
- **Environment Risk (0–10 pts)**: `PRODUCTION` = 7 pts, `STAGING` = 4 pts, `DEV` = 2 pts.

#### The `DELETE subnet-07` Derivation:
$$\text{Risk Score} = 25 (\text{Dependency}) + 25 (\text{Criticality}) + 15 (\text{Security}) + 15 (\text{Policy}) + 7 (\text{Environment}) = \mathbf{87}$$
- **Score**: `87`
- **Severity**: `CRITICAL`
- **Decision**: `BLOCK`
- **Affected Resources**: `11`
- **Critical Services**: `3`
- **External Dependencies**: `2`
- **Risk Breakdown**: `{ dependencyRisk: 25, criticalityRisk: 25, securityRisk: 15, policyRisk: 15, environmentRisk: 7, total: 87 }`

### 2. Decision Engine (`DecisionEngine`)
Determines the operational verdict based on strict safety guardrails:
- **`BLOCK`**:
  - Any **CRITICAL policy violation** triggers an immediate hard `BLOCK`.
  - Any risk score **$\ge 66$** results in a `BLOCK`.
- **`REVIEW`**:
  - Risk score **$31 - 65$** requires manual peer review and sign-off.
- **`SAFE`**:
  - Risk score **$0 - 30$** with zero critical policy violations is classified as safe to proceed.

### 3. Modular Multi-Agent Pipeline
The analysis is coordinated by deterministic, specialized agents:
```
SupervisorAgent
  ├── 1. DependencyAgent  (Discovers full dependency graph via BFS)
  ├── 2. TopologyAgent    (Builds nodes & edges topology)
  ├── 3. SecurityAgent    (Audits infrastructure risks & database boundaries)
  ├── 4. ImpactAgent      (Evaluates blast radius & critical services)
  ├── 5. PolicyAgent      (Evaluates governance guardrails & policies)
  ├── 6. RiskEngine       (Calculates normalized 0-100 risk score & breakdown)
  └── 7. DecisionEngine   (Enforces SAFE / REVIEW / BLOCK decision)
```
*Zero LLM Principle*: No LLM or generative AI is permitted to hallucinate infrastructure state or compute risk scores. All decisions are reproducible, audited, and deterministic.

### 4. Finalized Contract for Person 2
The `POST /api/requests/:requestId/analyze` endpoint outputs the complete `AnalysisResult` contract containing:
- `requestId`, `resourceId`, `riskScore`, `severity`, `decision`
- `affectedResources`, `criticalServices`, `externalDependencies`
- `riskBreakdown`: detailed point attribution
- `reasons`: detailed diagnostic statements explaining the score and decision
- `securityFindings`: structured security audit findings
- `policyViolations`: structured governance policy violations
- `dependencies`: raw dependency relationships
- `topology`: `{ nodes, edges }` for diagram visualization


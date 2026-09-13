/**
 * CareerSync Proctored Course Assessment Question Bank
 * Highly Challenging, Senior/Architect-Level Domain Questions
 * Tailored specifically to the exact curriculum of each course.
 */

export interface QuestionTemplate {
  q: string;
  opts: string[];
  correct: number;
  topic: string;
}

// Helper to shuffle array and return new array + new index of original element
export function shuffleOptions(options: string[], correctIdx: number): { shuffled: string[]; newCorrectIdx: number } {
  const correctText = options[correctIdx];
  const items = [...options];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  const newIdx = items.indexOf(correctText);
  return { shuffled: items, newCorrectIdx: newIdx };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CLOUD ARCHITECTURE & AWS CERTIFIED SOLUTIONS PROFESSIONAL
// ─────────────────────────────────────────────────────────────────────────────
const AWS_CLOUD_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'An enterprise connects 12 VPCs across three AWS regions with on-premises data centers. Direct VPC peering is causing routing table explosion and lacks transitive routing. Which architecture provides centralized routing, transitive packet forwarding, and scalable inspection at the lowest latency?',
    opts: [
      'AWS Transit Gateway peered across regions with centralized inspection VPC running Gateway Load Balancer and security appliances',
      'Full mesh VPC peering connections between all 12 VPCs with static routes in each subnet route table',
      'An EC2 instance configured with IPsec VPN in each VPC connected to an on-premises hardware firewall',
      'AWS Direct Connect Public Virtual Interfaces terminating directly inside private EC2 instances'
    ],
    correct: 0,
    topic: 'AWS Transit Gateway & Multi-VPC Transitive Routing'
  },
  {
    q: 'A healthcare platform requires cross-region active-active disaster recovery for critical medical imagery stored in Amazon S3. The solution must ensure zero data loss (RPO = 0), KMS CMK envelope encryption, and automatic client failover. What configuration satisfies these strict requirements?',
    opts: [
      'S3 Multi-Region Access Points (MRAP) with bidirectional Cross-Region Replication (CRR) and replica KMS customer-managed key re-encryption',
      'S3 Lifecycle rule migrating objects to S3 Glacier Deep Archive in an alternate region every 24 hours',
      'AWS Snowball Edge cluster physically shuttling disks between AWS datacenters monthly',
      'Single-region S3 standard bucket with Amazon CloudFront distribution caching objects without origin replication'
    ],
    correct: 0,
    topic: 'S3 Cross-Region Replication & Multi-Region Access Points'
  },
  {
    q: 'A lead security engineer wants to delegate administrator rights to developers to create IAM roles for their microservices, but must guarantee that developers cannot escalate privileges beyond an approved boundary or tamper with company-wide guardrails. Which mechanism enforces this?',
    opts: [
      'IAM Permissions Boundaries attached to developer-created roles combined with AWS Organizations Service Control Policies (SCPs)',
      'A simple IAM policy granting iam:* with a Resource condition pointing to *',
      'Disabling AWS CloudTrail logging so IAM role mutations are not audited',
      'Statically hardcoding root account credentials in the developer Jenkins pipeline'
    ],
    correct: 0,
    topic: 'IAM Permissions Boundaries & AWS Organizations SCPs'
  },
  {
    q: 'A gaming backend experiences DynamoDB ProvisionedThroughputExceededException during peak tournaments. Metrics show overall consumed RCU/WCU is below 30% of provisioned capacity, but queries for user leaderboard ranks fail. What is the root cause and architectural solution?',
    opts: [
      'Hot partition key due to low cardinality key distribution; resolve by adding a random salt suffix (e.g., date#rand(1, 10)) or using a high-cardinality composite key',
      'DynamoDB table reaching maximum disk size limit; resolve by converting the table to Amazon RDS PostgreSQL',
      'Network packet loss on the DynamoDB global secondary index; resolve by increasing provisioned RCUs by 100x',
      'DynamoDB Streams exhausting the local CPU cache of the host hypervisor'
    ],
    correct: 0,
    topic: 'DynamoDB Partition Key Distribution & Hotspotting'
  },
  {
    q: 'An Amazon Aurora Global Database spans us-east-1 (Primary) and eu-west-1 (Secondary). In the event of an unplanned disaster in us-east-1, what is the fastest failover procedure to achieve minimal RTO and RPO?',
    opts: [
      'Promote the secondary cluster in eu-west-1 using managed failover, which detaches the secondary and transitions it to a standalone read-write cluster with storage-level replication catchup',
      'Restore the database from a night-old S3 manual snapshot into a new standalone MySQL instance',
      'Execute SQL mysqldump command over an open internet public IP from the dead primary',
      'Wait for AWS DNS servers to automatically resurrect the failed region hardware'
    ],
    correct: 0,
    topic: 'Amazon Aurora Global Database Disaster Recovery'
  },
  {
    q: 'A high-frequency serverless payment API using AWS Lambda and Amazon Aurora PostgreSQL experiences severe latency spikes (cold starts up to 4 seconds) when connected to a private VPC. What AWS architectural feature and configuration eliminates this bottleneck?',
    opts: [
      'AWS Hyperplane Elastic Network Interfaces (ENIs) pre-provisioned in the VPC with Lambda Provisioned Concurrency and RDS Proxy connection pooling',
      'Removing all authentication from the API Gateway endpoint',
      'Running Lambda functions in an infinite while-loop to keep the CPU core warm',
      'Allocating only 128 MB memory to the Lambda function to force minimal memory footprint'
    ],
    correct: 0,
    topic: 'Lambda VPC Networking, Provisioned Concurrency & RDS Proxy'
  },
  {
    q: 'In an Amazon ECS Fargate deployment, container tasks suddenly fail during rolling updates. When a new task version begins receiving traffic, previous tasks are terminated immediately before new tasks are fully initialized. What configuration parameter controls this lifecycle behavior?',
    opts: [
      'MinimumHealthyPercent set to 100% and MaximumPercent set to 200% on the ECS service definition, combined with container health checks and ALB deregistration delay',
      'MinimumHealthyPercent set to 0% and MaximumPercent set to 50%',
      'Disabling AWS CloudWatch Container Insights on the ECS cluster',
      'Deleting the Application Load Balancer target group before updating the task definition'
    ],
    correct: 0,
    topic: 'Amazon ECS Rolling Update Lifecycle & Health Checks'
  },
  {
    q: 'A media streaming enterprise needs to protect premium HLS video content served via Amazon CloudFront. The solution must restrict access to authenticated subscribers, support multiple video chunk files (.ts) per video stream without separate authentication requests, and prevent URL sharing. Which method is optimal?',
    opts: [
      'CloudFront Signed Cookies with custom policies scoped to the video path prefix and domain',
      'Individual CloudFront Signed URLs generated for each 2-second .ts video chunk',
      'Embedding database root credentials in the public HTTP query parameters of the video URL',
      'Disabling CloudFront cache entirely and routing all video traffic directly to public S3 buckets'
    ],
    correct: 0,
    topic: 'CloudFront Signed Cookies & Secure Streaming Content'
  },
  {
    q: 'A global fintech service uses Amazon Route 53 to route traffic across active compute clusters in North America, Europe, and Asia. What DNS routing policy combination ensures low-latency routing under normal operation and seamless failover to healthy regions when an entire region goes offline?',
    opts: [
      'Latency-Based Routing with Route 53 Health Checks evaluating Application Load Balancer endpoints and secondary failover records',
      'Simple Routing policy with 10 random IP addresses hardcoded in a single A record',
      'Geolocation routing that permanently blocks any IP outside of the United States',
      'Weighted routing with 0% weight assigned to all secondary clusters'
    ],
    correct: 0,
    topic: 'Route 53 Latency-Based Routing & Automated DNS Failover'
  },
  {
    q: 'How does AWS Key Management Service (KMS) Envelope Encryption protect sensitive high-volume databases without transmitting large data volumes to the KMS API for cryptographic operations?',
    opts: [
      'KMS generates a plaintext Data Encryption Key (DEK) and an encrypted DEK using the Customer Master Key (CMK); the application encrypts the dataset locally with the plaintext DEK, then erases the plaintext DEK from memory and stores the encrypted DEK alongside the ciphertext',
      'KMS receives the entire multi-terabyte database over TLS, encrypts it on hardware security modules (HSMs), and returns the ciphertext in one synchronous HTTP response',
      'KMS uses unencrypted ROT13 character shifting on client-side hard drives',
      'KMS disables encryption entirely when file sizes exceed 4 Kilobytes'
    ],
    correct: 0,
    topic: 'AWS KMS Envelope Encryption & Data Key Lifecycle'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. DEEP LEARNING & LLM SYSTEMS: FROM ZERO TO PRODUCTION
// ─────────────────────────────────────────────────────────────────────────────
const AI_LLM_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In the original scaled dot-product self-attention mechanism (Vaswani et al.), computing the attention matrix softmax(Q * K^T / sqrt(d_k)) * V requires O(N^2) memory bandwidth. How does FlashAttention achieve drastic speedups and linear O(N) GPU memory consumption?',
    opts: [
      'Tiling the inputs into blocks and executing the softmax normalization incrementally in fast GPU SRAM without materializing the large N x N intermediate attention matrix in HBM (High Bandwidth Memory)',
      'Pruning 90% of token embeddings randomly before computing dot products',
      'Replacing matrix multiplication with element-wise vector addition across all attention heads',
      'Converting all floating-point activations into 1-bit boolean flags'
    ],
    correct: 0,
    topic: 'FlashAttention & GPU Memory Hierarchy Optimization'
  },
  {
    q: 'During multi-user LLM inference serving, what causes the memory footprint of the KV-Cache to exceed the model parameter size, and how does PagedAttention (vLLM) resolve fragmentation?',
    opts: [
      'Dynamic sequence lengths cause memory fragmentation due to contiguous allocation; PagedAttention partitions KV-cache tensors into fixed-size virtual blocks mapped to non-contiguous physical DRAM pages',
      'KV-Cache stores the entire training dataset in GPU VRAM during inference',
      'PagedAttention compiles the Python interpreter into C++ assembly to reduce token sizes',
      'KV-Cache duplicates the entire model weights for every active token in the prompt'
    ],
    correct: 0,
    topic: 'KV-Cache Memory Dynamics & PagedAttention (vLLM)'
  },
  {
    q: 'In Low-Rank Adaptation (LoRA) parameter-efficient fine-tuning, why is matrix B initialized to all zeros while matrix A is initialized with random Gaussian values, where delta_W = (alpha / r) * (B * A)?',
    opts: [
      'Ensures delta_W is exactly zero at the start of training so the pre-trained model weights remain unaltered prior to gradient updates',
      'Prevents the GPU CUDA kernels from allocating tensor memory until epoch 2',
      'Forces the model loss to begin at zero to stabilize learning rates',
      'Enables the model to bypass the backpropagation backward pass entirely'
    ],
    correct: 0,
    topic: 'Parameter-Efficient Fine-Tuning (LoRA) Initialization'
  },
  {
    q: 'When optimizing deep Transformer networks with AdamW instead of standard Adam, what fundamental theoretical flaw in weight decay implementation does AdamW correct?',
    opts: [
      'Standard Adam couples weight decay with gradient updates, causing weights with large historical gradients to be regularized less; AdamW decouples weight decay directly from gradient momentum',
      'AdamW replaces adaptive learning rates with static learning rate schedules',
      'Standard Adam cannot calculate second-order momentum on GPUs',
      'AdamW guarantees that the loss function is mathematically convex across all dimensions'
    ],
    correct: 0,
    topic: 'AdamW Optimizer & Decoupled Weight Decay'
  },
  {
    q: 'Why has Bfloat16 (BF16) largely superseded standard FP16 as the preferred floating-point format for training large foundation models on modern GPU/TPU clusters?',
    opts: [
      'BF16 preserves the exact same 8-bit dynamic range exponent as FP32, eliminating the underflow and overflow gradient issues that require complex loss scaling in FP16',
      'BF16 provides 16 bits of mantissa precision, exceeding FP32 precision',
      'BF16 uses half as much memory as 8-bit integer quantization (INT8)',
      'BF16 can be computed on standard 1990s CPU arithmetic logic units without floating point units'
    ],
    correct: 0,
    topic: 'Mixed Precision Formats: BF16 vs FP16 in Foundation Training'
  },
  {
    q: 'What is the core mathematical distinction between Direct Preference Optimization (DPO) and traditional PPO-based Reinforcement Learning from Human Feedback (RLHF)?',
    opts: [
      'DPO analytically parameterizes the reward function directly through the language model policy, optimizing preference loss implicitly without requiring an explicit reward model or complex reinforcement learning loops',
      'DPO requires training three separate reward models simultaneously using Monte Carlo policy gradient search',
      'PPO-RLHF does not require any human preference labels, while DPO requires 100% human-written code',
      'DPO operates strictly without any gradient descent or backpropagation'
    ],
    correct: 0,
    topic: 'Post-Training Alignment: DPO vs PPO-RLHF'
  },
  {
    q: 'In enterprise Retrieval-Augmented Generation (RAG) pipelines using vector databases, what is the primary operational tradeoff between HNSW (Hierarchical Navigable Small World) and IVF-PQ (Inverted File with Product Quantization) index structures?',
    opts: [
      'HNSW provides very high query recall and sub-millisecond search latency at the cost of high RAM memory consumption; IVF-PQ heavily compresses vector embeddings using centroid quantization, saving 80%+ RAM but sacrificing search accuracy',
      'HNSW can only index 1-dimensional scalar numbers, whereas IVF-PQ works with 1024-dimensional vectors',
      'IVF-PQ eliminates the need for vector cosine similarity metrics',
      'HNSW requires queries to be evaluated using manual SQL sequential table scans'
    ],
    correct: 0,
    topic: 'Vector Database Indexing: HNSW vs IVF-PQ Tradeoffs'
  },
  {
    q: 'How does Speculative Decoding accelerate autoregressive LLM inference without altering the output probability distribution of the target model?',
    opts: [
      'A smaller, faster draft model generates K candidate tokens quickly; the large target model verifies all K tokens in a single parallel forward pass, accepting or rejecting tokens via modified rejection sampling',
      'It truncates the context window to 16 tokens regardless of user input',
      'It skips all self-attention layers for every second generated token',
      'It predicts all future tokens simultaneously using linear regression'
    ],
    correct: 0,
    topic: 'Inference Acceleration: Speculative Decoding'
  },
  {
    q: 'During pre-training of an 8B parameter model, training loss suddenly spikes from 2.1 to 14.8 and outputs become repetitive NaN strings. Diagnostic logs show gradient norm exceeded 1200. What is the standard numerical stabilization remedy?',
    opts: [
      'Apply Gradient Clipping (e.g., max_norm = 1.0), roll back to an earlier checkpoint before the divergence, and investigate corrupt tokens in the training dataset shard',
      'Increase the learning rate by 10x to power through the high-loss region',
      'Disable weight decay and remove all layer normalization modules',
      'Convert all network parameters to double-precision 64-bit floats and restart training from scratch'
    ],
    correct: 0,
    topic: 'Gradient Explosions & Training Stability'
  },
  {
    q: 'In PyTorch custom training loops, what occurs if optimizer.zero_grad() is omitted before calling loss.backward() across training steps?',
    opts: [
      'Gradients accumulate additively in the .grad attribute of each parameter across iterations, effectively multiplying the gradient magnitudes and destabilizing convergence',
      'The model parameters are automatically overwritten with random numbers',
      'PyTorch throws a fatal CUDA out of memory runtime exception on the first iteration',
      'The forward pass is executed in reverse chronological order'
    ],
    correct: 0,
    topic: 'PyTorch Autograd & Gradient Accumulation Dynamics'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. FULL STACK NEXT.JS 15, TYPESCRIPT & CLEAN MICROSERVICES
// ─────────────────────────────────────────────────────────────────────────────
const NEXTJS_FULLSTACK_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In Next.js 15 App Router, what security vulnerability can arise if Server Actions are invoked without proper authorization checks, and how does Next.js 15 protect Server Action POST endpoints from Cross-Site Request Forgery (CSRF)?',
    opts: [
      'Server Actions are exposed as public HTTP POST endpoints; Next.js 15 verifies the Origin and Host headers matching the application domain and developers must execute session authorization inside each action',
      'Next.js 15 automatically encrypts all database tables using browser local storage keys',
      'Server Actions can only be invoked by GET requests and are strictly immune to CSRF',
      'Server Actions run in an isolated client-side Web Worker that cannot communicate with databases'
    ],
    correct: 0,
    topic: 'Next.js 15 Server Actions & Security Posture'
  },
  {
    q: 'What is the strict serialization boundary restriction when passing props from a React Server Component (RSC) to a Client Component ("use client") across the wire?',
    opts: [
      'Props must be serializable across JSON/RSC flight payload protocols (primitives, plain objects, arrays, Promises, JSX elements); functions, class instances, and Symbols cannot be passed',
      'Only string primitives under 256 characters can be passed across boundaries',
      'Client components can directly access Node.js process.env and fs modules if passed as props',
      'Props passed to client components are executed as raw SQL queries on the client machine'
    ],
    correct: 0,
    topic: 'React Server Components (RSC) Wire Protocol & Boundaries'
  },
  {
    q: 'In React 18 / 19 concurrent rendering, how does the useTransition hook improve user responsiveness during computationally expensive UI updates (such as filtering 10,000 table rows)?',
    opts: [
      'Marks the state update as a non-blocking transition, allowing urgent user events (like typing or clicking) to interrupt the rendering calculation and keep the main thread responsive',
      'Spawns a dedicated native C++ thread inside the browser to execute parallel GPU rendering',
      'Synchronously blocks the JavaScript event loop until all 10,000 rows are mounted in the DOM',
      'Caches the DOM elements in browser indexedDB to avoid CPU consumption'
    ],
    correct: 0,
    topic: 'React Concurrent Mode & useTransition Architecture'
  },
  {
    q: 'In TypeScript advanced type systems, what is the behavior of distributive conditional types over union types, and how is distribution suppressed?',
    opts: [
      'When a naked generic parameter is checked (T extends U ? X : Y), the condition distributes over union elements: (A | B) extends U => (A extends U) | (B extends U); distribution is prevented by wrapping both sides in tuples: [T] extends [U]',
      'Distributive conditional types convert all union types into standard JavaScript any types',
      'Distribution causes the TypeScript compiler to throw a recursive type error on unions with more than 2 types',
      'Distribution is only supported for boolean primitive types'
    ],
    correct: 0,
    topic: 'TypeScript Distributive Conditional Types & Tuple Wrapping'
  },
  {
    q: 'In Node.js asynchronous architecture (Libuv event loop), what dangerous consequence occurs if intensive recursive microtasks (e.g., process.nextTick() or resolved Promise.resolve().then()) are repeatedly scheduled?',
    opts: [
      'The microtask queue drains completely before the event loop advances to macrotask phases, resulting in event loop starvation where I/O callbacks, timers, and incoming network requests are starved indefinitely',
      'The Node.js garbage collector crashes with a stack overflow exception in V8',
      'The operating system immediately terminates the Node.js process with signal SIGKILL',
      'Node.js transparently offloads the microtasks to external thread pool workers'
    ],
    correct: 0,
    topic: 'Node.js Libuv Event Loop: Microtask Starvation vs I/O'
  },
  {
    q: 'A high-throughput Next.js application running on serverless AWS Lambda connects to a PostgreSQL database. During sudden traffic spikes of 5,000 concurrent invocations, the database crashes with "FATAL: remaining connection slots are reserved for non-replication superuser connections". What is the architectural solution?',
    opts: [
      'Deploy a connection pooler like PgBouncer in transaction pooling mode or AWS RDS Proxy between the serverless functions and PostgreSQL',
      'Increase PostgreSQL max_connections to 500,000 in postgresql.conf',
      'Wrap all database queries in client-side setTimeout loops with random jitter',
      'Store all relational data in temporary browser cookies instead of PostgreSQL'
    ],
    correct: 0,
    topic: 'Serverless PostgreSQL Connection Pooling & PgBouncer'
  },
  {
    q: 'In Next.js Incremental Static Regeneration (ISR), what mechanism enables on-demand revalidation of specific cached data without rebuilding or revalidating the entire website?',
    opts: [
      'Calling revalidateTag() or revalidatePath() inside a Server Action or Route Handler upon receiving webhook events from the CMS/database',
      'Restarting the production Node.js server every 60 seconds using PM2',
      'Adding cache: "no-store" to every database query across all components',
      'Writing static HTML files directly to the client browser cache using Service Workers'
    ],
    correct: 0,
    topic: 'Next.js Incremental Static Regeneration & Tag Revalidation'
  },
  {
    q: 'According to RFC 9110 HTTP Semantics, why is HTTP PUT defined as strictly idempotent while HTTP PATCH is NOT guaranteed to be idempotent?',
    opts: [
      'PUT requires sending the complete replacement representation of the resource, producing identical server states upon repeat executions; PATCH applies partial modifications (e.g., {"$increment": 5}) that yield different states on repetition',
      'PUT cannot modify databases, whereas PATCH has direct write permissions',
      'PATCH requests are cached indefinitely by web browsers, while PUT requests are never cached',
      'PUT is an encrypted protocol, whereas PATCH transmits data in plaintext'
    ],
    correct: 0,
    topic: 'HTTP Protocol Semantics: Idempotence of PUT vs PATCH'
  },
  {
    q: 'What fundamental transport-layer limitation of HTTP/2 over TCP is permanently resolved by HTTP/3 over QUIC in modern microservice communications?',
    opts: [
      'TCP head-of-line blocking; in HTTP/2, a single dropped TCP packet stalls all multiplexed streams until retransmission; HTTP/3 uses UDP-based QUIC where streams are independent and packet loss on one stream does not block others',
      'HTTP/2 cannot transmit JSON payloads larger than 64 Kilobytes',
      'HTTP/3 eliminates the requirement for TLS encryption keys',
      'TCP sockets cannot operate over IPv6 network infrastructure'
    ],
    correct: 0,
    topic: 'HTTP/2 vs HTTP/3 (QUIC): Head-of-Line Blocking'
  },
  {
    q: 'In enterprise single-page and full-stack web applications, what is the most secure token storage pattern to mitigate both Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?',
    opts: [
      'Store the session access token in memory/closure and refresh token in an httpOnly, Secure, SameSite=Strict cookie with rotating refresh tokens and anti-CSRF headers',
      'Store all JWT tokens in browser window.localStorage so JavaScript can access them easily',
      'Store the JWT access token in an unencrypted URL query parameter (?token=...)',
      'Disable authentication tokens and rely solely on client IP address geolocation'
    ],
    correct: 0,
    topic: 'Modern Web Security: Token Architecture & Defense-in-Depth'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTERPRISE DATA MODELING & MODERN SNOWFLAKE ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────
const DATA_ENG_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In Apache Spark or distributed query engines, a join query between a 500M row fact table and a dimension table gets stuck at 99% progress on a single executor task for 2 hours. Spark UI shows 199 tasks completed in 3 seconds, but task 200 processed 200 million rows. What distributed phenomenon has occurred, and how is it resolved?',
    opts: [
      'Data skew on the join key; resolve by adding a random salt (e.g., salt = key + "_" + rand(1, 10)) to the skewed fact table keys and replicating the dimension table across the salted range',
      'Network card hardware failure on the driver node; resolve by restarting the EC2 instance',
      'The metastore cache ran out of memory; resolve by dropping all database indices',
      'The executor CPU clock speed throttled down to 100 MHz due to fan failure'
    ],
    correct: 0,
    topic: 'Distributed Query Optimization: Data Skew & Salting'
  },
  {
    q: 'In Snowflake cloud data warehousing, how does automatic Micro-Partitioning prune data blocks during queries, and when does adding explicit Clustering Keys become counterproductive?',
    opts: [
      'Micro-partitions automatically record min/max metadata for every column to prune unneeded blocks; explicit clustering keys on small tables (<1 TB) or high-churn write workloads incur continuous background re-clustering credit costs without meaningful read gains',
      'Micro-partitions build physical B-Tree indices on hard disks that permanently lock table rows',
      'Clustering keys compress all table data into a single 1-bit boolean flag',
      'Snowflake micro-partitions require manual nightly defragmentation by database administrators'
    ],
    correct: 0,
    topic: 'Snowflake Micro-Partitioning & Clustering Depth Costs'
  },
  {
    q: 'In dimensional data modeling, what is the architectural design and querying implication of a Slowly Changing Dimension Type 2 (SCD Type 2)?',
    opts: [
      'Retains complete historical audit trails by generating a new dimension row with surrogate key, effective_date, end_date, and is_current flag whenever attributes mutate, requiring point-in-time range joins with fact tables',
      'Overwrites existing row values in-place, permanently destroying historical change logs',
      'Creates a new physical database column dynamically for every change event',
      'Disables foreign key constraints on all fact tables permanently'
    ],
    correct: 0,
    topic: 'Dimensional Modeling: Slowly Changing Dimensions (SCD Type 2)'
  },
  {
    q: 'Why are columnar storage formats like Apache Parquet and Apache ORC vastly superior to row-based formats (CSV, JSON) for Online Analytical Processing (OLAP) queries?',
    opts: [
      'Parquet stores data by column, enabling projection pruning (reading only requested columns), dictionary encoding, run-length encoding (RLE), and row-group min/max statistics that skip unneeded data blocks',
      'Parquet files can be updated in-place with single-byte writes without rewriting files',
      'Parquet executes raw SQL queries directly inside CPU L1 cache without decompression',
      'Parquet eliminates the need for RAM in distributed clusters'
    ],
    correct: 0,
    topic: 'Columnar Storage Architecture: Parquet & OLAP Optimization'
  },
  {
    q: 'In modern real-time streaming architectures, what is the key architectural advantage of Log-Based Change Data Capture (CDC) using Debezium and Kafka Connect over Polling-Based CDC (querying WHERE updated_at > timestamp)?',
    opts: [
      'Log-based CDC reads the database write-ahead log (WAL / binlog) directly with sub-second latency, capturing DELETE operations and intermediate states without adding query load to operational database tables',
      'Polling-based CDC is faster and places zero CPU load on operational databases',
      'Log-based CDC can only capture table schemas with fewer than 5 columns',
      'Polling-based CDC can detect deleted rows even without soft-delete tombstone columns'
    ],
    correct: 0,
    topic: 'Change Data Capture (CDC): Log-Based vs Polling Architectures'
  },
  {
    q: 'How do Modern Open Table Formats (Apache Iceberg, Delta Lake, Apache Hudi) achieve full ACID transaction guarantees and time-travel querying on top of cloud object storage (S3 / GCS)?',
    opts: [
      'Maintain an append-only JSON/Avro metadata transaction log that tracks atomic commit manifests and snapshot versions; queries read consistent snapshots and time-travel points to historical manifest states',
      'Acquire distributed hardware mutexes inside AWS S3 datacenters to lock physical hard drives',
      'Store all database tables inside an uncompressed SQLite file hosted in an EC2 instance',
      'Convert cloud object storage buckets into in-memory Redis clusters'
    ],
    correct: 0,
    topic: 'Lakehouse Architecture: ACID Transactions & Iceberg/Delta'
  },
  {
    q: 'In stream processing engines (Apache Flink / Spark Structured Streaming), what is the distinction between Event Time and Processing Time, and why are Watermarks mathematically necessary?',
    opts: [
      'Event Time is when the event occurred on the source device; Watermarks provide a temporal progress metric that bounds how long the engine waits for late-arriving out-of-order events before closing a time window',
      'Processing Time is the timestamp recorded when the IoT sensor was manufactured',
      'Watermarks automatically purge all messages from Kafka topics when network lag occurs',
      'Event Time processing ensures that streaming jobs never encounter network latency'
    ],
    correct: 0,
    topic: 'Stream Processing: Event Time, Processing Time & Watermarks'
  },
  {
    q: 'In distributed query planning, what is the execution difference between a Broadcast Hash Join (BHJ) and a Shuffle Hash Join, and when does BHJ cause an OutOfMemory (OOM) error?',
    opts: [
      'BHJ broadcasts the entire small table to every worker node, avoiding network data shuffling; BHJ causes an OOM error if the broadcast table exceeds the driver or executor memory threshold',
      'BHJ splits both tables across 10,000 network partitions regardless of size',
      'Shuffle Hash Join only functions if the join key contains integer values between 1 and 100',
      'BHJ requires writing all intermediate data to magnetic tape drives'
    ],
    correct: 0,
    topic: 'Distributed Query Plans: Broadcast vs Shuffle Hash Joins'
  },
  {
    q: 'In enterprise data modeling, what is a Conformed Dimension in Kimball methodology, and why is it critical for cross-functional business intelligence?',
    opts: [
      'A shared, consistent dimension (e.g., Date, Customer) that has the exact same schema and meaning across multiple business processes, enabling federated drill-across reporting across multiple fact tables',
      'A dimension table that contains only duplicate primary keys',
      'A temporary database table that is dropped immediately after each SQL query',
      'A dimension that stores data in unencrypted binary format on client mobile devices'
    ],
    correct: 0,
    topic: 'Dimensional Modeling: Conformed Dimensions & Data Bus Matrix'
  },
  {
    q: 'In dbt (data build tool), how does an incremental model strategy work using the is_incremental() macro, and how are schema migrations handled gracefully?',
    opts: [
      'During incremental runs, dbt queries only rows newer than the latest timestamp in the destination table and merges them using unique_key; schema changes can be handled via on_schema_change: "append_new_columns"',
      'dbt deletes the entire production data warehouse and rebuilds it from raw CSV files every 5 minutes',
      'The is_incremental() macro converts all SQL queries into Python pandas scripts',
      'Incremental models cannot be executed on Snowflake or BigQuery'
    ],
    correct: 0,
    topic: 'dbt Incremental Models & Schema Evolution Strategies'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. DOCKER CONTAINERS, KUBERNETES & PRODUCTION CLOUD-NATIVE CI/CD
// ─────────────────────────────────────────────────────────────────────────────
const DOCKER_K8S_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In a multi-tenant Kubernetes cluster, what is the most secure and robust approach to enforce that Pods in the "finance" namespace cannot receive or initiate network traffic with Pods in the "guest" namespace?',
    opts: [
      'Define a Kubernetes NetworkPolicy in the finance namespace with default-deny ingress/egress rules and explicit namespaceSelector / podSelector allow rules',
      'Set replicaCount to 0 for all deployments in the guest namespace',
      'Change the container port in the Dockerfile from 80 to 8080',
      'Add a custom label to the node operating system kernel'
    ],
    correct: 0,
    topic: 'Kubernetes NetworkPolicies & Zero-Trust Pod Isolation'
  },
  {
    q: 'How do Linux kernel cgroups v2 and namespaces work together to create container isolation in Docker and containerd?',
    opts: [
      'Namespaces isolate what a process can SEE (PID, mount points, network interfaces, IPC); cgroups regulate what a process can USE (CPU shares, memory limits, I/O bandwidth, OOM killer triggers)',
      'Namespaces manage CPU clock frequency, while cgroups encrypt hard drive storage',
      'cgroups duplicate the guest Linux kernel, while namespaces manage BIOS initialization',
      'Namespaces and cgroups are hypervisor hardware emulation modules implemented in motherboard firmware'
    ],
    correct: 0,
    topic: 'Linux Kernel Fundamentals: Namespaces vs cgroups v2'
  },
  {
    q: 'Why should enterprise Docker images for production microservices always be built using multi-stage builds and distroless or Alpine scratch base images?',
    opts: [
      'Separates compilers, build SDKs, and intermediate files from the runtime image, drastically reducing image size, speeding up pull times, and minimizing the CVE vulnerability attack surface',
      'Forces the build to execute on multiple cloud regions concurrently to bypass rate limits',
      'Enables running Windows .exe binaries directly on ARM64 Linux without virtualization',
      'Bypasses all mandatory corporate security scans and static analysis checks'
    ],
    correct: 0,
    topic: 'Multi-Stage Docker Builds & Minimal Attack Surfaces'
  },
  {
    q: 'During cluster maintenance or node drain operations in Kubernetes, what resource object guarantees that a microservice maintains a minimum quorum of running pods to prevent service disruption?',
    opts: [
      'PodDisruptionBudget (PDB) specifying minAvailable or maxUnavailable tolerances evaluated by the eviction API during node drains',
      'ConfigMap containing a list of node IP addresses',
      'HorizontalPodAutoscaler with targetCPUUtilizationPercentage set to 100%',
      'Setting the container image pullPolicy to Always'
    ],
    correct: 0,
    topic: 'Kubernetes PodDisruptionBudget (PDB) & Graceful Node Drain'
  },
  {
    q: 'What is the architectural distinction between Ingress Controller TLS termination and a Service Mesh (e.g., Istio / Linkerd) Mutual TLS (mTLS) implementation?',
    opts: [
      'Ingress TLS terminates external client encryption at the cluster perimeter, leaving internal pod-to-pod traffic in plaintext; mTLS service meshes inject Envoy sidecars to cryptographically verify and encrypt all internal pod-to-pod traffic',
      'Ingress TLS can only encrypt UDP packets, while mTLS encrypts HTTP GET requests',
      'Service meshes require hardware cryptographic smart cards inserted into every worker node',
      'Ingress controllers permanently decrypt all traffic and store credentials in unencrypted log files'
    ],
    correct: 0,
    topic: 'Cloud-Native Security: Ingress TLS vs Service Mesh mTLS'
  },
  {
    q: 'A Helm chart release upgrade fails midway because a pre-install database migration hook container crashed with an exit code 1. What Helm command flag ensures the deployment automatically rolls back to the previous healthy revision?',
    opts: [
      'helm upgrade --atomic --timeout 5m (which monitors health and automatically rolls back changes upon failure)',
      'helm delete --all --force',
      'helm rollback --skip-crds --no-hooks',
      'helm install --dry-run'
    ],
    correct: 0,
    topic: 'Helm Release Management: Atomic Upgrades & Rollbacks'
  },
  {
    q: 'In a GitOps continuous delivery model using ArgoCD or Flux, what occurs when an engineer manually edits a Kubernetes Deployment in production using "kubectl edit" or "kubectl scale"?',
    opts: [
      'The GitOps controller detects configuration drift between the live cluster state and the Git source of truth; if self-heal is enabled, it automatically overrides manual changes to match Git',
      'The Git repository is automatically updated with the engineer\'s local shell history',
      'The entire Kubernetes cluster shuts down to prevent security breaches',
      'The GitOps controller triggers an automated Slack message and deletes all cluster secrets'
    ],
    correct: 0,
    topic: 'GitOps Reconciliation & Automated Configuration Drift Remediation'
  },
  {
    q: 'What dangerous operational phenomenon known as "HPA Flapping" (thrashing) occurs when Horizontal Pod Autoscaler is configured improperly, and how does the stabilization window mitigate it?',
    opts: [
      'Rapid oscillations where pods scale up on traffic bursts and immediately scale down, causing pod thrashing and cold starts; stabilizationWindowSeconds restricts scale-down velocity by evaluating historical metrics over a cooling period',
      'HPA flapping causes network routers to flood the internet with duplicate BGP announcements',
      'HPA flapping occurs when pod names contain uppercase letters',
      'Stabilization windows force all pods to reboot every 10 seconds'
    ],
    correct: 0,
    topic: 'Kubernetes HPA Flapping & Scale-Down Stabilization Windows'
  },
  {
    q: 'A production container on a Kubernetes worker node consumes 100% disk space in /var/lib/docker/overlay2, crashing the node. Investigation shows the application wrote 50 GB of temporary logs directly to stdout/stderr. What container best practice prevents this failure?',
    opts: [
      'Configure log rotation limits in the container runtime daemon (max-size, max-file) or mount an emptyDir volume with sizeLimit for ephemeral scratch data',
      'Disable application logging completely in production',
      'Increase the node root volume to 100 Terabytes every weekend',
      'Execute chmod 000 on the entire /var directory inside the container'
    ],
    correct: 0,
    topic: 'Container Storage: Overlay2 Disk Exhaustion & Logging Limits'
  },
  {
    q: 'Under Linux container security hardening standards, which set of securityContext settings represents the highest level of least-privilege containment for a Kubernetes Pod?',
    opts: [
      'runAsNonRoot: true, runAsUser: 10001, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false, capabilities: { drop: ["ALL"] }',
      'privileged: true, runAsUser: 0, capabilities: { add: ["SYS_ADMIN"] }',
      'hostNetwork: true, hostPID: true, hostIPC: true',
      'readOnlyRootFilesystem: false, allowPrivilegeEscalation: true'
    ],
    correct: 0,
    topic: 'Kubernetes SecurityContext & Least-Privilege Pod Hardening'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. DIGITAL VLSI DESIGN WITH SYSTEMVERILOG & UVM VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────
const VLSI_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In Static Timing Analysis (STA) of synchronous digital circuits, why can setup time violations be fixed by decreasing clock frequency (increasing clock period T_clk), whereas hold time violations cannot be fixed by altering clock frequency?',
    opts: [
      'Setup time depends on clock period: T_clk >= T_cq + T_comb_max + T_setup - T_skew; hold time depends strictly on datapath delay: T_cq + T_comb_min >= T_hold + T_skew, which is completely independent of T_clk',
      'Hold time violations only occur in dynamic asynchronous circuits, while setup violations occur in static gates',
      'Decreasing clock frequency increases wire resistance, which automatically fixes setup violations',
      'Hold time violations can only be fixed by reducing the supply voltage to zero'
    ],
    correct: 0,
    topic: 'Static Timing Analysis (STA): Setup vs Hold Timing Mathematics'
  },
  {
    q: 'When transferring multi-bit data across asynchronous clock domains (Clock Domain Crossing - CDC), why is a simple multi-bit two-flip-flop synchronizer strictly prohibited?',
    opts: [
      'Bus bits experience unequal routing delays and skew; destination flip-flops sample bits on different clock edges, capturing invalid intermediate transitional data; asynchronous FIFOs with Gray-coded pointers must be used',
      'Two-flip-flop synchronizers double the supply voltage of the destination domain, causing gate-oxide breakdown',
      'Multi-bit synchronizers cause destructive acoustic resonance in quartz crystal oscillators',
      'CMOS flip-flops cannot physically synchronize signals with frequencies above 1 MHz'
    ],
    correct: 0,
    topic: 'Clock Domain Crossing (CDC): Multi-Bit Metastability & Gray Code'
  },
  {
    q: 'In SystemVerilog UVM (Universal Verification Methodology) testbenches, what is the critical architectural execution difference between the build_phase and the connect_phase?',
    opts: [
      'build_phase executes top-down in zero simulation time to instantiate component hierarchies; connect_phase executes bottom-up to interconnect TLM ports, exports, and interfaces',
      'build_phase consumes real simulation clock ticks, while connect_phase is a purely static compile-time directive',
      'build_phase generates randomized transaction stimulus, while connect_phase compiles Verilog into netlists',
      'build_phase runs exclusively inside the scoreboard, while connect_phase runs in the driver'
    ],
    correct: 0,
    topic: 'UVM Phase Execution: build_phase vs connect_phase'
  },
  {
    q: 'In deep sub-micron FinFET and Gate-All-Around (GAA) silicon processes (< 7nm), which leakage mechanism dominates static power dissipation when transistors are in the OFF state?',
    opts: [
      'Sub-threshold leakage current caused by short-channel drain-induced barrier lowering (DIBL) and gate-oxide quantum mechanical tunneling leakage',
      'Dynamic capacitive switching power (0.5 * C * V^2 * f) of internal node capacitances',
      'Inductive wire bonding skin-effect dissipation',
      'Cosmic ray alpha particle ionization in the silicon wafer bulk'
    ],
    correct: 0,
    topic: 'Deep Submicron Power: Sub-Threshold & Gate Leakage Physics'
  },
  {
    q: 'In Verilog / SystemVerilog RTL design, why does an incomplete conditional statement (e.g., an if-else without a final else, or a case statement without default) inside a combinational always @(*) block cause severe synthesis bugs?',
    opts: [
      'The synthesis tool infers unwanted transparent latches to preserve previous state for unspecified conditions, causing timing closure failures, race conditions, and glitches',
      'The synthesis tool refuses to compile and halts with an unrecoverable syntax error',
      'It forces the synthesized gates to draw zero dynamic switching power',
      'It causes flip-flops to permanently invert their Q and Q_bar outputs'
    ],
    correct: 0,
    topic: 'RTL Synthesis: Inferred Transparent Latches & Combinational Logic'
  },
  {
    q: 'In Design for Testability (DFT), what is the primary objective of Automatic Test Pattern Generation (ATPG) and scan chain insertion?',
    opts: [
      'Convert internal sequential flip-flops into shift registers during test mode to achieve high controllability and observability of internal silicon nodes for manufacturing defect detection (stuck-at faults)',
      'Increase the functional operating frequency of the processor core by 25%',
      'Compress the physical die size by removing redundant metal interconnect layers',
      'Encrypt the proprietary RTL bitstream before programming onto commercial FPGAs'
    ],
    correct: 0,
    topic: 'Design for Testability (DFT): Scan Chains & ATPG Fault Coverage'
  },
  {
    q: 'In high-speed clock tree synthesis (CTS), under what condition can negative clock skew cause a catastrophic hold time violation that bricks an ASIC?',
    opts: [
      'Negative skew occurs when the capture flip-flop receives the clock edge earlier than the launch flip-flop; if data propagation delay is shorter than hold time plus skew, new data overwrites existing data before capture',
      'When the clock frequency exceeds the speed of light in silicon',
      'When all flip-flops in the clock tree are replaced with combinatorial XOR gates',
      'Negative clock skew only occurs in optical quantum computing chips'
    ],
    correct: 0,
    topic: 'Clock Tree Synthesis: Negative Clock Skew & Fast-Path Hold Violations'
  },
  {
    q: 'In SystemVerilog verification, why does achieving 100% code coverage (line, branch, condition) NOT guarantee that an RTL IP block is free of critical design bugs?',
    opts: [
      'Code coverage only measures which lines of code executed; it does not verify whether design intent was satisfied, whether corner-case state combinations were tested, or if the scoreboard caught erroneous outputs; functional coverage (covergroups) is required',
      'Code coverage tools have a 50% random error margin in simulation output',
      'Code coverage only measures physical silicon temperature during synthesis',
      'Line coverage cannot analyze Verilog module port declarations'
    ],
    correct: 0,
    topic: 'Verification Metrics: Code Coverage vs Functional Covergroups'
  },
  {
    q: 'In flip-flop metastability analysis, how does the Mean Time Between Failures (MTBF) equation MTBF = exp(T_resolve / tau) / (T_window * f_clk * f_data) mathematically explain the necessity of multi-stage synchronizers?',
    opts: [
      'Adding synchronizer stages exponentially increases the settling time T_resolve allowed for the flip-flop to exit the metastable state, exponentially increasing MTBF to thousands of years',
      'Multi-stage synchronizers decrease the clock frequency f_clk to zero',
      'Each added flip-flop eliminates thermal noise from the silicon substrate completely',
      'Synchronizers force the data signal to bypass the flip-flop input gates'
    ],
    correct: 0,
    topic: 'Metastability MTBF Formula & Multi-Stage Synchronizer Mathematics'
  },
  {
    q: 'In SystemVerilog Assertions (SVA), what is the functional difference between the overlapping implication operator (|->) and the non-overlapping implication operator (|=>)?',
    opts: [
      '|-> evaluates the consequent in the EXACT same clock cycle where the antecedent matches; |=> evaluates the consequent in the IMMEDIATELY FOLLOWING clock cycle (1 cycle delay)',
      '|-> evaluates assertions in zero simulation time, while |=> halts the simulation permanently',
      '|=> can only be used with asynchronous reset signals, while |-> is for synchronous clocks',
      'There is no difference; they are exact syntactic aliases in the IEEE 1800-2017 standard'
    ],
    correct: 0,
    topic: 'SystemVerilog Assertions (SVA): Overlapping vs Non-Overlapping Implication'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. EMBEDDED SYSTEMS FIRMWARE & INDUSTRIAL EDGE IOT DEVELOPMENT
// ─────────────────────────────────────────────────────────────────────────────
const EMBEDDED_IOT_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In a real-time multitasking system (FreeRTOS) on an ARM Cortex-M4, Task A (Priority 3) and Task B (Priority 1) share a hardware sensor mutex. Medium Task C (Priority 2) interrupts Task B while Task B holds the mutex, causing Priority Inversion. How does FreeRTOS prevent Task A from being starved?',
    opts: [
      'Priority Inheritance Protocol: the mutex temporarily elevates the priority of Task B (holding the lock) to Priority 3 (matching Task A) until Task B releases the mutex',
      'FreeRTOS disables all global hardware interrupts permanently',
      'Task A is forcibly terminated and restarted from main()',
      'The operating system replaces the mutex with a volatile while-loop spinlock'
    ],
    correct: 0,
    topic: 'RTOS Priority Inversion & Priority Inheritance Protocol'
  },
  {
    q: 'An I2C bus communicating with an IMU sensor at 400 kHz Fast-Mode exhibits rounded rising edges and intermittent NACK responses on the oscilloscope. What is the root cause and hardware resolution?',
    opts: [
      'Pull-up resistor values are too large relative to the total bus line capacitance, making the RC time constant too slow for 400 kHz; replace pull-ups with lower resistance values (e.g., 2.2 kOhm instead of 10 kOhm)',
      'The master microcontroller clock speed is too low for the pull-up resistance',
      'The I2C slave address parity bit is inverted in firmware',
      'The SDA line requires a 100 uF electrolytic capacitor connected directly to ground'
    ],
    correct: 0,
    topic: 'I2C Signal Integrity, Bus Capacitance & Pull-Up Calculation'
  },
  {
    q: 'When writing an Interrupt Service Routine (ISR) on an ARM Cortex-M architecture, which programming practice is strictly forbidden to ensure real-time determinism and prevent kernel deadlocks?',
    opts: [
      'Executing blocking delays, performing dynamic memory allocation (malloc/free), or invoking non-ISR-safe RTOS API calls (e.g., xQueueSend instead of xQueueSendFromISR)',
      'Clearing the interrupt pending flag in the NVIC register',
      'Setting a volatile boolean flag to notify a background worker task',
      'Reading a 32-bit hardware peripheral data register'
    ],
    correct: 0,
    topic: 'ARM Cortex-M NVIC Interrupt Service Routine Constraints'
  },
  {
    q: 'Why is Direct Memory Access (DMA) circular buffer mode preferred over CPU interrupt-driven polling when streaming high-speed ADC sensor data at 2 MSPS to SRAM?',
    opts: [
      'DMA transfers data directly between peripheral and memory buses without CPU instruction intervention, avoiding CPU thrashing and context switching overhead at 2 MHz',
      'DMA doubles the physical clock frequency of the analog-to-digital converter hardware',
      'DMA automatically encrypts sensor samples using AES-256 in silicon',
      'DMA converts full-duplex communication to half-duplex to reduce electromagnetic interference'
    ],
    correct: 0,
    topic: 'Direct Memory Access (DMA) Circular Buffering & Bus Throughput'
  },
  {
    q: 'What is the purpose of an Independent Watchdog Timer (IWDG) in mission-critical embedded IoT nodes, and why must its clock source be separate from the main system oscillator?',
    opts: [
      'The IWDG is clocked by an internal dedicated low-speed RC oscillator (LSI) so that even if the main high-speed crystal oscillator (HSE) fails or freezes in deadlock, the watchdog resets the MCU',
      'The IWDG monitors battery temperature and regulates solar panel charging current',
      'The IWDG generates precision PWM pulses for brushless DC motor commutations',
      'The IWDG calibrates internal flash memory timing during firmware updates'
    ],
    correct: 0,
    topic: 'Independent Watchdog (IWDG) & Fail-Safe Oscillator Architecture'
  },
  {
    q: 'In Controller Area Network (CAN 2.0B) automotive and industrial bus communication, how does the physical layer resolve collisions between two nodes transmitting simultaneously without losing any data frames?',
    opts: [
      'Non-destructive bitwise arbitration: dominant bits (logical 0, driven differential voltage) overwrite recessive bits (logical 1); the node transmitting recessive reads dominant, detects arbitration loss, and ceases transmission gracefully',
      'Carrier Sense Multiple Access with Collision Detection (CSMA/CD) similar to Ethernet backoff',
      'A centralized master node continuously polls each slave node in round-robin fashion',
      'Both nodes detect collision, corrupt the frame CRC, and trigger an immediate bus-off shutdown'
    ],
    correct: 0,
    topic: 'CAN Bus Physical Layer & Non-Destructive Bitwise Arbitration'
  },
  {
    q: 'In ultra-low-power battery-operated IoT sensor nodes, how does Stop/Sleep mode conserve micro-amperes while preserving system state, and what peripheral wakes it up periodically?',
    opts: [
      'Shuts down the main CPU core and high-frequency PLL while retaining SRAM contents and register states; woken up periodically by the low-power Real-Time Clock (RTC) or external GPIO pin interrupts',
      'Discharges the battery through a low-resistance shunt resistor to ground',
      'Continuously executes a while(1) NOP loop at 168 MHz overclocked frequency',
      'Overwrites the firmware flash memory with all zeros until external power is cycled'
    ],
    correct: 0,
    topic: 'Low-Power Embedded Architecture: Sleep Modes & RTC Wakeup'
  },
  {
    q: 'When implementing an embedded flash wear-leveling algorithm for logging telemetry data to NOR Flash with a 100,000-cycle endurance limit, why is in-place rewriting prohibited?',
    opts: [
      'NOR Flash cells can only be programmed from 1 to 0 bitwise; transitioning 0 back to 1 requires erasing an entire multi-kilobyte sector; repeated sector erasures in the same block burn out silicon oxide layers',
      'Writing to NOR flash requires cooling the microcontroller with liquid nitrogen',
      'NOR Flash sectors automatically corrupt adjacent RAM memory if written twice',
      'In-place writing triggers an unhandled hard fault interrupt on Cortex-M processors'
    ],
    correct: 0,
    topic: 'NOR Flash Memory Physics, Erase Blocks & Wear Leveling'
  },
  {
    q: 'In embedded C programming, why is declaring a memory-mapped hardware peripheral register pointer without the "volatile" keyword a fatal bug?',
    opts: [
      'The C compiler optimizer assumes the variable does not change outside the local code flow and caches the value in a CPU register, ignoring real-time hardware status changes on the peripheral register',
      'The compiler refuses to compile and outputs a syntax error',
      'The pointer is automatically relocated to read-only flash memory at runtime',
      'Omitting volatile causes the microprocessor to run at half voltage'
    ],
    correct: 0,
    topic: 'Embedded C: Memory-Mapped I/O & The Volatile Qualifier'
  },
  {
    q: 'How does an embedded engineer detect a stack overflow in a FreeRTOS task, and what hardware feature in ARM Cortex-M processors catches unauthorized memory access instantly?',
    opts: [
      'FreeRTOS stack watermarking and uxTaskGetStackHighWaterMark() check canary words at stack boundaries; ARM Memory Protection Unit (MPU) triggers a MemManage Fault upon out-of-bounds stack writes',
      'FreeRTOS logs an unformatted error message to the client browser console',
      'The microcontroller automatically increases physical SRAM capacity via virtual memory swap',
      'Stack overflows are mathematically impossible in C and C++ programs'
    ],
    correct: 0,
    topic: 'Embedded Stack Overflow Detection & ARM MPU Fault Trapping'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 8. AUTONOMOUS ROBOTICS, ROS2 & INDUSTRIAL CONTROL SYSTEMS
// ─────────────────────────────────────────────────────────────────────────────
const ROBOTICS_ROS2_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In ROS 2 (Robot Operating System 2) utilizing the DDS (Data Distribution Service) middleware, what Quality of Service (QoS) profile configuration is optimal for high-frequency (100 Hz) LiDAR sensor point cloud topics where low latency is critical and dropped frames are tolerable?',
    opts: [
      'Reliability: Best Effort, Durability: Volatile, History: Keep Last (depth = 1)',
      'Reliability: Reliable, Durability: Transient Local, History: Keep All',
      'Reliability: Reliable with infinite retransmission queue depth',
      'Durability: Persistent with disk synchronization on every message'
    ],
    correct: 0,
    topic: 'ROS 2 DDS Quality of Service (QoS) Profiles for Sensors'
  },
  {
    q: 'In robot manipulator kinematics, what is a kinematic singularity, and what happens mathematically to the Inverse Kinematics solution when the arm reaches a singular configuration?',
    opts: [
      'The manipulator Jacobian matrix loses full rank (its determinant approaches zero), causing inverse Jacobian calculations to demand infinite joint velocities for finite Cartesian end-effector velocities',
      'The robot manipulator loses power and all motors disengage their brakes',
      'The joint encoders reverse their optical polarity, reading negative angles',
      'The forward kinematics equations become non-differentiable linear functions'
    ],
    correct: 0,
    topic: 'Robot Kinematics: Singularities & Jacobian Determinants'
  },
  {
    q: 'When fusing IMU accelerometer/gyroscope data with wheel odometry for an autonomous mobile robot (AMR), why is an Extended Kalman Filter (EKF) preferred over a standard linear Kalman Filter?',
    opts: [
      'Mobile robot kinematic motion models and trigonometric heading orientations (theta) are inherently non-linear; the EKF linearizes non-linear state transitions around the current estimate via Taylor series expansion',
      'Linear Kalman Filters can only operate on 1-dimensional temperature data',
      'The EKF eliminates the need for sensor measurement covariance matrices',
      'The standard Kalman Filter cannot run on 64-bit microprocessors'
    ],
    correct: 0,
    topic: 'Sensor Fusion: Extended Kalman Filter (EKF) vs Linear KF'
  },
  {
    q: 'In visual or LiDAR-based Simultaneous Localization and Mapping (SLAM), what is the role of Loop Closure Detection, and how does Pose Graph Optimization eliminate accumulated odometric drift?',
    opts: [
      'Recognizes previously visited locations and creates non-sequential constraints in the pose graph; non-linear least squares optimization redistributes accumulated trajectory drift across all intermediate poses',
      'Directly resets the robot position back to (0,0,0) coordinate origin upon detecting a wall',
      'Deletes the existing occupancy grid map and restarts mapping from scratch',
      'Calculates the robot motor temperature to adjust wheel friction coefficients'
    ],
    correct: 0,
    topic: 'SLAM: Loop Closure Detection & Pose Graph Optimization'
  },
  {
    q: 'In ROS 2 transform library (TF2), what is the consequence of publishing coordinate transforms without synchronized header timestamps, and how does the lookup_transform() timeout parameter prevent extrapolation errors?',
    opts: [
      'TF2 cannot interpolate non-timestamped transforms, throwing ExtrapolationException; the timeout parameter allows lookup_transform to block and wait for newer transform messages to populate the buffer',
      'The robot motors will immediately reverse direction at maximum torque',
      'Non-timestamped transforms cause the DDS network socket to close permanently',
      'TF2 automatically compiles the coordinate frames into a static C++ binary'
    ],
    correct: 0,
    topic: 'ROS 2 TF2 Coordinate Transform Trees & Interpolation Buffers'
  },
  {
    q: 'In precision industrial robotic joint motor control, what dangerous control anomaly occurs when actuator saturation (reaching maximum motor voltage/torque) coincides with an active integral term, and how does Anti-Windup resolve it?',
    opts: [
      'Integral Windup: error accumulates in the integrator while the motor is saturated, causing massive overshoot and prolonged oscillation after the setpoint is reached; Anti-Windup clamps integration when actuators saturate',
      'Derivative Kick: the D-term causes the motor shaft to shear off mechanically',
      'Proportional Decay: the P-gain drops to zero permanently upon motor heating',
      'Integral Windup causes the encoder wires to transmit inverted quadrature pulses'
    ],
    correct: 0,
    topic: 'Closed-Loop Motor Control: PID Integral Windup & Anti-Windup Clamping'
  },
  {
    q: 'In Programmable Logic Controllers (PLCs) controlling automated manufacturing cells, how does the deterministic cyclic scan execution model (Input Scan -> Logic Solve -> Output Update) prevent race conditions compared to asynchronous multithreaded systems?',
    opts: [
      'Physical input states are latched into a process image memory table at the start of each scan, logic executes sequentially on static images, and physical outputs update simultaneously at scan completion',
      'PLCs do not use memory and execute logic directly on physical copper relays',
      'The PLC executes all ladder logic rungs concurrently using asynchronous GPU shaders',
      'Inputs and outputs are updated continuously at 1 GHz without any synchronization cycle'
    ],
    correct: 0,
    topic: 'Industrial Automation: PLC Deterministic Cyclic Scan Architecture'
  },
  {
    q: 'In 3D LiDAR point cloud processing for autonomous vehicles, why is a Voxel Grid filter applied before executing Generalized Iterative Closest Point (GICP) registration?',
    opts: [
      'Downsamples massive point clouds into uniform 3D spatial grids, drastically reducing point cardinality while preserving surface geometry and enabling real-time GICP convergence',
      'Colorizes the grayscale LiDAR points using AI diffusion models',
      'Converts 3D point coordinates into 2D JPEG images for compression',
      'Rotates the coordinate frame by 90 degrees to align with GPS satellites'
    ],
    correct: 0,
    topic: 'LiDAR Point Cloud Processing: Voxel Grid Downsampling & GICP'
  },
  {
    q: 'In autonomous navigation stacks (Nav2), what is the difference between Global Path Planning (e.g., Dijkstra / A*) and Local Trajectory Planning (e.g., DWA / TEB Local Planner)?',
    opts: [
      'Global planners compute an optimal static path across the pre-mapped global costmap; Local planners evaluate robot kinematic/dynamic constraints to generate collision-free velocity commands (vx, vy, omega) around dynamic obstacles in real time',
      'Global planners control individual wheel motor PWM voltages directly',
      'Local planners can only plan paths on flat 2D lines with zero velocity',
      'Global planners execute at 1000 Hz, while local planners execute once per hour'
    ],
    correct: 0,
    topic: 'Autonomous Navigation (Nav2): Global vs Local Planners'
  },
  {
    q: 'Under ISO 13849-1 and IEC 62061 industrial robotics functional safety standards, what architectural requirement distinguishes a Performance Level e (PL e) / SIL 3 safety circuit from standard control circuits?',
    opts: [
      'Redundant dual-channel architecture with cross-monitoring (Category 4), ensuring that a single component failure cannot lead to the loss of the safety function and is detected at or before the next safety demand',
      'Using double-insulated green wires for all 24V DC sensor connections',
      'Installing emergency stop pushbuttons that require a password to reset',
      'Running the robot control software inside an unverified open-source Docker container'
    ],
    correct: 0,
    topic: 'Industrial Safety Standards: ISO 13849-1 Category 4 & PL e Architecture'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 9. ELECTRIC VEHICLE POWERTRAIN ENGINEERING, BMS & MOTOR DRIVES
// ─────────────────────────────────────────────────────────────────────────────
const EV_POWERTRAIN_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In electric vehicle traction inverters utilizing Field-Oriented Control (FOC) for Permanent Magnet Synchronous Motors (PMSM), how does the Clarke and Park transformation mathematically decouple stator current?',
    opts: [
      'Transforms 3-phase AC currents into a 2-phase rotating d-q reference frame where the d-axis independently controls rotor magnetic flux (field weakening) and the q-axis controls electromagnetic torque',
      'Converts 400V DC battery voltage directly into 12-phase alternating current without PWM switching',
      'Transforms rotor mechanical speed into battery state-of-charge percentages',
      'Eliminates the requirement for inverter semiconductor switches (IGBTs/MOSFETs)'
    ],
    correct: 0,
    topic: 'Field-Oriented Control (FOC): Clarke & Park Transformations in EV PMSM'
  },
  {
    q: 'Why is Space Vector Pulse Width Modulation (SVPWM) universally preferred over standard Sinusoidal PWM (SPWM) in high-efficiency EV traction motor inverters?',
    opts: [
      'SVPWM increases the maximum fundamental output voltage by approximately 15.5% (utilizing up to Vdc / sqrt(3)) for the same DC link bus voltage while significantly reducing harmonic current distortion',
      'SVPWM eliminates the need for permanent magnets inside the traction motor',
      'SVPWM converts battery DC power directly into mechanical wheel rotation without coils',
      'SVPWM reduces total battery capacity requirements by 50% via resonance'
    ],
    correct: 0,
    topic: 'Space Vector PWM (SVPWM) vs SPWM: DC Bus Utilization'
  },
  {
    q: 'In a Battery Management System (BMS), why is simple Coulomb Counting insufficient for long-term State of Charge (SoC) estimation, and what state estimation algorithm corrects its cumulative drift?',
    opts: [
      'Coulomb counting integrates current sensor bias errors and drift over time without bounded convergence; an Extended Kalman Filter (EKF) fuses battery Open Circuit Voltage (OCV) models to correct estimation',
      'Coulomb counting only functions when the battery is completely discharged to 0V',
      'Coulomb counting causes electrical short circuits inside lithium-ion cathode layers',
      'Coulomb counting cannot measure current due to motor electromagnetic interference'
    ],
    correct: 0,
    topic: 'BMS State of Charge (SoC) Estimation & Extended Kalman Filters'
  },
  {
    q: 'What is the exact physical and chemical chain reaction sequence that constitutes catastrophic Lithium-ion battery Thermal Runaway?',
    opts: [
      'Solid Electrolyte Interphase (SEI) layer breakdown (~80-120°C) -> Anode reaction with electrolyte -> Separator melting & internal short circuit (~130-170°C) -> Cathode decomposition with rapid O2 release -> Violent self-sustaining exothermic combustion',
      'Cathode melting -> Condensation of hydrogen gas -> Solidification of electrolyte -> Freezing of the pack',
      'Reverse polarity charging -> Spontaneous nuclear fusion of lithium atoms -> Complete vaporization without heat',
      'Electrolyte evaporation -> Voltage spikes to 10,000V -> Microwave radiation emission'
    ],
    correct: 0,
    topic: 'Battery Chemistry: Thermal Runaway Sequence & Mechanisms'
  },
  {
    q: 'What is the operational and efficiency tradeoff between Active Cell Balancing and Passive Cell Balancing in an 800V EV battery pack?',
    opts: [
      'Passive balancing dissipates excess energy from higher-voltage cells as waste heat through bleed resistors (simple, low-cost, inefficient); Active balancing redistributes charge to weaker cells using capacitive/inductive DC-DC converters (high efficiency, complex, expensive)',
      'Passive balancing requires liquid nitrogen cooling, while active balancing operates at ambient temperature',
      'Active balancing only functions when the vehicle is parked; passive balancing operates only at top speed',
      'Passive balancing increases overall battery pack energy capacity by 40%'
    ],
    correct: 0,
    topic: 'Battery Cell Balancing: Active vs Passive Balancing Architectures'
  },
  {
    q: 'Why are Silicon Carbide (SiC) MOSFETs rapidly replacing Silicon IGBTs in 800V high-performance EV traction inverters?',
    opts: [
      'Wide bandgap semiconductor material provides higher breakdown voltage, drastically lower switching losses at high frequencies (> 20 kHz), higher thermal conductivity, and enables smaller cooling systems',
      'SiC MOSFETs eliminate the need for copper wiring in the vehicle chassis',
      'SiC devices generate electricity from surrounding mechanical vibrations without consuming battery power',
      'SiC MOSFETs operate as room-temperature superconductors'
    ],
    correct: 0,
    topic: 'Power Electronics: Wide Bandgap Silicon Carbide (SiC) Inverters'
  },
  {
    q: 'During regenerative braking at high highway speeds, what physical and thermal constraints limit the maximum braking torque that the electric powertrain can safely exert?',
    opts: [
      'The maximum charging current acceptance limit of the battery pack at its current temperature/SoC and the motor back-EMF exceeding inverter DC bus voltage limits',
      'The coefficient of static friction of the copper stator windings',
      'The maximum mechanical tensile strength of the front windshield glass',
      'The speed of light in the high-voltage shielded orange cabling'
    ],
    correct: 0,
    topic: 'Regenerative Braking Dynamics & Battery Current Acceptance Limits'
  },
  {
    q: 'What is the safety function of the High-Voltage Interlock Loop (HVIL) in an electric vehicle powertrain?',
    opts: [
      'A continuous low-voltage monitoring loop that routes through all high-voltage connectors; if any connector is disconnected or tampered with, the BMS instantly commands the main vacuum contactors to de-energize the HV bus',
      'A mechanical door locking mechanism that activates above 100 km/h',
      'A software loop that locks the central infotainment screen while charging',
      'A ground strap that prevents lightning strikes from reaching the battery'
    ],
    correct: 0,
    topic: 'High-Voltage Safety: High-Voltage Interlock Loop (HVIL)'
  },
  {
    q: 'In electric motor control at high speeds, why is Field Weakening (flux weakening) control applied to a PMSM, and what is the magnetic mechanism?',
    opts: [
      'At high RPM, motor back-EMF approaches the inverter DC bus voltage; injecting negative d-axis current (Id < 0) opposes the permanent magnet rotor flux, reducing back-EMF and extending the operating speed range beyond base speed',
      'Field weakening completely turns off the motor to allow coasting with zero power consumption',
      'Field weakening permanently demagnetizes the neodymium rotor magnets to prevent overheating',
      'Field weakening converts the 3-phase AC motor into a single-phase DC stepper motor'
    ],
    correct: 0,
    topic: 'Motor Control: PMSM Field Weakening & Back-EMF Voltage Limits'
  },
  {
    q: 'During 350 kW DC Ultra-Fast Charging (CCS), why does the BMS throttle charging power aggressively once the battery State of Charge exceeds 80%?',
    opts: [
      'At high SoC, the anode potential approaches 0V vs Li/Li+ under high current, causing metallic lithium plating on the graphite anode which forms dendritic shorts and risks thermal runaway',
      'The charging cable copper wires reach the curie temperature and lose electrical conductivity',
      'Electric vehicle charging standards prohibit charging above 80% in all countries',
      'The DC fast charger power grid transformer runs out of magnetic flux'
    ],
    correct: 0,
    topic: 'DC Ultra-Fast Charging: Lithium Plating & Anode Overpotential'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 10. BUILDING INFORMATION MODELING (BIM) & STRUCTURAL REVIT ENGINEERING
// ─────────────────────────────────────────────────────────────────────────────
const BIM_CIVIL_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In Autodesk Revit parametric family modeling, an engineer encounters the error "Constraints are not satisfied" during family flex testing. What is the root cause and best practice resolution?',
    opts: [
      'Conflicting geometric constraints or overlapping dimension parameters locking geometry to reference planes; resolve by establishing a strict hierarchy where reference planes drive parameters, and geometry is locked to planes rather than other geometry',
      'The computer graphics card does not support DirectX 12 hardware acceleration',
      'Revit parametric families cannot contain more than 3 dimensional parameters',
      'The family file format must be converted to an uncompressed 2D AutoCAD DWG file'
    ],
    correct: 0,
    topic: 'Parametric BIM Families: Constraint Hierarchies & Flex Testing'
  },
  {
    q: 'In Navisworks clash detection coordination between Structural, MEP (Mechanical, Electrical, Plumbing), and Architectural models, what is the critical difference between a Hard Clash and a Clearance (Soft) Clash?',
    opts: [
      'Hard Clashes detect physical geometric intersections (e.g., an HVAC duct intersecting a structural steel beam); Clearance Clashes evaluate buffer zones around equipment required for maintenance access, thermal expansion, or insulation',
      'Hard Clashes only occur in concrete elements, while Clearance Clashes only occur in glass windows',
      'Navisworks automatically resolves all Hard Clashes without human intervention',
      'Clearance Clashes are caused exclusively by incorrect project north rotations'
    ],
    correct: 0,
    topic: 'Navisworks Clash Detection: Hard vs Soft/Clearance Clashes'
  },
  {
    q: 'According to BIMForum Level of Development (LOD) specifications, what is the milestone transition from LOD 300 to LOD 400 for structural concrete elements?',
    opts: [
      'LOD 300 defines elements with accurate quantity, size, shape, and location; LOD 400 incorporates fabrication and assembly detailing, including precise rebar cage layout, lap splices, hooks, and embed plates for fabrication',
      'LOD 300 contains photorealistic rendering textures, while LOD 400 is an untextured wireframe model',
      'LOD 400 elements can only be viewed in virtual reality headsets',
      'LOD 300 is for civil engineering, whereas LOD 400 is exclusively for interior design furniture'
    ],
    correct: 0,
    topic: 'BIMForum LOD Specifications: LOD 300 vs LOD 400 Detailing'
  },
  {
    q: 'In multi-story structural engineering analysis (ETABS / Revit), how does a discontinuous load path in a Lateral Force Resisting System (LFRS) affect seismic vulnerability?',
    opts: [
      'Discontinuities (such as floating shear walls terminating on transfer slabs) create extreme stress concentrations, overturning moments, and soft-story mechanisms under seismic base shear',
      'Discontinuous load paths eliminate all seismic forces by redirecting vibration into the roof',
      'LFRS discontinuities are required by building codes to improve building flexibility',
      'Discontinuous load paths convert earthquake ground acceleration into thermal energy'
    ],
    correct: 0,
    topic: 'Structural Mechanics: Lateral Force Resisting Systems (LFRS)'
  },
  {
    q: 'When exporting native Revit BIM models to open standard Industry Foundation Classes (IFC4) for openBIM coordination, what causes property set (Pset) metadata loss, and how is it resolved?',
    opts: [
      'Revit shared parameters are not mapped to standard IFC property sets by default; resolve by configuring a custom IFC Export Parameter Mapping Table file that maps native parameters to standard IFC definitions',
      'IFC files cannot store text or numerical data attributes',
      'The IFC format requires all 3D geometries to be converted into 2D PDF documents',
      'Property set loss is caused by exporting models during daylight hours'
    ],
    correct: 0,
    topic: 'openBIM Interoperability: IFC4 Parameter Mapping Tables'
  },
  {
    q: 'In multi-user Revit Worksharing environments using a central model on BIM 360 / Autodesk Construction Cloud, what causes the "Element Borrowing Lockout" error, and how is it resolved safely?',
    opts: [
      'Another user has modified and checked out the element workset without synchronizing; resolved by requesting element relinquishment via Worksharing Monitor or having the owner synchronize with central and relinquish all permissions',
      'Deleting the central model from the cloud storage bucket and starting over',
      'Renaming the local .rvt file to match the central model file name exactly',
      'Reinstalling the Revit desktop software on all team member computers'
    ],
    correct: 0,
    topic: 'Revit Worksharing: Central Model Synchronization & Element Borrowing'
  },
  {
    q: 'In finite element building analysis (ETABS / SAP2000), when is the Rigid Diaphragm assumption invalidated, requiring the use of a Semi-Rigid Diaphragm model?',
    opts: [
      'When floor slabs possess significant geometric irregularities (large openings > 50% of slab area, re-entrant corners, or flexible steel roof decking) where in-plane slab deformations alter lateral load distribution to vertical frames',
      'When the building height is less than 3 stories',
      'When structural steel columns are coated with fireproofing insulation',
      'Semi-rigid diaphragms are only used for single-family residential timber structures'
    ],
    correct: 0,
    topic: 'Finite Element Modeling: Rigid vs Semi-Rigid Floor Diaphragms'
  },
  {
    q: 'In Life Cycle Assessment (LCA) and sustainable BIM engineering, how are Embodied Carbon calculations extracted directly from structural BIM schedules?',
    opts: [
      'Multiplying accurate material volume takeoffs (concrete m³, structural steel kg) extracted from the BIM model by Environmental Product Declaration (EPD) Global Warming Potential (GWP) coefficients (kg CO2e per unit)',
      'Measuring the electrical power consumption of the designer\'s laptop during modeling',
      'Counting the total number of doors and windows modeled in the floor plan',
      'Dividing the total building construction cost by the current price of carbon credits'
    ],
    correct: 0,
    topic: 'Sustainable BIM: Embodied Carbon & Material EPD Integration'
  },
  {
    q: 'In BIM site coordination, what is the mathematical purpose of establishing Shared Coordinates with a Project Base Point and a Survey Point in Revit?',
    opts: [
      'Aligns the local building project grid with the civil engineer\'s true geodetic coordinate system (UTM / State Plane Coordinates) and elevation above sea level, ensuring multi-discipline model alignment',
      'Compresses the Revit file size by rounding all coordinates to the nearest whole meter',
      'Changes the direction of the building\'s plumbing drainage slopes',
      'Shared coordinates are only used for exporting rendering camera viewpoints'
    ],
    correct: 0,
    topic: 'BIM Georeferencing: Survey Points & Shared Coordinates'
  },
  {
    q: 'When designing deep foundation systems in geotechnical structural BIM, what structural hazard occurs if differential settlement between adjacent pile caps exceeds code limits (e.g., > 1/500 angular distortion)?',
    opts: [
      'Induces severe secondary bending moments and shear stresses in connected grade beams and superstructure frames, causing structural cracking, partition wall damage, and MEP pipe shear failure',
      'Increases the bearing capacity of the underlying soil strata automatically',
      'Eliminates all structural dead load forces from the building foundation',
      'Differential settlement only affects the building color and architectural paint'
    ],
    correct: 0,
    topic: 'Foundation Engineering: Differential Settlement & Superstructure Stresses'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 11. OFFENSIVE CYBERSECURITY OPERATIONS, SIEM THREAT HUNTING & SOC
// ─────────────────────────────────────────────────────────────────────────────
const CYBERSECURITY_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'When exploiting a stack-based buffer overflow on a modern 64-bit Linux binary where Address Space Layout Randomization (ASLR) and Non-Executable Stack (NX / DEP) are fully enabled, what exploit technique successfully achieves arbitrary code execution?',
    opts: [
      'Return-Oriented Programming (ROP): chaining existing gadget sequences in executable memory segments ending in RET to prepare registers and invoke mprotect() or execve()',
      'Injecting raw shellcode directly into the stack and jumping to the RSP register location',
      'Modifying the Global Offset Table (GOT) using an unformatted printf without leaking memory pointers',
      'Executing user-space syscalls to disable the CPU hardware Memory Management Unit (MMU)'
    ],
    correct: 0,
    topic: 'Binary Exploitation: ROP Chains & NX/ASLR Bypass'
  },
  {
    q: 'In an Active Directory enterprise domain, how does a Kerberoasting attack operate, and why are service accounts uniquely vulnerable to offline brute-forcing?',
    opts: [
      'Any authenticated domain user can request a Kerberos TGS ticket for an account with a registered Service Principal Name (SPN); the ticket is encrypted with the service account\'s NTLM hash and cracked offline',
      'The attacker injects forged Golden Tickets into the Kerberos Key Distribution Center (KDC) without credentials',
      'Kerberoasting exploits unencrypted passwords transmitted over SMBv1 during domain synchronization',
      'It forces domain controllers to downgrade all Kerberos authentication to plaintext Basic Auth over LDAP'
    ],
    correct: 0,
    topic: 'Active Directory Exploitation: Kerberoasting & SPN Cryptanalysis'
  },
  {
    q: 'A penetration tester discovers a SQL injection vulnerability in a reporting query where no database errors or output data are returned in the HTTP response. Which technique reliably extracts confidential data character-by-character?',
    opts: [
      'Time-based Blind SQL Injection using conditional delay functions (e.g., pg_sleep() or WAITFOR DELAY) predicated on binary boolean substring assertions',
      'UNION-based SQL injection appending 50 NULL columns to reflect table schemas in HTTP headers',
      'Injecting DROP DATABASE statements to verify table locks via HTTP 500 status codes',
      'Sending malformed UTF-8 byte sequences to crash the database connection pool'
    ],
    correct: 0,
    topic: 'Advanced Web Exploitation: Time-Based Blind SQL Injection'
  },
  {
    q: 'Why does Cross-Origin Resource Sharing (CORS) NOT protect a REST API against Cross-Site Request Forgery (CSRF) on state-changing POST requests?',
    opts: [
      'Browsers send the state-changing POST request and session cookies to the server before evaluating CORS headers; CORS only restricts the client JavaScript from reading the response, not from executing the request',
      'CORS headers are only evaluated when the client browser operates in Incognito / Private browsing mode',
      'CSRF attacks only utilize GET requests and are strictly impossible over HTTP POST',
      'Web servers automatically disable CORS validation when requests include an Origin header'
    ],
    correct: 0,
    topic: 'Web Application Security: CORS vs CSRF Execution Realities'
  },
  {
    q: 'An attacker exploits a Server-Side Request Forgery (SSRF) vulnerability on a containerized microservice hosted on AWS EC2. What critical endpoint should be queried to obtain IAM instance profile credentials, and what defense blocks IMDSv1 exploitation?',
    opts: [
      'Query http://169.254.169.254/latest/meta-data/iam/security-credentials/; enforce IMDSv2 which requires a PUT request with X-aws-ec2-metadata-token to mitigate unauthorized SSRF',
      'Query http://127.0.0.1:8080/admin/passwords; enforce SSL client certificates on localhost',
      'Query http://aws.amazon.com/credentials; add a custom IP route to the host iptables configuration',
      'Query http://169.254.169.254/v1/docker/inspect; disable Docker bridge networking across the VPC'
    ],
    correct: 0,
    topic: 'Cloud SSRF & Instance Metadata Service (IMDSv2) Defenses'
  },
  {
    q: 'In cryptographic software implementation, why is comparing two HMAC signatures using standard string comparison (=== or strcmp) a critical security vulnerability?',
    opts: [
      'Standard string comparison exits early upon encountering the first non-matching byte, creating a side-channel timing vulnerability that allows byte-by-byte signature forgery',
      'Standard string equality operators convert cryptographic hex strings into 32-bit floating point numbers',
      'strcmp() executes in user-space while cryptographic HMACs require kernel-space memory comparison',
      'Early-exit comparison causes memory leaks in the OpenSSL hardware accelerator chip'
    ],
    correct: 0,
    topic: 'Side-Channel Timing Attacks & Constant-Time Cryptography'
  },
  {
    q: 'How does a DNS Rebinding attack bypass firewall protections on internal network interfaces (e.g., accessing http://192.168.1.1 or localhost via victim browser)?',
    opts: [
      'Attacker\'s DNS server responds first with a public IP and short TTL, then responds with an internal private IP on subsequent requests, bypassing the Same-Origin Policy',
      'The attacker overwrites the local router\'s DNS cache using spoofed BGP broadcast packets',
      'DNS Rebinding forces the browser to disable HTTPS certificate validation for all domain names ending in .internal',
      'It injects malicious DNS TXT records that execute arbitrary shell commands inside the victim\'s network adapter firmware'
    ],
    correct: 0,
    topic: 'Network Exploitation: DNS Rebinding & Same-Origin Policy Bypasses'
  },
  {
    q: 'In SIEM threat hunting, an analyst investigates suspicious lateral movement. Which Windows Security Event ID corresponds to a successful network logon using explicit credentials (often associated with Pass-the-Hash or PsExec)?',
    opts: [
      'Event ID 4624 with Logon Type 3 (Network) or Logon Type 9 (NewCredentials)',
      'Event ID 1102 (The audit log was cleared)',
      'Event ID 4720 (A user account was created)',
      'Event ID 7045 (A service was installed in the system)'
    ],
    correct: 0,
    topic: 'SIEM Threat Hunting: Windows Event ID 4624 Logon Types'
  },
  {
    q: 'What is the architectural distinction between symmetric AES-256 in GCM (Galois/Counter Mode) versus CBC (Cipher Block Chaining) mode?',
    opts: [
      'AES-GCM is an Authenticated Encryption with Associated Data (AEAD) mode providing confidentiality and integrity with parallel processing; CBC is vulnerable to padding oracle attacks without an external HMAC',
      'AES-GCM requires a pre-shared RSA private key, whereas AES-CBC operates without any initialization vector (IV)',
      'AES-CBC provides quantum-resistant encryption, while AES-GCM can be broken by linear cryptanalysis in polynomial time',
      'AES-GCM can only encrypt blocks of exactly 64 bytes, requiring excessive memory padding'
    ],
    correct: 0,
    topic: 'Applied Cryptography: AEAD (AES-GCM) vs Padding Oracle (AES-CBC)'
  },
  {
    q: 'In modern web authentication using JSON Web Tokens (JWT), what severe vulnerability occurs when an API verification library trusts the header "alg": "none"?',
    opts: [
      'The server accepts tokens without verifying any cryptographic signature, allowing an attacker to forge arbitrary administrative claims by modifying the payload',
      'The server crashes due to an unhandled null-pointer exception, resulting in Denial of Service across the cluster',
      'The JWT library falls back to plaintext MD5 hashing and sends the root database password in HTTP response headers',
      'The client browser permanently stores the unencrypted token in the operating system credential manager'
    ],
    correct: 0,
    topic: 'JWT Security: Algorithm Confusion & Signature Verification Bypass'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 12. CROSS-PLATFORM MOBILE ENGINEERING WITH FLUTTER & MODERN DART
// ─────────────────────────────────────────────────────────────────────────────
const FLUTTER_MOBILE_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In Flutter internal architecture, how do the Widget Tree, Element Tree, and RenderObject Tree coordinate during state updates, and why are Widgets cheap to rebuild?',
    opts: [
      'Widgets are lightweight immutable configuration blueprints created and discarded easily; the Element Tree manages component lifecycle and identity; the RenderObject Tree handles expensive layout, sizing, and painting operations persistently',
      'Widgets are heavy C++ memory objects that manage GPU frame buffers directly',
      'The RenderObject Tree is deleted and reconstructed from scratch on every user touch event',
      'Elements are only created when using StatefulWidgets, while StatelessWidgets bypass the Element Tree'
    ],
    correct: 0,
    topic: 'Flutter Three-Tree Architecture: Widget, Element & RenderObject'
  },
  {
    q: 'In Dart asynchronous runtime, how does the event loop prioritize Microtasks versus standard Events (I/O, timer, user interaction), and what happens if a microtask schedules another microtask recursively?',
    opts: [
      'The Microtask queue has absolute priority over the Event queue; if microtasks recursively schedule new microtasks, the Event queue is completely starved, freezing all UI animations and touch inputs',
      'The Event queue and Microtask queue are processed in round-robin fashion without priority',
      'Dart executes all microtasks in background native threads concurrently',
      'Recursive microtasks are automatically aborted by the Dart compiler after 3 iterations'
    ],
    correct: 0,
    topic: 'Dart Event Loop: Microtask Queue Starvation & Frame Jank'
  },
  {
    q: 'In Flutter BLoC or Riverpod architecture, what is the consequence of failing to implement value equality (e.g., using Equatable or Freezed) on emitted state objects?',
    opts: [
      'BlocBuilder/Consumer evaluates state equality using default instance reference (identical()); without value equality, newly emitted states with identical data trigger unnecessary full widget sub-tree re-renders',
      'The BLoC stream permanently closes and halts the application',
      'The Flutter engine throws a fatal NoSuchMethodError at runtime',
      'State data is permanently leaked to the device external storage'
    ],
    correct: 0,
    topic: 'Flutter State Management: Immutable State Equality & Re-render Pruning'
  },
  {
    q: 'When writing a Flutter Platform Channel (MethodChannel) to invoke native Android (Kotlin) or iOS (Swift) code, on which thread do platform channel calls execute by default, and how should long-running native computations be handled?',
    opts: [
      'Platform channels execute on the main UI platform thread by default; long-running computations block the native UI thread, causing severe frame drops (jank); they must be dispatched to background Coroutines (Kotlin) or DispatchQueues (Swift)',
      'Platform channels automatically execute inside a dedicated GPU shader pipeline',
      'Platform channel calls are synchronous and cannot return values asynchronously',
      'MethodChannel calls only execute when the mobile device is plugged into USB debugging'
    ],
    correct: 0,
    topic: 'Flutter Platform Channels: Thread Safety & Main Thread Blocking'
  },
  {
    q: 'In Flutter mobile performance profiling, what causes the 16.6ms (60 FPS) / 8.3ms (120 FPS) frame budget to be exceeded during large JSON payload parsing, and how is it resolved?',
    opts: [
      'JSON parsing executes synchronously on the Dart UI isolate, blocking frame scheduling; resolve by offloading JSON deserialization to a background worker isolate using compute() or Isolate.run()',
      'JSON parsing triggers immediate GPU thermal throttling on mobile devices',
      'JSON keys longer than 10 characters cannot be processed by the Dart V8 engine',
      'Flutter applications cannot parse JSON larger than 64 Kilobytes'
    ],
    correct: 0,
    topic: 'Flutter Performance Optimization: Dart Isolates & compute()'
  },
  {
    q: 'In Flutter list item manipulation and state preservation, why is using a ValueKey or ObjectKey strictly required when reordering or removing StatefulWidgets inside a ListView or Column?',
    opts: [
      'Without unique keys, the Element Tree matches widgets strictly by runtimeType and position; when an item is removed, remaining elements retain their old State objects while pointing to new widget data, causing state misalignment',
      'Keys are required by the Android Play Store security verification guidelines',
      'ValueKey compiles the list items into native C++ machine code',
      'Without keys, Flutter automatically converts all StatefulWidgets into StatelessWidgets'
    ],
    correct: 0,
    topic: 'Flutter Keys: State Preservation & Element Reconciliation'
  },
  {
    q: 'What is the architectural difference between Dart JIT (Just-In-Time) compilation and AOT (Ahead-Of-Time) compilation in Flutter?',
    opts: [
      'JIT runs during development, compiling code on-the-fly inside the Dart VM to enable stateful Hot Reload and fast iteration; AOT compiles Dart directly into native ARM64 machine code with tree-shaking for high-performance production releases',
      'AOT compilation is only used on iOS devices, while JIT is used exclusively on Android',
      'JIT compilation produces 90% smaller binary files than AOT compilation',
      'AOT compilation requires an active internet connection to download bytecode at runtime'
    ],
    correct: 0,
    topic: 'Dart Compiler Pipeline: JIT Hot Reload vs AOT Native Binaries'
  },
  {
    q: 'When implementing local SQLite database caching in Flutter mobile applications (using sqflite), what database mode prevents database locked exceptions during concurrent background synchronization writes?',
    opts: [
      'Write-Ahead Logging (WAL) mode (PRAGMA journal_mode=WAL;), which allows concurrent read transactions to execute while a background write transaction is writing to the WAL file',
      'Disabling all database transactions and executing raw SQL in memory',
      'Converting the SQLite database to uncompressed plain text CSV files',
      'Locking the entire mobile device storage using exclusive hardware locks'
    ],
    correct: 0,
    topic: 'Mobile SQLite Architecture: WAL Mode & Concurrency'
  },
  {
    q: 'In Flutter rendering pipeline, what is the performance benefit of wrapping an animated or continuously repainting widget in a RepaintBoundary?',
    opts: [
      'Creates a separate display list and render layer for the subtree; when the subtree repaints, the parent render tree avoids repainting its entire canvas, drastically reducing rasterization CPU/GPU load',
      'Compresses all image assets in the subtree by 50%',
      'Forces the animated widget to execute at 240 FPS regardless of device refresh rate',
      'Converts the widget tree into an SVG vector file'
    ],
    correct: 0,
    topic: 'Flutter Rendering: RepaintBoundary & Rasterization Optimization'
  },
  {
    q: 'In declarative deep linking and routing with go_router in Flutter, how does state restoration handle deep link navigation when an app is launched from a cold start vs when running in the background?',
    opts: [
      'GoRouter parses the incoming URL path and query parameters, reconstructs the declarative routing navigation stack matching the route tree hierarchy, and preserves route parameters across cold-start boots',
      'GoRouter requires re-authenticating the user with biometric face ID on every route change',
      'Deep links can only navigate to the root route ("/") in Flutter applications',
      'GoRouter converts all mobile deep links into SMS text messages'
    ],
    correct: 0,
    topic: 'Flutter Navigation: Declarative Routing & Deep Link Handling'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 13. DISTRIBUTED SYSTEMS & MICROSERVICES ARCHITECTURES
// ─────────────────────────────────────────────────────────────────────────────
const DISTRIBUTED_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'In a 5-node Raft consensus cluster (Nodes 1–5), a network partition isolates Nodes 1 and 2 from Nodes 3, 4, and 5. Node 1 was the original Leader. A client sends a write request to Node 1. Concurrently, Node 3 is elected Leader in the majority partition. What happens to the write sent to Node 1 and why?',
    opts: [
      'Node 1 appends the entry to its uncommitted local log, but cannot replicate to a majority quorum, so the write blocks or fails; when the partition heals, Node 1 discovers Node 3\'s higher term and overwrites its uncommitted log entries',
      'Node 1 commits the write immediately since it holds the original term, forcing Nodes 3, 4, and 5 into split-brain deadlock when the network partition resolves',
      'Node 1 transparently proxies the RPC over the partitioned network using asynchronous gossip protocols to commit without quorum',
      'Node 1 triggers an immediate demotion to Candidate state, abandoning all memory and forcing a hard cluster-wide restart'
    ],
    correct: 0,
    topic: 'Raft Consensus & Split-Brain Quorum'
  },
  {
    q: 'An Apache Kafka consumer group with 3 consumers processing financial orders uses enable.auto.commit = false. Consumer A processes 500 messages, completes database writes, and crashes unexpectedly before calling commitSync(). The group coordinator triggers a rebalance and assigns Consumer A\'s partitions to Consumer B. What anomaly occurs, and how is end-to-end exactly-once processing (EOS) strictly achieved?',
    opts: [
      'Consumer B re-reads and re-processes the uncommitted 500 messages causing duplicate execution unless Kafka transactional producer IDs (isolation.level=read_committed) and an idempotent consumer key deduplication table are used',
      'The Kafka broker automatically rolls back the external database writes through XA two-phase commit protocol integration',
      'The consumer group deadlocks indefinitely until Consumer A reboots because partition locks are retained in ZooKeeper / KRaft',
      'Kafka automatically converts the topic into a dead-letter queue, dropping all subsequent uncommitted offsets permanently'
    ],
    correct: 0,
    topic: 'Kafka Offsets, Rebalancing & Exactly-Once Semantics'
  },
  {
    q: 'An e-commerce architecture spans Order Service, Inventory Service, and Payment Service. The team replaces Two-Phase Commit (2PC) with an asynchronous Orchestrated Saga pattern. If Payment authorization fails during Step 3, what guarantees eventual consistency, and what fatal distributed flaw does 2PC exhibit that Saga eliminates?',
    opts: [
      'The Saga Orchestrator dispatches backward compensating transactions (e.g., release reserved inventory); eliminating 2PC\'s blocking coordinator single-point-of-failure where locks remain held indefinitely during coordinator crashes',
      'The Saga pattern initiates a hardware-level network roll-back packet to synchronize all microservice database engines simultaneously',
      'Saga relies on distributed atomic clocks (TrueTime) to roll back timestamp history across all distributed replicas',
      'Saga forces all downstream services to share a single unified PostgreSQL ACID transaction boundary over gRPC streams'
    ],
    correct: 0,
    topic: 'Distributed Transactions: 2PC vs Saga Pattern'
  },
  {
    q: 'A high-throughput microservices cluster migrates inter-service RPC from REST/HTTP/1.1 to gRPC over HTTP/2. Under a 3% packet loss network condition on the underlying TCP connection, all 200 multiplexed gRPC streams experience latency spikes simultaneously. What is the fundamental transport-layer cause?',
    opts: [
      'TCP-level head-of-line blocking; because all HTTP/2 logical streams share a single underlying TCP connection, a dropped TCP segment stalls all multiplexed streams until retransmission succeeds',
      'Protobuf binary serializer locks the CPU thread pool while calculating CRC32 checksums on multiplexed stream buffers',
      'gRPC requires TLS 1.3 session renegotiation every 10 milliseconds when packet drop exceeds 1%',
      'HTTP/2 flow control windows collapse to zero whenever a packet is dropped, requiring a complete TCP three-way handshake restart'
    ],
    correct: 0,
    topic: 'gRPC HTTP/2 Transport & Head-of-Line Blocking'
  },
  {
    q: 'A banking microservice utilizes Event Sourcing with CQRS. A user transfers $1,000 and immediately refreshes their account summary page. The read-model query returns the pre-transfer balance, showing the transaction never occurred. What distributed systems pattern correctly handles this Read-Your-Own-Writes dilemma?',
    opts: [
      'Include the latest write event sequence number / version in the mutation response, and have the read query route wait on the projection read-replica until its applied event version is >= the client\'s token',
      'Disable CQRS read projections and execute all user queries directly against the un-indexed raw append-only event store tables',
      'Force all read queries to sleep for an arbitrary 500 milliseconds before querying the read replica',
      'Switch the Event Store from append-only log to a relational in-place UPDATE table with pessimistic row locks'
    ],
    correct: 0,
    topic: 'Event Sourcing, CQRS & Read-Your-Own-Writes'
  },
  {
    q: 'An Envoy / Resilience4j circuit breaker protects an API Gateway from an intermittently failing downstream billing service. The breaker transitions from CLOSED to OPEN after a 50% failure rate over 100 calls. After the 30-second waitDurationInOpenState expires, what exact state transition and traffic policy occurs?',
    opts: [
      'It enters HALF_OPEN state, permitting a configurable small probe batch of requests; if all probe calls succeed, it resets to CLOSED, otherwise it immediately returns to OPEN',
      'It immediately resets to CLOSED and permits 100% of production traffic instantly without health verification',
      'It permanently transitions to DISABLED state and drops all subsequent incoming traffic until manual administrator reboot',
      'It redirects all traffic to an alternate cloud provider via DNS round-robin without inspecting response status codes'
    ],
    correct: 0,
    topic: 'Circuit Breaker State Machine & Resiliency'
  },
  {
    q: 'Two concurrent webhook callbacks for payment settlement (#Pay-9981) arrive at two distinct Payment Service instances within 1 millisecond. Both check Redis: GET lock:Pay-9981 returns null for both because the subsequent SET hasn\'t finished. Both charge the merchant. What atomic Redis command or database constraint eliminates this race condition?',
    opts: [
      'Execute SET lock:Pay-9981 <uuid> NX EX 10 (Set if Not Exists with atomic TTL) or enforce a relational UNIQUE database constraint on the external idempotency key',
      'Wrap the Redis GET and SET operations in two sequential asynchronous JavaScript promises without transactions',
      'Increase the Redis keep-alive timeout and reduce the Redis server memory allocation to 128MB',
      'Use a volatile while-loop on the client instance that checks Redis every 5 microseconds without a lock'
    ],
    correct: 0,
    topic: 'Distributed Locking & Idempotency Guarantees'
  },
  {
    q: 'In a distributed in-memory cache ring using consistent hashing, Node 4 crashes. Without virtual nodes (vnodes), what severe clustering defect occurs to adjacent nodes, and how do virtual nodes mathematically mitigate it?',
    opts: [
      'Non-uniform load skew (hotspotting) where Node 4\'s entire keyspace dumps exclusively onto its immediate clockwise successor; virtual nodes disperse keys across the hash ring evenly among all remaining nodes',
      'Complete keyspace corruption requiring all cluster nodes to flush 100% of their in-memory data',
      'The hash ring permanently fractures, preventing any keys with hash values above Node 4 from ever being located',
      'Virtual nodes compress key hashes into 8-bit integers to eliminate cryptographic collisions on single-core CPUs'
    ],
    correct: 0,
    topic: 'Consistent Hashing & Virtual Node Topology'
  },
  {
    q: 'In a leaderless multi-master database (e.g., Cassandra / DynamoDB), Client X updates key K on Node 1 (Clock: [1, 0]), and Client Y updates key K on Node 2 (Clock: [0, 1]) without reading X\'s write. How does the database detect a concurrent conflict rather than a causal order?',
    opts: [
      'Neither vector clock dominates the other (neither is component-wise greater than or equal to the other), proving concurrent divergence that requires application-level sibling resolution or CRDTs',
      'The database inspects the physical hardware RTC clock of both servers and discards the write from the server with slower clock drift',
      'Vector clocks automatically average the numerical values of both writes and stores the mean value in column K',
      'The database aborts both writes and deletes key K from all cluster replicas to prevent dirty reads'
    ],
    correct: 0,
    topic: 'Vector Clocks, Causality & Dynamo Replicas'
  },
  {
    q: 'OpenTelemetry distributed tracing is implemented across 12 microservices. However, trace spans break when requests pass from the Go Gateway through an asynchronous Kafka event topic into a Python worker service. What was omitted in the producer/consumer pipeline?',
    opts: [
      'Injecting the W3C traceparent and tracestate context headers into the Kafka record headers before publishing, and extracting them in the consumer before starting the child span',
      'Configuring the Kafka broker to decode Protobuf binary payloads and inject span IDs directly into message offsets',
      'Running a centralized OpenTelemetry Collector daemon inside the Kafka broker JVM heap space',
      'Disabling TCP nagle algorithm on the Kafka producer socket connection to preserve trace timestamp resolution'
    ],
    correct: 0,
    topic: 'Distributed Tracing & Context Propagation'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 14. ADVANCED DATA STRUCTURES, ALGORITHMS & COMPETITIVE PROGRAMMING
// ─────────────────────────────────────────────────────────────────────────────
const DSA_QUESTIONS: QuestionTemplate[] = [
  {
    q: 'What is the amortized time complexity of performing range sum updates and range sum queries on an array of size N using a Segment Tree with Lazy Propagation?',
    opts: [
      'O(log N) for both range updates and range queries, because updates are deferred to child nodes only when visited by subsequent queries',
      'O(1) for range updates and O(N) for range queries',
      'O(N log N) for range updates and O(log N) for range queries',
      'O(sqrt(N)) for range updates and O(1) for range queries'
    ],
    correct: 0,
    topic: 'Advanced Data Structures: Segment Trees & Lazy Propagation'
  },
  {
    q: 'In Tarjan\'s Strongly Connected Components (SCC) algorithm on a directed graph G = (V, E), how are low-link values (low[u]) updated when traversing an edge (u, v) where v is already on the DFS stack?',
    opts: [
      'low[u] = min(low[u], disc[v]) because (u, v) is a back-edge to an active ancestor in the current DFS subtree',
      'low[u] = max(low[u], low[v]) to propagate the highest sink vertex up the stack',
      'low[u] = disc[u] + 1 to force a cycle detection exception',
      'low[u] is set to infinity and vertex v is popped from the stack immediately'
    ],
    correct: 0,
    topic: 'Graph Algorithms: Tarjan\'s Strongly Connected Components'
  },
  {
    q: 'In Dinic\'s algorithm for computing Maximum Flow in a flow network G = (V, E), what is the worst-case time complexity, and how do Level Graphs and Blocking Flows optimize over standard Edmonds-Karp?',
    opts: [
      'O(V^2 * E); Dinic uses BFS to construct a level graph and repeatedly finds blocking flows using DFS, advancing shortest augmenting paths in phases rather than one path per BFS',
      'O(V * E^2); Dinic executes random depth-first traversals without level graphs',
      'O(E * log V); Dinic uses a Fibonacci heap to compute single-source shortest paths in O(1) amortized time',
      'O(2^V); Dinic evaluates all subset combinations of cut vertices using bitmask dynamic programming'
    ],
    correct: 0,
    topic: 'Network Flow Algorithms: Dinic\'s Algorithm'
  },
  {
    q: 'What is the theoretical time complexity of performing M Union and Find operations on a Disjoint Set Union (DSU) structure with N elements using both Path Compression and Union by Rank?',
    opts: [
      'O(M * alpha(N)), where alpha is the extremely slowly growing inverse Ackermann function (effectively <= 4 for all practical values of N)',
      'O(M * log N) strictly due to binary tree height balance',
      'O(N^2) in the worst case when trees become degenerate linked lists',
      'O(M * sqrt(N)) through square root block decomposition'
    ],
    correct: 0,
    topic: 'Disjoint Set Union (DSU) & Inverse Ackermann Complexity'
  },
  {
    q: 'In the Knuth-Morris-Pratt (KMP) string matching algorithm, what does the Longest Prefix Suffix (LPS) array mathematically represent, and what is the overall matching time complexity?',
    opts: [
      'LPS[i] stores the length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i]; enabling linear O(N + M) search without backtracking the text pointer',
      'LPS[i] stores the hash value of the text computed using Rabin-Karp rolling polynomial hashing in O(N log M)',
      'LPS[i] counts the total number of vowel characters occurring before index i in O(N)',
      'LPS[i] stores the Boyer-Moore bad character shift table values in O(M^2)'
    ],
    correct: 0,
    topic: 'String Algorithms: Knuth-Morris-Pratt (KMP) & LPS Array'
  },
  {
    q: 'When solving the Convex Hull Trick optimization in Dynamic Programming (e.g., DP transitions of the form dp[i] = min(dp[j] + m[j] * x[i] + c[j])), what condition allows O(1) query time using a monotonic deque rather than O(log N) binary search?',
    opts: [
      'Both the slopes of the inserted lines m[j] and the query evaluation points x[i] are strictly monotonic',
      'The cost array c[j] consists entirely of prime numbers',
      'The dynamic programming state space is strictly one-dimensional with non-overlapping subproblems',
      'The number of lines inserted is strictly less than 64'
    ],
    correct: 0,
    topic: 'Dynamic Programming Optimizations: Convex Hull Trick'
  },
  {
    q: 'In a tree of N nodes, what is the preprocessing time and query time complexity for finding the Lowest Common Ancestor (LCA) of two arbitrary nodes using Binary Lifting?',
    opts: [
      'O(N log N) preprocessing time to construct the up[node][i] ancestor table, and O(log N) time per LCA query',
      'O(N^2) preprocessing time and O(1) query time',
      'O(1) preprocessing time and O(N) query time via depth-first search',
      'O(log N) preprocessing time and O(log N) query time'
    ],
    correct: 0,
    topic: 'Tree Algorithms: Lowest Common Ancestor (LCA) & Binary Lifting'
  },
  {
    q: 'What is the primary advantage of a Treap (Tree + Heap) over a standard unbalanced Binary Search Tree (BST), and how does it guarantee expected O(log N) operations?',
    opts: [
      'Each node is assigned a random priority; keys satisfy BST properties and priorities satisfy heap properties, preventing degenerate trees through tree rotations with high probability',
      'Treap eliminates all pointers by storing tree nodes in continuous sequential arrays',
      'Treap guarantees strict zero memory fragmentation on GPU hardware caches',
      'Treap allows nodes to store duplicate keys without any rotation operations'
    ],
    correct: 0,
    topic: 'Randomized Data Structures: Treap & Tree Rotations'
  },
  {
    q: 'In the Aho-Corasick multi-pattern string matching algorithm, what is the time complexity to locate all occurrences of K patterns of total length L in a text of length N?',
    opts: [
      'O(N + L + Z) where Z is the total number of pattern matches, constructed by adding failure link transitions across a Trie data structure',
      'O(N * K * L) due to repeating brute-force substring comparisons',
      'O(N^2 * log K) using recursive depth-first backtracking',
      'O(Z * log(N * L)) by sorting pattern suffixes'
    ],
    correct: 0,
    topic: 'Multi-Pattern Matching: Aho-Corasick Automaton'
  },
  {
    q: 'In Suffix Automaton (SAM) construction for a string S of length N, what are the theoretical maximum number of states and transitions, and what is its construction time complexity?',
    opts: [
      'At most 2N - 1 states and 3N - 4 transitions, constructed in strictly linear O(N) time and space',
      'O(N^2) states and O(N^3) transitions, requiring quadratic dynamic programming',
      'O(2^N) states due to powerset subset transitions',
      'O(N log N) states using divide-and-conquer suffix array doubling'
    ],
    correct: 0,
    topic: 'String Data Structures: Suffix Automaton Linear Construction'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN ROUTER & QUESTION GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
export function generateCourseAssessmentQuestions(
  courseTitle: string,
  studentId: string,
  skillsList: string[]
): { questions: any[]; correctAnswers: Record<number, number> } {
  const lowerTitle = (courseTitle || '').toLowerCase();
  const skillsStr = (skillsList || []).join(' ').toLowerCase();

  // Strict domain detection matching all courses accurately
  const isAWSCloud =
    (lowerTitle.includes('aws') || lowerTitle.includes('solutions professional') || lowerTitle.includes('cloud architecture')) &&
    !lowerTitle.includes('docker') &&
    !lowerTitle.includes('kubernetes');

  const isAI =
    lowerTitle.includes('deep learning') ||
    lowerTitle.includes('llm') ||
    lowerTitle.includes('neural') ||
    lowerTitle.includes('machine learning') ||
    lowerTitle.includes('artificial intelligence') ||
    skillsStr.includes('pytorch') ||
    skillsStr.includes('transformers') ||
    skillsStr.includes('rag') ||
    skillsStr.includes('vector search');

  const isNextJs =
    lowerTitle.includes('next.js') ||
    lowerTitle.includes('nextjs') ||
    lowerTitle.includes('clean microservice') ||
    lowerTitle.includes('full stack') ||
    (lowerTitle.includes('web') && skillsStr.includes('react')) ||
    skillsStr.includes('next.js app router');

  const isDataEng =
    lowerTitle.includes('snowflake') ||
    lowerTitle.includes('data modeling') ||
    lowerTitle.includes('data engineering') ||
    lowerTitle.includes('warehouse') ||
    skillsStr.includes('snowflake') ||
    skillsStr.includes('dbt') ||
    skillsStr.includes('data pipelines');

  const isDockerK8s =
    lowerTitle.includes('docker') ||
    lowerTitle.includes('kubernetes') ||
    lowerTitle.includes('cloud-native') ||
    skillsStr.includes('docker & kubernetes') ||
    skillsStr.includes('helm') ||
    skillsStr.includes('gitops');

  const isVLSI =
    lowerTitle.includes('vlsi') ||
    lowerTitle.includes('systemverilog') ||
    lowerTitle.includes('uvm') ||
    lowerTitle.includes('verilog') ||
    lowerTitle.includes('semiconductor') ||
    skillsStr.includes('systemverilog') ||
    skillsStr.includes('uvm') ||
    skillsStr.includes('fpga');

  const isRobotics =
    lowerTitle.includes('robot') ||
    lowerTitle.includes('ros2') ||
    lowerTitle.includes('ros ') ||
    lowerTitle.includes('industrial control') ||
    skillsStr.includes('ros') ||
    skillsStr.includes('kinematics') ||
    skillsStr.includes('sensor fusion');

  const isEmbedded =
    !isRobotics &&
    (lowerTitle.includes('embedded') ||
      lowerTitle.includes('firmware') ||
      lowerTitle.includes('edge iot') ||
      lowerTitle.includes('microcontroller') ||
      skillsStr.includes('freertos') ||
      skillsStr.includes('embedded c') ||
      skillsStr.includes('device drivers'));

  const isEV =
    lowerTitle.includes('electric vehicle') ||
    lowerTitle.includes('ev ') ||
    lowerTitle.includes('powertrain') ||
    lowerTitle.includes('bms') ||
    lowerTitle.includes('motor drive') ||
    skillsStr.includes('ev powertrain') ||
    skillsStr.includes('battery management');

  const isBIM =
    lowerTitle.includes('bim') ||
    lowerTitle.includes('revit') ||
    lowerTitle.includes('structural') ||
    lowerTitle.includes('civil') ||
    lowerTitle.includes('building information') ||
    skillsStr.includes('revit') ||
    skillsStr.includes('navisworks') ||
    skillsStr.includes('etabs');

  const isCybersecurity =
    lowerTitle.includes('cyber') ||
    lowerTitle.includes('security') ||
    lowerTitle.includes('siem') ||
    lowerTitle.includes('soc') ||
    lowerTitle.includes('offensive') ||
    lowerTitle.includes('penetration') ||
    skillsStr.includes('siem') ||
    skillsStr.includes('penetration testing') ||
    skillsStr.includes('threat hunting');

  const isMobile =
    lowerTitle.includes('flutter') ||
    lowerTitle.includes('dart') ||
    lowerTitle.includes('mobile') ||
    skillsStr.includes('flutter') ||
    skillsStr.includes('dart') ||
    skillsStr.includes('riverpod') ||
    skillsStr.includes('bloc');

  const isDSA =
    lowerTitle.includes('algorithm') ||
    lowerTitle.includes('data structures') ||
    lowerTitle.includes('competitive') ||
    skillsStr.includes('dynamic programming') ||
    skillsStr.includes('graph theory');

  const isDistributed =
    lowerTitle.includes('distributed') ||
    lowerTitle.includes('consensus') ||
    skillsStr.includes('kafka') ||
    skillsStr.includes('grpc') ||
    skillsStr.includes('raft');

  // Select the appropriate question bank based on detected course domain
  let questionPool: QuestionTemplate[] = [];

  if (isAWSCloud) {
    questionPool = AWS_CLOUD_QUESTIONS;
  } else if (isAI) {
    questionPool = AI_LLM_QUESTIONS;
  } else if (isNextJs) {
    questionPool = NEXTJS_FULLSTACK_QUESTIONS;
  } else if (isDataEng) {
    questionPool = DATA_ENG_QUESTIONS;
  } else if (isDockerK8s) {
    questionPool = DOCKER_K8S_QUESTIONS;
  } else if (isVLSI) {
    questionPool = VLSI_QUESTIONS;
  } else if (isRobotics) {
    questionPool = ROBOTICS_ROS2_QUESTIONS;
  } else if (isEmbedded) {
    questionPool = EMBEDDED_IOT_QUESTIONS;
  } else if (isEV) {
    questionPool = EV_POWERTRAIN_QUESTIONS;
  } else if (isBIM) {
    questionPool = BIM_CIVIL_QUESTIONS;
  } else if (isCybersecurity) {
    questionPool = CYBERSECURITY_QUESTIONS;
  } else if (isMobile) {
    questionPool = FLUTTER_MOBILE_QUESTIONS;
  } else if (isDSA) {
    questionPool = DSA_QUESTIONS;
  } else if (isDistributed) {
    questionPool = DISTRIBUTED_QUESTIONS;
  } else {
    // Fallback to high-difficulty software architecture and distributed systems
    questionPool = NEXTJS_FULLSTACK_QUESTIONS;
  }

  // Shuffle the question templates randomly so students receive unique order
  const shuffledTemplates = [...questionPool];
  for (let i = shuffledTemplates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledTemplates[i], shuffledTemplates[j]] = [shuffledTemplates[j], shuffledTemplates[i]];
  }

  // Take exactly 10 questions
  const selectedTemplates = shuffledTemplates.slice(0, 10);

  const formattedQuestions: any[] = [];
  const correctMap: Record<number, number> = {};

  selectedTemplates.forEach((item, index) => {
    const qId = index + 1;
    const { shuffled, newCorrectIdx } = shuffleOptions(item.opts, item.correct);
    correctMap[qId] = newCorrectIdx;

    formattedQuestions.push({
      id: qId,
      question: item.q,
      options: shuffled,
      topic: item.topic,
      difficulty: 'Very Hard (Senior / Principal Engineer Level)'
    });
  });

  return { questions: formattedQuestions, correctAnswers: correctMap };
}

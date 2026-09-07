# Helicone

基于 [Helicone](https://github.com/Helicone/helicone) 的私有化部署代码。
提供 LLM 请求观测、成本/延迟分析、Prompt 管理，以及通过 Jawn 提供的 AI Gateway 代理。

本仓库已裁剪掉营销站、Cloudflare Worker、示例、SDK 发布和云端 CI 等无关内容，仅保留自托管运行所需部分。

## 仓库结构

| 目录 | 说明 |
|------|------|
| `web/` | 前端 Dashboard（Next.js） |
| `valhalla/jawn/` | 后端 API、日志采集、LLM Proxy / Gateway |
| `packages/` | 共享库（cost、filters、llm-mapper、prompts 等） |
| `shared/` | Jawn 构建依赖的共享代码 |
| `supabase/` | Postgres 数据库 migration |
| `clickhouse/` | ClickHouse migration 与种子数据 |
| `docker/` | 本地开发用 compose 与分服务 Dockerfile |
| `Dockerfile` | all-in-one 单容器镜像构建 |
| `supervisord.conf` | 容器内进程编排（Postgres、ClickHouse、Jawn、Web、MinIO） |

## 架构

all-in-one 镜像内包含以下服务：

| 服务 | 默认端口 | 作用 |
|------|----------|------|
| Web | 3000 | 管理界面 |
| Jawn | 8585 | REST API、Gateway 代理、日志写入 |
| Postgres | 5432（容器内） | 账号、组织、API Key |
| ClickHouse | 8123（容器内） | 请求指标与查询 |
| MinIO | 9080 | 请求/响应 body 对象存储 |

Gateway 请求走 Jawn，例如：

```bash
curl -sS 'http://localhost:8585/v1/gateway/oai/v1/chat/completions' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer ${OPENAI_API_KEY}" \
  -H "Helicone-Auth: Bearer ${HELICONE_API_KEY}" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'
```

## 自托管部署

### 构建 all-in-one 镜像

在 `code/` 目录下：

```bash
docker build -t helicone-all-in-one .
```

### 运行

```bash
docker run -d --name helicone \
  -p 3000:3000 \
  -p 8585:8585 \
  -p 9080:9080 \
  -e BETTER_AUTH_SECRET="$(openssl rand -base64 32)" \
  helicone-all-in-one
```

生产环境还需设置 `NEXT_PUBLIC_HELICONE_JAWN_SERVICE`、`S3_ENDPOINT` 等为浏览器可访问的公网或局域网地址。
详见仓库根目录的 `README.md`（若使用外层 `docker compose` 与 `./data/` 持久化）。

### 分服务 compose（本地开发）

```bash
cd docker
cp .env.example .env
docker compose up
```

更多说明见 [`docker/README.md`](docker/README.md)。

## 本地开发（源码调试）

需要 Node.js 20+ 与 Yarn。

1. 安装依赖：

```bash
yarn install
```

2. 启动基础设施（Postgres、ClickHouse、MinIO）：

```bash
cd docker && docker compose up -d db clickhouse minio minio-setup
```

3. 分别启动后端与前端：

```bash
# 终端 1：Jawn
cp valhalla/jawn/.env.example valhalla/jawn/.env
cd valhalla/jawn && yarn dev

# 终端 2：Web
cp web/.env.example.better-auth web/.env.better-auth
cd web && yarn dev:local
```

4. 打开 http://localhost:3000/signup 注册账号。

自托管环境通常没有邮件服务，需在 Postgres 中手动将 `emailVerified` 设为 `true`。

## 常用命令

```bash
yarn build:web          # 构建前端
yarn workspace helicone run lint   # 前端 lint
```

从 Supabase schema 重新生成 TypeScript 类型：

```bash
./genSupabaseTypes.sh
```

## 许可证

基于 Apache License 2.0，详见 [`LICENSE`](LICENSE)。

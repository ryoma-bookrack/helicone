ARG HELICONE_RUNTIME_IMAGE=harbor.ryoma.local/base/helicone-runtime:24.3.13.40-20.19.4-flyway10.5.0-1
FROM ${HELICONE_RUNTIME_IMAGE} AS database-stage

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY ./supabase/migrations /app/supabase/migrations
COPY ./supabase/migrations_without_supabase /app/supabase/migrations_without_supabase
COPY ./clickhouse/migrations /app/clickhouse/migrations
COPY ./clickhouse/seeds /app/clickhouse/seeds
COPY ./clickhouse/ch_hcone.py /app/clickhouse/ch_hcone.py
RUN chmod +x /app/clickhouse/ch_hcone.py

RUN service postgresql start && \
    su - postgres -c "createdb helicone_test" && \
    su - postgres -c "psql -c \"ALTER USER postgres WITH PASSWORD 'password';\"" && \
    service postgresql stop

# --------------------------------------------------------------------------------------------------------------------

FROM database-stage AS jawn-stage

WORKDIR /app
COPY package.json yarn.lock ./
COPY web/package.json ./web/package.json
COPY valhalla/jawn/package.json ./valhalla/jawn/package.json

COPY packages ./packages
RUN find packages -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" ! -name "package.json" | xargs rm -f 2>/dev/null || true

RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

WORKDIR /app/valhalla/jawn
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

WORKDIR /app
COPY packages ./packages
COPY shared ./shared
COPY valhalla ./valhalla
RUN find /app -name ".env.*" -exec rm {} \;

RUN cd valhalla/jawn && yarn build

# --------------------------------------------------------------------------------------------------------------------

FROM jawn-stage AS web-stage

WORKDIR /app
COPY web ./web
RUN find /app -name ".env.*" -exec rm {} \;

WORKDIR /app/web
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile \
    && DISABLE_ESLINT=true yarn build

# --------------------------------------------------------------------------------------------------------------------

FROM web-stage AS minio-stage

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

EXPOSE 3000 8585 8123 9080 9001 5432

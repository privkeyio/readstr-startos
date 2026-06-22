#!/bin/sh
set -e

# The StartOS daemon launch does not inherit the image WORKDIR, so anchor the
# cwd here: `npx prisma` needs ./prisma and `node server.js` lives in /app.
cd /app

PGDATA="${PGDATA:-/data/postgres}"
export PGDATA
PGHOST=127.0.0.1
PGPORT=5432
DB_NAME=readstr
DB_USER=readstr
DB_PASSWORD="${DB_PASSWORD:?DB_PASSWORD is required}"

stop_postgres() {
  su-exec postgres pg_ctl -D "$PGDATA" -m fast -w stop || true
}
shutdown() {
  if [ -n "$APP_PID" ]; then
    kill "$APP_PID" 2>/dev/null || true
    wait "$APP_PID" 2>/dev/null || true
  fi
  stop_postgres
  exit 0
}
trap shutdown TERM INT

mkdir -p "$PGDATA"
# Always re-assert ownership: on restore-from-backup the data dir already has a
# PG_VERSION but may land owned by root, which would make pg_ctl start fail.
chown -R postgres:postgres "$PGDATA"
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  # Local socket uses peer auth (OS user postgres -> role postgres), so the
  # admin commands below need no password; the app connects over TCP with scram.
  su-exec postgres initdb -D "$PGDATA" -U postgres --auth-local=peer --auth-host=scram-sha-256 --encoding=UTF8
fi

su-exec postgres pg_ctl -D "$PGDATA" -w \
  -o "-c listen_addresses='$PGHOST' -p $PGPORT -c unix_socket_directories='/tmp'" start

psql() {
  su-exec postgres psql -h /tmp -p "$PGPORT" -U postgres -v ON_ERROR_STOP=1 "$@"
}

# Bind the password as a psql variable (:'pw') so libpq quotes/escapes it,
# rather than interpolating it into the SQL string. DB_USER/DB_NAME are fixed
# constants, quoted as identifiers for correctness.
if ! psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
  psql -v pw="$DB_PASSWORD" -c "CREATE ROLE \"$DB_USER\" LOGIN PASSWORD :'pw'"
fi
psql -v pw="$DB_PASSWORD" -c "ALTER ROLE \"$DB_USER\" LOGIN PASSWORD :'pw'"

if ! psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
  psql -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\""
fi

export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$PGHOST:$PGPORT/$DB_NAME"

attempts=0
max_attempts=30
until npx prisma migrate deploy; do
  attempts=$((attempts + 1))
  if [ "$attempts" -ge "$max_attempts" ]; then
    echo "prisma migrate deploy failed after $max_attempts attempts" >&2
    stop_postgres
    exit 1
  fi
  echo "migrate deploy failed, retrying ($attempts/$max_attempts)..." >&2
  sleep 2
done

node server.js &
APP_PID=$!
set +e
wait "$APP_PID"
APP_EXIT=$?
set -e
stop_postgres
exit "$APP_EXIT"

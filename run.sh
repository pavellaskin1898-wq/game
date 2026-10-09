#!/usr/bin/env bash
# ============================================================
#  WASTELAND 2 — запуск игры в локальном браузере
#  Использование: ./run.sh [порт]   (по умолчанию 8000)
# ============================================================
set -e
cd "$(dirname "$0")"

PORT="${1:-8000}"
URL="http://localhost:${PORT}"

echo ""
echo "  ██╗    ██╗  ═══ WASTELAND 2 · LAUNCHER ═══"
echo "  ██║    ██║"
echo "  ██║ █╗ ██║  Старт из Убежища 13..."
echo "  ██║███╗██║"
echo "  ╚██████╔╝  ${URL}"
echo "   ╚═══╝═╩╝"
echo ""

# Ищем подходящий способ поднять статический сервер
if command -v python3 >/dev/null 2>&1; then
    SERVER="python3 -m http.server ${PORT}"
elif command -v python >/dev/null 2>&1; then
    SERVER="python -m SimpleHTTPServer ${PORT}"
elif command -v npx >/dev/null 2>&1; then
    SERVER="npx --yes http-server -p ${PORT} -c-1 ."
else
    echo "[ОШИБКА] Не найден ни python3, ни python, ни npx."
    echo "Открой index.html напрямую в браузере или установи Python."
    exit 1
fi

# Открываем браузер (когда сервер поднимется), не блокируя запуск
open_browser() {
    sleep 1
    if command -v xdg-open >/dev/null 2>&1; then xdg-open "${URL}" 2>/dev/null || true
    elif command -v open >/dev/null 2>&1; then open "${URL}" 2>/dev/null || true
    fi
}
open_browser &

echo "[INFO] Сервер: ${SERVER}  (Ctrl+C — остановка)"
echo "[INFO] Управление: WASD + мышь, ЛКМ — огонь, R — перезарядка,"
echo "        Shift — бег, 1/2 — оружие, Esc — пауза."
echo ""
exec ${SERVER}

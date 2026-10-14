#!/bin/bash
#
# update-ds.sh - install a design system release into ./ds/
#
#   ./update-ds.sh          install the latest release
#   ./update-ds.sh v1.1     install a specific release
#
# Uses only git and standard macOS tools, with your existing GitHub access.
# ./ds/ is replaced only after the new copy is complete, so it is never left
# half-updated.

set -u

REPO="hillel9/kaltura-ds"
REPO_URL="https://github.com/$REPO.git"
HERE="$(cd "$(dirname "$0")" && pwd)"
DS_DIR="$HERE/ds"

TMP=""       # temp folder for the download
NEW_DIR=""   # staging copy of the new ds/
OLD_DIR=""   # previous ds/, kept until the swap has succeeded

cleanup() {
  [ -n "$TMP" ] && rm -rf "$TMP"
  [ -n "$NEW_DIR" ] && rm -rf "$NEW_DIR"
  # If something went wrong in the middle of the swap, put the old ds/ back.
  if [ -n "$OLD_DIR" ] && [ -d "$OLD_DIR" ] && [ ! -d "$DS_DIR" ]; then
    mv "$OLD_DIR" "$DS_DIR"
  fi
  [ -n "$OLD_DIR" ] && rm -rf "$OLD_DIR"
  return 0
}
trap cleanup EXIT
trap 'exit 130' INT TERM

fail() {
  echo "Error: $*" >&2
  exit 1
}

download_failed() {
  echo "Error: could not download the design system from $REPO." >&2
  echo "  - You need access to the $REPO repository on GitHub." >&2
  echo "  - You need to be logged in to GitHub on this computer." >&2
  echo "  - You need to be online." >&2
  if [ -s "$TMP/git.log" ]; then
    echo "Details from git:" >&2
    sed 's/^/    /' "$TMP/git.log" >&2
  fi
  echo "ds/ was not changed." >&2
  exit 1
}

available_versions() {
  for d in "$RELEASES"/v*/; do
    [ -d "$d" ] && basename "$d"
  done | sort -V
}

# Print the CHANGELOG.md sections for versions after $1 up to and including $2.
print_changelog() {
  awk -v old="$1" -v new="$2" '
    function key(v,   p) { sub(/^v/, "", v); split(v, p, "."); return p[1] * 1000000 + p[2] * 1000 + p[3] }
    BEGIN { lo = key(old); hi = key(new); show = 0; found = 0 }
    /^## / {
      show = 0
      if ($0 ~ /^## v[0-9]/) {
        k = key($2)
        if (k > lo && k <= hi) { show = 1; found = 1 }
      }
    }
    show { print }
    END { if (!found) print "(no changelog entries between these versions)" }
  ' "$3"
}

command -v git >/dev/null 2>&1 || fail "git is not installed. Install the Xcode command line tools: xcode-select --install"

# Accept "v1.1" or "1.1".
REQUESTED="${1:-}"
if [ -n "$REQUESTED" ]; then
  case "$REQUESTED" in
    v*) ;;
    *) REQUESTED="v$REQUESTED" ;;
  esac
fi

TMP="$(mktemp -d)" || fail "could not create a temporary folder."

# Shallow, sparse clone: only the latest commit, and only releases/.
echo "Checking $REPO ..."
export GIT_TERMINAL_PROMPT=0
git clone --quiet --depth 1 --filter=blob:none --sparse --no-tags "$REPO_URL" "$TMP/repo" 2>"$TMP/git.log" || download_failed
git -C "$TMP/repo" sparse-checkout set releases 2>"$TMP/git.log" || download_failed

RELEASES="$TMP/repo/releases"

# Which version?
if [ -z "$REQUESTED" ]; then
  [ -f "$RELEASES/latest.txt" ] || fail "releases/latest.txt was not found in $REPO, so the latest version is unknown. Ask for a version instead, for example: ./update-ds.sh v1.0"
  VERSION="$(tr -d '[:space:]' < "$RELEASES/latest.txt")"
else
  VERSION="$REQUESTED"
fi

# The pattern check also keeps odd input (like ../x) out of the path below.
if ! printf '%s' "$VERSION" | grep -Eq '^v[0-9]+(\.[0-9]+)*$' || [ ! -d "$RELEASES/$VERSION" ]; then
  echo "Error: version $VERSION was not found in $REPO." >&2
  echo "Available versions:" >&2
  available_versions | sed 's/^/  /' >&2
  echo "ds/ was not changed." >&2
  exit 1
fi

CURRENT=""
[ -f "$DS_DIR/VERSION" ] && CURRENT="$(tr -d '[:space:]' < "$DS_DIR/VERSION")"

if [ "$CURRENT" = "$VERSION" ]; then
  echo "Already on $VERSION"
  exit 0
fi

# Copy the release next to ds/ first, and check it, before touching ds/.
NEW_DIR="$HERE/.ds-new.$$"
mkdir "$NEW_DIR" && cp -R "$RELEASES/$VERSION/." "$NEW_DIR/" || fail "could not copy release $VERSION. ds/ was not changed."
for f in styles.css ds.js ds-icons.js; do
  [ -f "$NEW_DIR/$f" ] || fail "release $VERSION is missing $f. ds/ was not changed."
done
printf '%s\n' "$VERSION" > "$NEW_DIR/VERSION" || fail "could not write ds/VERSION. ds/ was not changed."

# Swap. If the second move fails, cleanup() restores the old ds/.
if [ -d "$DS_DIR" ]; then
  OLD_DIR="$HERE/.ds-old.$$"
  mv "$DS_DIR" "$OLD_DIR" || fail "could not replace ds/. Nothing was changed."
fi
mv "$NEW_DIR" "$DS_DIR" || fail "could not put the new ds/ in place. The previous ds/ was restored."
NEW_DIR=""

if [ -n "$CURRENT" ]; then
  echo "Updated ds/ from $CURRENT to $VERSION."
else
  echo "Installed $VERSION into ds/."
fi

[ -f "$DS_DIR/DS-GUIDE.md" ] || echo "Warning: this release has no DS-GUIDE.md. Claude needs it to build with the design system."

# Changelog between the old and the new version (nothing to compare on a first install).
if [ -n "$CURRENT" ]; then
  echo
  echo "Changelog, $CURRENT -> $VERSION:"
  echo
  if [ -f "$TMP/repo/CHANGELOG.md" ]; then
    print_changelog "$CURRENT" "$VERSION" "$TMP/repo/CHANGELOG.md"
  else
    echo "(CHANGELOG.md was not found in $REPO)"
  fi
fi

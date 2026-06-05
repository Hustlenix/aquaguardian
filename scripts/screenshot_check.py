#!/usr/bin/env python3
"""
AquaGuardian screenshot quality gate (Python 3).

Verifies every PNG in assets/screenshots/ is actually a screenshot and not a
silently-rotted placeholder: it must decode, meet minimum dimensions and file
size, and show real pixel variance (a blank image is flat, a screenshot is
not). Exits non-zero if any screenshot fails, so it can be wired into CI or a
pre-commit habit.

Uses Pillow when available for proper per-pixel statistics, and falls back to
a pure-stdlib zlib scan of the PNG IDAT stream otherwise (byte-level variance
heuristic — less precise, still catches solid-color placeholders).

Usage:
    python scripts/screenshot_check.py                 # check all screenshots
    python scripts/screenshot_check.py --verbose       # per-file detail
    python scripts/screenshot_check.py --min-stddev 3  # tune the blankness bar
"""

from __future__ import annotations

import argparse
import struct
import sys
import zlib
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
SCREENSHOT_DIR = ROOT_DIR / "assets" / "screenshots"

DEFAULT_MIN_DIMENSION = 64      # px
DEFAULT_MIN_FILE_BYTES = 1024   # a real screenshot is never this small
DEFAULT_MIN_STDDEV = 5.0        # 8-bit channel spread; blank PNGs are ~0

try:  # Optional: Pillow gives exact per-pixel stats.
    from PIL import Image, ImageStat

    PILLOW_AVAILABLE = True
except ImportError:  # pragma: no cover - exercised only on Pillow-less hosts
    PILLOW_AVAILABLE = False

PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def parse_png_header(data: bytes) -> tuple[int, int, int, bool]:
    """Return (width, height, bit_depth, is_interlaced) from the IHDR chunk."""
    if not data.startswith(PNG_SIGNATURE):
        raise ValueError("not a PNG file (bad signature)")
    if data[8:12] != b"IHDR":
        raise ValueError("missing IHDR chunk")
    width, height = struct.unpack(">II", data[16:24])
    bit_depth = data[24]
    interlaced = data[28] == 1  # Adam7
    return width, height, bit_depth, interlaced


def stats_with_pillow(path: Path) -> dict:
    """Exact per-pixel variance via Pillow (used when available)."""
    with Image.open(path) as img:
        img = img.convert("RGB")  # flattens palette/alpha for uniform stats
        stat = ImageStat.Stat(img)
        return {
            "width": img.width,
            "height": img.height,
            "stddev": max(stat.stddev),  # worst channel: strictest signal
            "mode": "pillow",
        }


def stats_with_stdlib(path: Path) -> dict:
    """Stdlib fallback: decompress IDAT bytes, measure byte-level spread.

    Filter bytes ride along inside each scanline; for a blankness check that
    is fine — a flat image decompresses to near-identical bytes, while real
    content spreads across the range. Adam7-interlaced frames are reported
    as-is (whole-buffer variance) with a note.
    """
    data = path.read_bytes()
    width, height, _bit_depth, interlaced = parse_png_header(data)

    # Concatenate all IDAT chunks, then inflate.
    idat = b""
    offset = 8
    while offset < len(data):
        length = struct.unpack(">I", data[offset : offset + 4])[0]
        chunk_type = data[offset + 4 : offset + 8]
        if chunk_type == b"IDAT":
            idat += data[offset + 8 : offset + 8 + length]
        offset += 12 + length

    raw = zlib.decompress(idat)
    mean = sum(raw) / len(raw) if raw else 0.0
    variance = sum((b - mean) ** 2 for b in raw) / len(raw) if raw else 0.0
    return {
        "width": width,
        "height": height,
        "stddev": variance**0.5,
        "mode": "stdlib",
        "interlaced": interlaced,
    }


def check_screenshot(path: Path, args) -> dict:
    result = {"path": path, "ok": False, "problems": []}

    if not path.is_file():
        result["problems"].append("missing")
        return result
    if path.stat().st_size < args.min_file_bytes:
        result["problems"].append(
            f"file too small ({path.stat().st_size} bytes < {args.min_file_bytes})"
        )

    try:
        if PILLOW_AVAILABLE:
            stats = stats_with_pillow(path)
        else:
            stats = stats_with_stdlib(path)
    except (ValueError, zlib.error, OSError, struct.error) as exc:
        result["problems"].append(f"decode failed: {exc}")
        result["width"] = result["height"] = result["stddev"] = 0
        return result

    result.update(stats)
    if stats["width"] < args.min_dimension or stats["height"] < args.min_dimension:
        result["problems"].append(
            f"dimensions {stats['width']}x{stats['height']} below "
            f"{args.min_dimension}x{args.min_dimension}"
        )
    if stats["stddev"] < args.min_stddev:
        result["problems"].append(
            f"pixel stddev {stats['stddev']:.1f} < {args.min_stddev} "
            f"(blank or near-blank image?)"
        )

    result["ok"] = not result["problems"]
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verbose", action="store_true", help="print per-file detail")
    parser.add_argument("--min-dimension", type=int, default=DEFAULT_MIN_DIMENSION)
    parser.add_argument("--min-file-bytes", type=int, default=DEFAULT_MIN_FILE_BYTES)
    parser.add_argument("--min-stddev", type=float, default=DEFAULT_MIN_STDDEV)
    args = parser.parse_args()

    pngs = sorted(SCREENSHOT_DIR.glob("*.png"))
    if not pngs:
        print(f"[ERROR] no PNGs found in {SCREENSHOT_DIR}", file=sys.stderr)
        return 1

    print(f"[INFO] AquaGuardian screenshot gate ({SCREENSHOT_DIR})")
    print(
        f"[INFO] engine: {'Pillow ' + Image.__version__ if PILLOW_AVAILABLE else 'stdlib zlib'}"
    )

    results = [check_screenshot(p, args) for p in pngs]
    for r in results:
        marker = "PASS" if r["ok"] else "FAIL"
        line = (
            f"  [{marker}] {r['path'].name}  "
            f"{r.get('width', 0)}x{r.get('height', 0)}  "
            f"stddev={r.get('stddev', 0):.1f}"
        )
        if r.get("mode"):
            line += f"  ({r['mode']}"
            line += ", interlaced" if r.get("interlaced") else ""
            line += ")"
        print(line)
        if r["problems"] and (args.verbose or not r["ok"]):
            for problem in r["problems"]:
                print(f"         - {problem}")

    failed = [r for r in results if not r["ok"]]
    if failed:
        print(f"[FAIL] {len(failed)}/{len(results)} screenshots need attention")
        return 1
    print(f"[SUCCESS] all {len(results)} screenshots look like real screenshots")
    return 0


if __name__ == "__main__":
    sys.exit(main())

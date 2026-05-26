from __future__ import annotations

from pathlib import Path

from PIL import Image


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    p = root / "水行迹纯logo(1).png"
    if not p.exists():
        raise SystemExit(f"not found: {p}")

    img = Image.open(p).convert("RGBA")

    max_bytes = 190 * 1024
    sizes = [1024, 900, 800, 700, 640, 512, 448]

    for s in sizes:
        im = img.copy()
        im.thumbnail((s, s), Image.Resampling.LANCZOS)
        tmp = p.with_suffix(".tmp.png")
        im.save(tmp, format="PNG", optimize=True, compress_level=9)
        b = tmp.read_bytes()
        tmp.unlink(missing_ok=True)
        if len(b) <= max_bytes:
            p.write_bytes(b)
            print(f"ok {s} => {len(b)/1024:.1f}KB")
            return

    im = img.copy()
    im.thumbnail((512, 512), Image.Resampling.LANCZOS)
    p_webp = p.with_suffix(".webp")
    im.save(p_webp, format="WEBP", quality=80, method=6)
    print(f"fallback webp => {p_webp.stat().st_size/1024:.1f}KB")


if __name__ == "__main__":
    main()


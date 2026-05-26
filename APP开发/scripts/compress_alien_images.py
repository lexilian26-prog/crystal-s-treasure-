from __future__ import annotations

from io import BytesIO
from pathlib import Path

from PIL import Image


def encode_jpg(img: Image.Image, quality: int) -> bytes:
    buf = BytesIO()
    img.save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
    return buf.getvalue()


def fit_size(img: Image.Image, max_dim: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_dim:
        return img
    scale = max_dim / float(max(w, h))
    nw = max(1, int(w * scale))
    nh = max(1, int(h * scale))
    return img.resize((nw, nh), Image.Resampling.LANCZOS)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    alien_dir = root / "alien"
    if not alien_dir.exists():
        raise SystemExit(f"alien dir not found: {alien_dir}")

    max_bytes = 150 * 1024
    size_candidates = [800, 700, 600, 512, 448, 384, 320]
    quality_candidates = [82, 78, 74, 70, 66, 62, 58, 54]

    for src in sorted(list(alien_dir.glob("*.png")) + list(alien_dir.glob("*.jpg")) + list(alien_dir.glob("*.jpeg"))):
        img = Image.open(src)
        if img.mode in ("RGBA", "LA"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[-1])
            img = bg
        else:
            img = img.convert("RGB")

        best_bytes = None
        best_img = None
        best_q = None
        for max_dim in size_candidates:
            resized = fit_size(img, max_dim)
            for q in quality_candidates:
                b = encode_jpg(resized, q)
                if len(b) <= max_bytes:
                    best_bytes = b
                    best_img = resized
                    best_q = q
                    break
            if best_bytes is not None:
                break

        if best_bytes is None:
            resized = fit_size(img, 320)
            best_bytes = encode_jpg(resized, 50)
            best_img = resized
            best_q = 50

        dst = src.with_suffix(".jpg")
        dst.write_bytes(best_bytes)
        print(f"{src.name} -> {dst.name} | {best_img.size} | q={best_q} | {len(best_bytes)/1024:.1f}KB")

    print("done")


if __name__ == "__main__":
    main()


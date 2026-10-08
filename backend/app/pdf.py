"""
Minimal dependency-free PDF writer so report exports return a real, valid
PDF file (no reportlab/weasyprint needed). Supports a title header and
plain-text sections, paginated automatically at ~58 lines per page.
"""

PAGE_W, PAGE_H = 595, 842
LEFT_MARGIN, TOP_Y = 50, 800
LINES_PER_PAGE = 58


def _esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def _wrap(text: str, width: int = 95) -> list[str]:
    out = []
    for para in text.split("\n"):
        line = ""
        for word in para.split(" "):
            if len(line) + len(word) + 1 > width:
                if line:
                    out.append(line)
                line = word
            else:
                line = f"{line} {word}".strip()
        out.append(line)
    return out


def _paginate(title: str, subtitle: str, sections: list[tuple[str, list[str]]]) -> list[list[tuple[str, int]]]:
    pages: list[list[tuple[str, int]]] = []
    cur: list[tuple[str, int]] = [(title, 20), (subtitle, 10), ("", 10)]
    for heading, lines in sections:
        if len(cur) + 2 > LINES_PER_PAGE:
            pages.append(cur)
            cur = [(title, 16), ("", 10)]
        cur.append((heading, 13))
        cur.append(("", 6))
        for ln in lines:
            if len(cur) + 1 > LINES_PER_PAGE:
                pages.append(cur)
                cur = [(f"{title} (cont.)", 16), ("", 10)]
            cur.append((ln, 9))
        cur.append(("", 12))
    pages.append(cur)
    return pages


def _page_stream(lines: list[tuple[str, int]]) -> bytes:
    parts = ["BT"]
    y = TOP_Y
    for text, size in lines:
        if text:
            parts.append(f"/F1 {size} Tf 1 0 0 1 {LEFT_MARGIN} {y} Tm ({_esc(text)}) Tj")
        y -= int(size * 1.5)
    parts.append("ET")
    return "\n".join(parts).encode("latin-1", errors="replace")


def build_pdf(title: str, subtitle: str, sections: list[tuple[str, list[str]]]) -> bytes:
    """Returns a complete, valid single-font PDF document as bytes."""
    pages = _paginate(title, subtitle, sections)
    n = len(pages)
    kids = " ".join(f"{4 + 2 * i} 0 R" for i in range(n))

    objects: list[object] = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        f"<< /Type /Pages /Kids [{kids}] /Count {n} >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    for i, lines in enumerate(pages):
        stream = _page_stream(lines)
        objects.append(
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] "
            f"/Contents {5 + 2 * i} 0 R /Resources << /Font << /F1 3 0 R >> >> >>"
        )
        objects.append(stream)

    out = bytearray(b"%PDF-1.4\n")
    offsets: list[int] = []
    for idx, obj in enumerate(objects, start=1):
        offsets.append(len(out))
        if isinstance(obj, bytes):
            out += f"{idx} 0 obj\n<< /Length {len(obj)} >>\nstream\n".encode()
            out += obj + b"\nendstream\nendobj\n"
        else:
            out += f"{idx} 0 obj\n{obj}\nendobj\n".encode("latin-1", errors="replace")
    xref_pos = len(out)
    out += f"xref\n0 {len(objects) + 1}\n".encode()
    out += b"0000000000 65535 f \n"
    for off in offsets:
        out += f"{off:010d} 00000 n \n".encode()
    out += (
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_pos}\n%%EOF"
    ).encode()
    return bytes(out)

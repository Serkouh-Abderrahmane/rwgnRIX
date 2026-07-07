#!/usr/bin/env python3
"""Thematik Image Classifier — manual image-to-category assignment tool."""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
import tkinter as tk
from tkinter import ttk, messagebox, filedialog

try:
    from PIL import Image, ImageTk
except ImportError:
    messagebox.showerror("Missing dependency", "Pillow is required. Run: pip install Pillow")
    sys.exit(1)

# ── Categories extracted from js/main.js (catNames, lines 80-98) ────────────
CATEGORIES = [
    ("1", "enseignes",                "Enseignes"),
    ("2", "bipole",                   "Bipôle"),
    ("3", "panneaux",                 "Panneaux"),
    ("4", "panneaux-sol-geants",      "Panneaux sur sol géants"),
    ("5", "panneaux-chantier",        "Panneaux de chantier"),
    ("6", "panneaux-toiture",         "Panneaux sur toiture"),
    ("7", "signaletique-interieure",  "Signalétique intérieure"),
    ("8", "presentoirs",              "Présentoirs"),
    ("9", "palissades",               "Palissades"),
    ("0", "identite-visuelle",        "Identité visuelle des entreprises"),
    ("a", "habillage-vehicules",      "Habillage de véhicules"),
    ("b", "bureau-vente",             "Bureau de vente"),
    ("c", "habillage-magasins",       "Habillage de magasins"),
    ("d", "impression-numerique",     "Impression numérique"),
    ("e", "panneaux-affichage",       "Panneaux d'affichage"),
    ("f", "stands",                   "Stands"),
    ("g", "totems",                   "Totems"),
]
SLUGS = [c[1] for c in CATEGORIES]
SLUG_TO_DISPLAY = {c[1]: c[2] for c in CATEGORIES}
KEY_TO_SLUG = {c[0]: c[1] for c in CATEGORIES}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"}

STATUS_CATEGORIZED = "categorized"
STATUS_SKIPPED = "skipped"
STATUS_UNCERTAIN = "uncertain"
STATUS_PENDING = "pending"


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class ImageClassifier(tk.Tk):
    def __init__(self, img_dir=None):
        super().__init__()
        self.title("Thematik — Image Classifier")
        self.geometry("1100x780")
        self.minsize(900, 650)

        if img_dir is None:
            img_dir = Path(__file__).resolve().parent / "img"
        self.img_dir = Path(img_dir).resolve()
        self.json_path = Path(__file__).resolve().parent / "classifications.json"

        self.images: list[Path] = []
        self.classifications: dict[str, dict] = {}
        self.idx = 0
        self.review_mode = False
        self.photo = None
        self.status_text = tk.StringVar(value="Ready")

        self.load_images()
        self.load_progress()
        self.build_ui()
        self.setup_bindings()
        self.show_current()

    # ── Data loading ──────────────────────────────────────────────────────

    def load_images(self):
        if not self.img_dir.is_dir():
            messagebox.showerror(
                "Directory not found",
                f"Image directory not found:\n{self.img_dir}\n\n"
                "Launch with: python classifier.py <path-to-images>",
            )
            self.images = []
            return
        files = set()
        for f in self.img_dir.iterdir():
            if f.suffix.lower() in IMAGE_EXTENSIONS:
                files.add(f)
        self.images = sorted(files)
        if not self.images:
            messagebox.showwarning(
                "No images",
                f"No supported images found in:\n{self.img_dir}",
            )

    def load_progress(self):
        if not self.json_path.exists():
            return
        try:
            with open(self.json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            for item in data.get("classifications", []):
                fn = item.get("filename")
                if fn:
                    item["status"] = item.get("status", STATUS_CATEGORIZED)
                    self.classifications[fn] = item
        except Exception as e:
            print(f"Warning: could not load progress: {e}")

    def save_progress(self, quiet=False):
        items = sorted(
            self.classifications.values(),
            key=lambda x: x.get("filename", ""),
        )
        data = {
            "categories_source": "js/main.js catNames",
            "categories": SLUGS,
            "image_directory": str(self.img_dir),
            "classifications": items,
            "last_modified": now_iso(),
        }
        with open(self.json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        if not quiet:
            self.status_text.set(f"Saved ({len(items)} classified)")

    # ── Classification helpers ────────────────────────────────────────────

    def _cls(self, img_path: Path) -> dict | None:
        return self.classifications.get(img_path.name)

    def _set_cls(self, img_path: Path, category: str | None, status: str):
        fn = img_path.name
        # Relative path from the website root (parent of img_dir)
        try:
            rel = img_path.relative_to(self.img_dir.parent)
        except ValueError:
            rel = img_path.relative_to(self.img_dir)
            rel = Path("img") / rel
        self.classifications[fn] = {
            "filename": fn,
            "path": str(rel.as_posix()),
            "category": category,
            "status": status,
            "updated_at": now_iso(),
        }
        self.save_progress(quiet=True)

    def first_uncategorized_index(self, start=0):
        for i in range(start, len(self.images)):
            cls = self._cls(self.images[i])
            if cls is None or cls.get("status") in (STATUS_SKIPPED, STATUS_UNCERTAIN, STATUS_PENDING):
                return i
        return None

    # ── UI construction ───────────────────────────────────────────────────

    def build_ui(self):
        # ── Top bar ───────────────────────────────────────────────────────
        top = ttk.Frame(self)
        top.pack(fill=tk.X, padx=10, pady=(8, 2))

        self.counter_var = tk.StringVar(value="—")
        ttk.Label(top, textvariable=self.counter_var, font=("", 11, "bold")).pack(side=tk.LEFT)

        self.review_btn = ttk.Checkbutton(
            top, text="Review mode", command=self.toggle_review,
        )
        self.review_btn.pack(side=tk.LEFT, padx=20)

        self.status_label = ttk.Label(top, textvariable=self.status_text, foreground="gray")
        self.status_label.pack(side=tk.RIGHT)

        # ── Image area ────────────────────────────────────────────────────
        self.img_frame = ttk.Frame(self, relief=tk.SUNKEN, borderwidth=2)
        self.img_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=4)

        self.img_label = ttk.Label(self.img_frame, anchor=tk.CENTER)
        self.img_label.pack(fill=tk.BOTH, expand=True)

        # ── Info bar ──────────────────────────────────────────────────────
        info = ttk.Frame(self)
        info.pack(fill=tk.X, padx=10, pady=(2, 2))

        self.filename_var = tk.StringVar()
        ttk.Label(info, textvariable=self.filename_var, font=("", 9)).pack(side=tk.LEFT)

        self.current_cat_var = tk.StringVar(value="")
        ttk.Label(info, textvariable=self.current_cat_var, font=("", 9, "italic"), foreground="#555").pack(side=tk.RIGHT)

        # ── Navigation buttons ────────────────────────────────────────────
        nav = ttk.Frame(self)
        nav.pack(fill=tk.X, padx=10, pady=(4, 4))

        ttk.Button(nav, text="◀  Prev  (P)", command=self.prev_image).pack(side=tk.LEFT, padx=2)
        ttk.Button(nav, text="Skip  (S)", command=self.skip_image).pack(side=tk.LEFT, padx=2)
        ttk.Button(nav, text="Unsure  (U)", command=self.mark_uncertain).pack(side=tk.LEFT, padx=2)
        ttk.Button(nav, text="Next  (N)  ▶", command=self.next_image).pack(side=tk.LEFT, padx=2)

        ttk.Button(nav, text="Open folder…", command=self.open_folder).pack(side=tk.RIGHT, padx=2)
        ttk.Button(nav, text="Save now", command=lambda: self.save_progress()).pack(side=tk.RIGHT, padx=2)

        # ── Category grid ─────────────────────────────────────────────────
        cat_frame = ttk.LabelFrame(self, text="Assign category (click or press key)")
        cat_frame.pack(fill=tk.X, padx=10, pady=(4, 8))

        self.cat_buttons: dict[str, ttk.Button] = {}
        self.cat_vars: dict[str, tk.StringVar] = {}

        cols = 4
        for i, (key, slug, display) in enumerate(CATEGORIES):
            var = tk.StringVar(value=f" [{key}] {display}")
            self.cat_vars[slug] = var
            btn = ttk.Button(
                cat_frame,
                textvariable=var,
                command=lambda s=slug: self.assign_category(s),
            )
            row = i // cols
            col = i % cols
            btn.grid(row=row, column=col, sticky=tk.EW, padx=3, pady=2)
            self.cat_buttons[slug] = btn

        # Make columns equal width
        for c in range(cols):
            cat_frame.columnconfigure(c, weight=1)

    def setup_bindings(self):
        self.bind("<Key>", self.on_key)
        self.protocol("WM_DELETE_WINDOW", self.on_close)

    # ── Key handler ──────────────────────────────────────────────────────

    def on_key(self, event):
        k = event.char.lower()
        if k in KEY_TO_SLUG:
            self.assign_category(KEY_TO_SLUG[k])
        elif k == "n":
            self.next_image()
        elif k == "p":
            self.prev_image()
        elif k == "s":
            self.skip_image()
        elif k == "u":
            self.mark_uncertain()
        elif k == "r":
            self.toggle_review()
        elif k == "\r" or k == " ":
            self.next_image()

    # ── Display ──────────────────────────────────────────────────────────

    def show_current(self):
        if not self.images:
            self.img_label.config(image="", text="No images found", compound=tk.CENTER)
            self.counter_var.set("0 / 0")
            self.filename_var.set("")
            self.current_cat_var.set("")
            return

        if self.idx < 0:
            self.idx = 0
        if self.idx >= len(self.images):
            self.idx = len(self.images) - 1

        img_path = self.images[self.idx]
        self.filename_var.set(f"{self.idx + 1} / {len(self.images)}  —  {img_path.name}")

        # ── Load and display image ────────────────────────────────────────
        try:
            pil_img = Image.open(img_path)
            # Rotate based on EXIF orientation
            try:
                from PIL import ExifTags
                exif = pil_img.getexif()
                orientation = exif.get(0x0112)
                if orientation == 3:
                    pil_img = pil_img.rotate(180, expand=True)
                elif orientation == 6:
                    pil_img = pil_img.rotate(270, expand=True)
                elif orientation == 8:
                    pil_img = pil_img.rotate(90, expand=True)
            except Exception:
                pass

            # Scale to fit
            self.update_idletasks()
            fw = self.img_frame.winfo_width() or 800
            fh = self.img_frame.winfo_height() or 500
            # Leave some padding
            fw = max(fw - 20, 100)
            fh = max(fh - 20, 100)

            pil_img.thumbnail((fw, fh), Image.LANCZOS)
            self.photo = ImageTk.PhotoImage(pil_img)
            self.img_label.config(image=self.photo, text="", compound=tk.CENTER)
        except Exception as e:
            self.img_label.config(image="", text=f"Cannot load image:\n{e}", compound=tk.CENTER)

        # ── Show current classification ───────────────────────────────────
        cls = self._cls(img_path)
        if cls and cls.get("status") == STATUS_CATEGORIZED and cls.get("category"):
            slug = cls["category"]
            name = SLUG_TO_DISPLAY.get(slug, slug)
            self.current_cat_var.set(f"Categorized: {name}")
        elif cls and cls.get("status") == STATUS_UNCERTAIN:
            self.current_cat_var.set("Marked as UNSURE")
        elif cls and cls.get("status") == STATUS_SKIPPED:
            self.current_cat_var.set("Skipped")
        else:
            self.current_cat_var.set("")

        # ── Highlight active category button ──────────────────────────────
        for slug, btn in self.cat_buttons.items():
            if cls and cls.get("category") == slug and cls.get("status") == STATUS_CATEGORIZED:
                btn.state(["pressed"])
            else:
                btn.state(["!pressed"])

        self.counter_var.set(f"{self.idx + 1} / {len(self.images)}")
        self.status_text.set("")

    # ── Actions ──────────────────────────────────────────────────────────

    def assign_category(self, slug):
        if not self.images or self.idx >= len(self.images):
            return
        img_path = self.images[self.idx]
        self._set_cls(img_path, slug, STATUS_CATEGORIZED)
        self.current_cat_var.set(f"Categorized: {SLUG_TO_DISPLAY.get(slug, slug)}")
        for s, btn in self.cat_buttons.items():
            btn.state(["!pressed"] if s != slug else ["pressed"])
        self.status_text.set(f"→ {SLUG_TO_DISPLAY.get(slug, slug)}")
        self.update_idletasks()
        if not self.review_mode:
            self.advance_to_next()

    def skip_image(self):
        if not self.images or self.idx >= len(self.images):
            return
        self._set_cls(self.images[self.idx], None, STATUS_SKIPPED)
        self.current_cat_var.set("Skipped")
        self.status_text.set("→ Skipped")
        self.advance_to_next()

    def mark_uncertain(self):
        if not self.images or self.idx >= len(self.images):
            return
        self._set_cls(self.images[self.idx], None, STATUS_UNCERTAIN)
        self.current_cat_var.set("Unsure")
        self.status_text.set("→ Marked unsure")
        self.advance_to_next()

    def next_image(self):
        if self.idx < len(self.images) - 1:
            self.idx += 1
        self.show_current()

    def prev_image(self):
        if self.idx > 0:
            self.idx -= 1
        self.show_current()

    def advance_to_next(self):
        if not self.review_mode:
            nxt = self.first_uncategorized_index(self.idx + 1)
            if nxt is not None:
                self.idx = nxt
            elif self.idx < len(self.images) - 1:
                self.idx += 1
            else:
                self.status_text.set("All images classified!")
                return
        else:
            if self.idx < len(self.images) - 1:
                self.idx += 1
        self.show_current()

    def toggle_review(self):
        self.review_mode = not self.review_mode
        if self.review_mode:
            self.status_text.set("Review mode ON — showing all images")
        else:
            self.status_text.set("Review mode OFF — skipping classified")
            nxt = self.first_uncategorized_index(0)
            if nxt is None:
                self.status_text.set("All images already classified!")
                self.review_mode = True
                self.review_btn.state(["selected"])
                return
            self.idx = nxt
        self.show_current()

    def open_folder(self):
        d = filedialog.askdirectory(title="Select image folder", initialdir=str(self.img_dir))
        if d:
            self.img_dir = Path(d)
            self.images = []
            self.classifications = {}
            self.load_images()
            self.idx = 0
            self.show_current()
            self.status_text.set(f"Loaded {len(self.images)} images from {self.img_dir.name}")

    def on_close(self):
        self.save_progress()
        self.destroy()


def main():
    img_dir = sys.argv[1] if len(sys.argv) > 1 else None
    app = ImageClassifier(img_dir)
    app.mainloop()


if __name__ == "__main__":
    main()

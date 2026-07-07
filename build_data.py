#!/usr/bin/env python3
"""
Generate js/data.js from classifications.json + fallback IMG array.
Run:  python build_data.py

Priority: new manual classifications (classifications.json) > old IMG array fallback.
"""

import json
import sys
from pathlib import Path
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).parent
IMG_DIR = ROOT / "img"
CLS_PATH = ROOT / "classifications.json"
OUT_PATH = ROOT / "js" / "data.js"

CAT_NAMES = {
    "enseignes": "Enseignes",
    "bipole": "Bipôle",
    "panneaux": "Panneaux",
    "panneaux-sol-geants": "Panneaux sur sol géants",
    "panneaux-chantier": "Panneaux de chantier",
    "panneaux-toiture": "Panneaux sur toiture",
    "signaletique-interieure": "Signalétique intérieure",
    "presentoirs": "Présentoirs",
    "palissades": "Palissades",
    "identite-visuelle": "Identité visuelle des entreprises",
    "habillage-vehicules": "Habillage de véhicules",
    "bureau-vente": "Bureau de vente",
    "habillage-magasins": "Habillage de magasins",
    "impression-numerique": "Impression numérique",
    "panneaux-affichage": "Panneaux d'affichage",
    "stands": "Stands",
    "totems": "Totems",
}

CAT_CONTEXT = {
    "enseignes": {"problem": "Façade qui manque d'impact", "solution": "Enseigne lumineuse ou lettrage sur mesure", "result": "Visibilité 24h/24"},
    "bipole": {"problem": "Besoin d'affichage double face", "solution": "Bipôle publicitaire 360°", "result": "Visibilité dans l'espace public"},
    "panneaux": {"problem": "Messages noyés dans le paysage", "solution": "Panneau standard aux dimensions adaptées", "result": "Impact visuel renforcé"},
    "panneaux-sol-geants": {"problem": "Annonces de grande envergure invisibles", "solution": "Panneau au sol géant à l'entrée", "result": "Captation immédiate du regard"},
    "panneaux-chantier": {"problem": "Palissade de chantier sans message", "solution": "Habillage chantier réglementaire", "result": "Communication et protection"},
    "panneaux-toiture": {"problem": "Toiture inexploitée", "solution": "Panneau sur toiture visible des axes", "result": "Visibilité maximale"},
    "signaletique-interieure": {"problem": "Visiteurs perdus dans vos locaux", "solution": "Signalétique intérieure claire", "result": "Guidage fluide et esthétique"},
    "presentoirs": {"problem": "Produits sans mise en valeur", "solution": "Présentoir sur mesure", "result": "Mise en avant des articles"},
    "palissades": {"problem": "Palissade nue, image négative", "solution": "Habillage de palissade esthétique", "result": "Valorisation du chantier"},
    "identite-visuelle": {"problem": "Marque sans cohérence graphique", "solution": "Identité visuelle complète", "result": "Image professionnelle unifiée"},
    "habillage-vehicules": {"problem": "Véhicules qui passent inaperçus", "solution": "Habillage publicitaire sur mesure", "result": "Marque mobile 24h/24"},
    "bureau-vente": {"problem": "Bureau de vente difficile à repérer", "solution": "Signalétique et habillage dédiés", "result": "Repérage immédiat"},
    "habillage-magasins": {"problem": "Vitrine qui n'attire pas le regard", "solution": "Habillage vitrine et façade", "result": "Attraction client renforcée"},
    "impression-numerique": {"problem": "Supports sans rendu professionnel", "solution": "Impression grand format HD", "result": "Rendu éclatant"},
    "panneaux-affichage": {"problem": "Affichage extérieur sans impact", "solution": "Panneau d'affichage couleurs vives", "result": "Impact maximal sur les passants"},
    "stands": {"problem": "Stand qui ne se démarque pas", "solution": "Stand sur mesure image de marque", "result": "Différenciation en salon"},
    "totems": {"problem": "Entrée sans signal fort", "solution": "Totem vertical haute visibilité", "result": "Identification à distance"},
}

CAT_LIST = list(CAT_NAMES.keys())

VIDEOS = [
    {"cat": "hero", "file": "WhatsApp Video 2026-06-09 at 02.12.48.mp4"},
    {"cat": "hero", "file": "WhatsApp Video 2026-06-09 at 02.31.51.mp4"},
]

# ── Fallback: original IMG array categories (used when manual classification is missing) ──
FALLBACK = {
    "WhatsApp Image 2026-06-09 at 02.12.34.jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.36 (1).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.36 (2).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.36.jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.46 (1).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.46 (2).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.46.jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.47 (1).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.47 (2).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.47 (3).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.47.jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 02.12.48 (1).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.48 (2).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.48 (3).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.48 (4).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.48 (5).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.48 (6).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.48.jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.49 (1).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.49 (2).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.49 (3).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.49 (4).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.12.49.jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 02.31.36.jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.37 (1).jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.37 (2).jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.37.jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.47 (1).jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.47.jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.48 (1).jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.48 (2).jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.48.jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.51 (1).jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.51 (2).jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.51 (3).jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 02.31.51.jpeg": "enseignes",
    "WhatsApp Image 2026-06-09 at 02.31.52 (1).jpeg": "signaletique-interieure",
    "WhatsApp Image 2026-06-09 at 02.31.52 (2).jpeg": "enseignes",
    "WhatsApp Image 2026-06-09 at 02.31.52 (3).jpeg": "totems",
    "WhatsApp Image 2026-06-09 at 02.31.52 (4).jpeg": "presentoirs",
    "WhatsApp Image 2026-06-09 at 02.31.52 (5).jpeg": "panneaux",
    "WhatsApp Image 2026-06-09 at 02.31.52 (6).jpeg": "panneaux",
    "WhatsApp Image 2026-06-09 at 02.31.52.jpeg": "panneaux-sol-geants",
    "WhatsApp Image 2026-06-09 at 02.31.53 (2).jpeg": "panneaux-sol-geants",
    "WhatsApp Image 2026-06-09 at 02.31.53 (3).jpeg": "panneaux-chantier",
    "WhatsApp Image 2026-06-09 at 02.31.53 (4).jpeg": "panneaux-toiture",
    "WhatsApp Image 2026-06-09 at 02.31.53 (5).jpeg": "panneaux-affichage",
    "WhatsApp Image 2026-06-09 at 02.31.53.jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 03.19.17.jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 03.33.33.jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 03.33.37 (1).jpeg": "impression-numerique",
    "WhatsApp Image 2026-06-09 at 03.33.40.jpeg": "enseignes",
    "WhatsApp Image 2026-06-09 at 03.33.41 (1).jpeg": "signaletique-interieure",
    "WhatsApp Image 2026-06-09 at 03.33.41.jpeg": "identite-visuelle",
    "WhatsApp Image 2026-06-09 at 03.33.43.jpeg": "panneaux-affichage",
    "WhatsApp Image 2026-06-09 at 15.59.59 (1).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 15.59.59 (2).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 15.59.59 (3).jpeg": "habillage-vehicules",
    "WhatsApp Image 2026-06-09 at 16.00.00 (2).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 16.00.00 (3).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 16.00.00 (4).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 16.00.00 (6).jpeg": "habillage-magasins",
    "WhatsApp Image 2026-06-09 at 16.00.00.jpeg": "habillage-magasins",
}


def build_dataset():
    """
    Merge new manual classifications + old fallback.
    Priority: new > fallback.
    Also includes images on disk not in either source (as 'pending').
    """
    # Load new manual classifications
    new_cls = {}
    if CLS_PATH.exists():
        raw = json.loads(CLS_PATH.read_text(encoding="utf-8"))
        for c in raw["classifications"]:
            if c.get("status") == "categorized" and c.get("category"):
                new_cls[c["filename"]] = c["category"]

    # Merge: new takes priority, fallback fills gaps
    merged = {}
    for fn, cat in FALLBACK.items():
        merged[fn] = cat
    for fn, cat in new_cls.items():
        merged[fn] = cat  # overwrite with new

    # Also scan disk for any image not in either source
    disk_files = set()
    for f in IMG_DIR.iterdir():
        if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"}:
            disk_files.add(f.name)
    for fn in disk_files:
        if fn not in merged:
            merged[fn] = None  # pending

    # Build image list (skip pending)
    images = []
    by_cat = {}
    for fn, cat in merged.items():
        if cat is None:
            continue
        if cat not in CAT_NAMES:
            print(f"  WARNING: unknown category '{cat}' for {fn}")
            continue
        images.append({"cat": cat, "file": fn})
        by_cat.setdefault(cat, []).append(fn)

    # Pick best cover per category (highest resolution)
    covers = {}
    for cat, filenames in by_cat.items():
        best_fn = None
        best_px = 0
        for fn in filenames:
            fp = IMG_DIR / fn
            if not fp.exists():
                continue
            try:
                with Image.open(fp) as im:
                    w, h = im.size
                    px = w * h
                    if px > best_px:
                        best_px = px
                        best_fn = fn
            except Exception:
                continue
        if best_fn:
            covers[cat] = best_fn

    return images, covers, new_cls, FALLBACK


def js_string(s):
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")


def generate_js(images, covers):
    lines = []
    lines.append("// Generated by build_data.py — do not edit directly.")
    lines.append("// Run `python build_data.py` after updating classifications.json.\n")

    lines.append("const IMG = [")
    for img in images:
        lines.append(f"  {{ cat: '{img['cat']}', file: '{js_string(img['file'])}' }},")
    lines.append("];\n")

    lines.append("const VIDEOS = [")
    for v in VIDEOS:
        lines.append(f"  {{ cat: '{v['cat']}', file: '{js_string(v['file'])}' }},")
    lines.append("];\n")

    lines.append("const catNames = {")
    for slug, name in CAT_NAMES.items():
        lines.append(f"  '{slug}': '{js_string(name)}',")
    lines.append("};\n")

    lines.append("const catContext = {")
    for slug, ctx in CAT_CONTEXT.items():
        p = js_string(ctx["problem"])
        s = js_string(ctx["solution"])
        r = js_string(ctx["result"])
        lines.append(f"  '{slug}': {{ problem: '{p}', solution: '{s}', result: '{r}' }},")
    lines.append("};\n")

    slugs = ", ".join(f"'{s}'" for s in CAT_LIST)
    lines.append(f"const catList = [{slugs}];\n")

    lines.append("const COVERS = {")
    for slug, fn in covers.items():
        lines.append(f"  '{slug}': '{js_string(fn)}',")
    lines.append("};\n")

    lines.append("const path = (f) => `img/${f.replace(/ /g, '%20')}`;")

    return "\n".join(lines)


def main():
    print("Merging manual classifications + fallback IMG array...")
    images, covers, new_cls, fallback = build_dataset()
    new_count = len(new_cls)
    fallback_only = len([fn for fn, cat in fallback.items() if fn not in new_cls])
    print(f"  {new_count} manually classified (priority)")
    print(f"  {fallback_only} from fallback only")
    print(f"  {len(images)} total images in IMG")
    print(f"  {len(covers)} categories with cover images")

    for cat, fn in sorted(covers.items()):
        print(f"    {cat:30s} -> {fn}")

    js = generate_js(images, covers)
    OUT_PATH.write_text(js, encoding="utf-8")
    print(f"\nWritten {OUT_PATH} ({len(js)} bytes)")


if __name__ == "__main__":
    main()

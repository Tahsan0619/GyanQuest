"""Download Wikimedia Commons photos for Chemistry Lab Mission 1 book."""
import json
import os
import re
import ssl
import time
import urllib.parse
import urllib.request

ssl._create_default_https_context = ssl._create_unverified_context

UA = {"User-Agent": "GyanQuestBookBot/1.0 (educational; GyanQuest curriculum assets)"}
OUT = os.path.join(
    os.path.dirname(__file__),
    "..",
    "games",
    "chemistry-lab",
    "assets",
    "book",
)


def api_info(title: str):
    q = urllib.parse.quote(title)
    url = (
        "https://commons.wikimedia.org/w/api.php"
        f"?action=query&titles=File:{q}&prop=imageinfo"
        "&iiprop=url|mime|size|extmetadata&format=json"
    )
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.load(r)
    for p in data["query"]["pages"].values():
        if "imageinfo" in p:
            return p["imageinfo"][0]
    return None


def clean_url(u: str) -> str:
    return u.split("?")[0]


def download(local: str, title: str, credits: list) -> bool:
    info = api_info(title)
    if not info:
        print("MISS", title)
        return False
    url = clean_url(info["url"])
    path = os.path.join(OUT, local)
    print("GET", title, "->", local, info.get("size"), info.get("mime"))
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    with open(path, "wb") as f:
        f.write(data)
    meta = info.get("extmetadata") or {}
    lic = (meta.get("LicenseShortName") or {}).get("value", "?")
    artist = (meta.get("Artist") or {}).get("value", "?")
    artist = re.sub("<[^>]+>", "", artist or "?")[:100].strip()
    credits.append(
        {
            "file": local,
            "source": f"https://commons.wikimedia.org/wiki/File:{title}",
            "license": lic,
            "artist": artist,
            "bytes": len(data),
        }
    )
    print("  saved", len(data), "bytes", lic)
    return True


def main():
    os.makedirs(OUT, exist_ok=True)
    credits = []
    primary = [
        ("m1-cover.jpg", "Home-grown_salt_(ClNa)_crystals._01.jpg"),
        ("m1-particles.jpg", "Salt_crystals_under_the_microscope.jpg"),
        ("m1-states.jpg", "Ice_water_vapor.jpg"),
        ("m1-lattice.jpg", "Close_Up_View_Of_Sodium_Chloride_Crystals.jpg"),
        ("m1-boil.jpg", "Boiling_water.jpg"),
        ("m1-condense.jpg", "Condensation.jpg"),
    ]
    for local, title in primary:
        try:
            download(local, title, credits)
        except Exception as e:
            print("ERR", local, title, e)
        time.sleep(0.9)

    cond = os.path.join(OUT, "m1-condense.jpg")
    if os.path.exists(cond) and os.path.getsize(cond) < 50000:
        print("condensation small; trying alternatives...")
        for title in (
            "Condensation_on_a_cold_glass.jpg",
            "Water_condensation.jpg",
            "Condensation_on_window.jpg",
            "Dew_on_a_spider_web.jpg",
            "Water_drops_on_glass.jpg",
        ):
            try:
                if download("m1-condense.jpg", title, credits):
                    break
            except Exception as e:
                print("ERR", title, e)
            time.sleep(0.9)

    for title in ("Ice_melting.jpg", "Melting_ice.jpg", "Ice_cube_melting.jpg"):
        try:
            if download("m1-melt.jpg", title, credits):
                break
        except Exception as e:
            print("ERR", title, e)
        time.sleep(0.9)

    # keep last credit per filename
    by_file = {}
    for c in credits:
        by_file[c["file"]] = c
    final = list(by_file.values())
    with open(os.path.join(OUT, "CREDITS.json"), "w", encoding="utf-8") as f:
        json.dump(final, f, indent=2)
    print("DONE", len(final), "files")
    for c in final:
        print(c["file"], c["bytes"], c["license"])


if __name__ == "__main__":
    main()

"""
Atlas AI - Motion Design Video Generator
Creates a professional motion design video showcasing the Atlas AI platform:
multi-model AI routing, model comparison, and pricing.
Based on the Atlas AI website screenshots.
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import VideoClip
import math


# === Configuration ===
WIDTH, HEIGHT = 1920, 1080
FPS = 30
DURATION = 24  # seconds (6 scenes x 4s each)

# Atlas AI color palette (dark theme with blue/purple accents)
COLORS = {
    "bg_dark": (10, 10, 20),
    "bg_card": (20, 22, 40),
    "primary": (90, 100, 255),       # Atlas blue-purple
    "accent_blue": (60, 140, 255),   # bright blue
    "accent_purple": (140, 80, 255), # purple
    "accent_cyan": (0, 210, 255),    # cyan
    "accent_pink": (255, 80, 160),   # pink
    "accent_green": (0, 220, 130),   # green for pricing
    "accent_orange": (255, 160, 40), # orange
    "white": (255, 255, 255),
    "gray": (140, 140, 170),
    "dark_gray": (60, 60, 90),
}

# Font paths
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def get_font(bold=False, size=40):
    size = max(1, int(size))
    try:
        path = FONT_BOLD if bold else FONT_REGULAR
        return ImageFont.truetype(path, size)
    except (OSError, IOError):
        return ImageFont.load_default()


# === Easing Functions ===
def ease_in_out_cubic(t):
    t = max(0.0, min(1.0, t))
    if t < 0.5:
        return 4 * t * t * t
    return 1 - pow(-2 * t + 2, 3) / 2


def ease_out_elastic(t):
    t = max(0.0, min(1.0, t))
    if t == 0 or t == 1:
        return t
    return pow(2, -10 * t) * math.sin((t * 10 - 0.75) * (2 * math.pi / 3)) + 1


def ease_out_back(t):
    t = max(0.0, min(1.0, t))
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2)


def ease_out_quart(t):
    t = max(0.0, min(1.0, t))
    return 1 - pow(1 - t, 4)


def lerp(a, b, t):
    return a + (b - a) * max(0, min(1, t))


def lerp_color(c1, c2, t):
    t = max(0, min(1, t))
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def alpha_color(color, alpha):
    return tuple(max(0, min(255, int(c * alpha))) for c in color)


# === Drawing Utilities ===
def draw_gradient_bg(draw, w, h, t, color1=None, color2=None):
    """Draw animated gradient background."""
    c1 = color1 or (10, 10, 25)
    c2 = color2 or (20, 15, 50)
    shift = math.sin(t * 0.3) * 0.1
    for y in range(h):
        ratio = y / h + shift
        ratio = max(0, min(1, ratio))
        color = lerp_color(c1, c2, ratio)
        draw.line([(0, y), (w, y)], fill=color)


def draw_rounded_rect(draw, x1, y1, x2, y2, radius, fill=None, outline=None, width=1):
    """Draw a rounded rectangle."""
    # Ensure valid coordinates
    if x2 - x1 < 2 * radius or y2 - y1 < 2 * radius:
        radius = max(0, min((x2 - x1) // 2, (y2 - y1) // 2))
    if x2 <= x1 or y2 <= y1:
        return
    if fill:
        draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
        draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
        draw.pieslice([x1, y1, x1 + 2 * radius, y1 + 2 * radius], 180, 270, fill=fill)
        draw.pieslice([x2 - 2 * radius, y1, x2, y1 + 2 * radius], 270, 360, fill=fill)
        draw.pieslice([x1, y2 - 2 * radius, x1 + 2 * radius, y2], 90, 180, fill=fill)
        draw.pieslice([x2 - 2 * radius, y2 - 2 * radius, x2, y2], 0, 90, fill=fill)
    if outline:
        draw.arc([x1, y1, x1 + 2 * radius, y1 + 2 * radius], 180, 270, fill=outline, width=width)
        draw.arc([x2 - 2 * radius, y1, x2, y1 + 2 * radius], 270, 360, fill=outline, width=width)
        draw.arc([x1, y2 - 2 * radius, x1 + 2 * radius, y2], 90, 180, fill=outline, width=width)
        draw.arc([x2 - 2 * radius, y2 - 2 * radius, x2, y2], 0, 90, fill=outline, width=width)
        draw.line([(x1 + radius, y1), (x2 - radius, y1)], fill=outline, width=width)
        draw.line([(x1 + radius, y2), (x2 - radius, y2)], fill=outline, width=width)
        draw.line([(x1, y1 + radius), (x1, y2 - radius)], fill=outline, width=width)
        draw.line([(x2, y1 + radius), (x2, y2 - radius)], fill=outline, width=width)


def draw_glowing_circle(draw, cx, cy, radius, color, thickness=2, glow_layers=3):
    """Draw a circle with glow effect."""
    for i in range(glow_layers, 0, -1):
        r = radius + i * 4
        a = 0.15 / i
        c = alpha_color(color, a)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=c, width=thickness + i)
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], outline=color, width=thickness)


def draw_particle(draw, x, y, size, color, alpha=1.0):
    col = alpha_color(color, alpha)
    draw.ellipse([x - size, y - size, x + size, y + size], fill=col)


def draw_floating_particles(draw, w, h, t, count=20, seed=42):
    """Draw floating ambient particles."""
    np.random.seed(seed)
    colors = [COLORS["accent_blue"], COLORS["accent_purple"], COLORS["accent_cyan"]]
    for i in range(count):
        speed = 0.2 + np.random.random() * 0.5
        px = (np.random.random() * w + t * 40 * speed) % w
        py = (np.random.random() * h + math.sin(t * speed * 0.8 + i) * 30) % h
        size = 1.5 + np.random.random() * 2.5
        alpha = 0.3 + 0.3 * math.sin(t * 2 + i)
        draw_particle(draw, px, py, size, colors[i % len(colors)], alpha)


def draw_grid_lines(draw, w, h, t, alpha=0.05):
    """Draw subtle animated grid."""
    spacing = 80
    col = alpha_color(COLORS["primary"], alpha)
    offset = (t * 20) % spacing
    for x in range(0, w + spacing, spacing):
        draw.line([(x + offset, 0), (x + offset, h)], fill=col, width=1)
    for y in range(0, h + spacing, spacing):
        draw.line([(0, y + offset * 0.5), (w, y + offset * 0.5)], fill=col, width=1)


def draw_text_centered(draw, text, cx, cy, font, color):
    """Draw text centered at position."""
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2), text, fill=color, font=font)


# === SCENE 1: Atlas AI Logo & Intro (0-4s) ===
def scene_intro(draw, w, h, t, progress):
    """Dramatic intro with Atlas AI logo reveal."""
    draw_grid_lines(draw, w, h, t, 0.03)
    draw_floating_particles(draw, w, h, t, 15)

    # Converging energy lines
    if progress < 0.6:
        line_p = ease_in_out_cubic(progress / 0.6)
        num_lines = 24
        for i in range(num_lines):
            angle = (2 * math.pi * i / num_lines)
            outer = 900 * (1 - line_p * 0.7)
            inner = 10
            x1 = w // 2 + outer * math.cos(angle)
            y1 = h // 2 + outer * math.sin(angle)
            x2 = w // 2 + inner * math.cos(angle + math.pi)
            y2 = h // 2 + inner * math.sin(angle + math.pi)
            color = lerp_color(COLORS["accent_blue"], COLORS["accent_purple"], i / num_lines)
            a = 0.5 * (1 - line_p)
            draw.line([(x1, y1), (x2, y2)], fill=alpha_color(color, a), width=2)

    # Central glowing orb
    orb_p = ease_out_elastic(min(1, progress / 0.5))
    orb_radius = orb_p * 60
    pulse = 0.9 + 0.1 * math.sin(t * 5)
    r = orb_radius * pulse
    if r > 1:
        # Outer glow rings
        for ring in range(4):
            ring_r = r + ring * 20 + 10 * math.sin(t * 3 + ring)
            ring_a = 0.15 - ring * 0.03
            draw_glowing_circle(draw, w // 2, h // 2, ring_r,
                                lerp_color(COLORS["accent_blue"], COLORS["accent_purple"], ring / 4),
                                2, 0)
            draw.ellipse([w // 2 - ring_r, h // 2 - ring_r, w // 2 + ring_r, h // 2 + ring_r],
                         outline=alpha_color(COLORS["primary"], ring_a), width=2)

        # Core orb
        for layer in range(int(r), 0, -2):
            ratio = layer / r
            c = lerp_color(COLORS["accent_cyan"], COLORS["primary"], ratio)
            a = (1 - ratio) * 0.4
            draw.ellipse([w // 2 - layer, h // 2 - layer, w // 2 + layer, h // 2 + layer],
                         fill=alpha_color(c, a))

    # "ATLAS" text - big reveal
    if progress > 0.3:
        text_p = ease_out_back(min(1, (progress - 0.3) / 0.4))
        font_size = int(110 * text_p)
        if font_size > 5:
            font = get_font(bold=True, size=font_size)
            text = "ATLAS"
            y_pos = h // 2 - 80
            # Glow
            glow = alpha_color(COLORS["accent_blue"], 0.3 * text_p)
            draw_text_centered(draw, text, w // 2 + 2, y_pos + 2, font, glow)
            draw_text_centered(draw, text, w // 2, y_pos, font, COLORS["white"])

    # "AI" text with accent color
    if progress > 0.45:
        ai_p = ease_out_back(min(1, (progress - 0.45) / 0.35))
        font_size = int(110 * ai_p)
        if font_size > 5:
            font = get_font(bold=True, size=font_size)
            # Position "AI" to the right of "ATLAS"
            atlas_font = get_font(bold=True, size=110)
            atlas_bbox = draw.textbbox((0, 0), "ATLAS", font=atlas_font)
            atlas_w = atlas_bbox[2] - atlas_bbox[0]
            ai_x = w // 2 + atlas_w // 2 + 20
            y_pos = h // 2 - 80
            draw_text_centered(draw, "AI", ai_x, y_pos, font, COLORS["accent_cyan"])

    # Tagline
    if progress > 0.6:
        sub_p = ease_in_out_cubic(min(1, (progress - 0.6) / 0.3))
        font = get_font(bold=False, size=32)
        tagline = "L'IA multi-modele qui travaille pour vous"
        c = alpha_color(COLORS["gray"], sub_p)
        y_offset = 40 * (1 - sub_p)
        draw_text_centered(draw, tagline, w // 2, h // 2 + 50 + y_offset, font, c)

    # Subtitle badge
    if progress > 0.75:
        badge_p = ease_out_back(min(1, (progress - 0.75) / 0.25))
        font = get_font(bold=True, size=22)
        badge_text = "Multi-Model  |  Routing Intelligent  |  API Unifiee"
        c = alpha_color(COLORS["accent_blue"], badge_p * 0.8)
        draw_text_centered(draw, badge_text, w // 2, h // 2 + 120, font, c)


# === SCENE 2: AI Models Showcase (4-8s) ===
def scene_models(draw, w, h, t, progress):
    """Showcase the AI models with animated cards."""
    draw_grid_lines(draw, w, h, t, 0.02)
    draw_floating_particles(draw, w, h, t, 10, seed=99)

    # Section title
    title_p = ease_out_back(min(1, progress / 0.3))
    font_title = get_font(bold=True, size=52)
    c = alpha_color(COLORS["white"], title_p)
    draw_text_centered(draw, "Modeles IA Disponibles", w // 2, 100, font_title, c)

    # Subtitle
    if progress > 0.1:
        sub_p = ease_in_out_cubic(min(1, (progress - 0.1) / 0.25))
        font_sub = get_font(bold=False, size=26)
        draw_text_centered(draw, "Acces unifie aux meilleurs modeles d'intelligence artificielle",
                           w // 2, 165, font_sub, alpha_color(COLORS["gray"], sub_p))

    # Model cards
    models = [
        ("GPT-4", "OpenAI", COLORS["accent_green"]),
        ("Claude", "Anthropic", COLORS["accent_orange"]),
        ("Gemini", "Google", COLORS["accent_blue"]),
        ("Mistral", "Mistral AI", COLORS["accent_purple"]),
        ("LLaMA", "Meta", COLORS["accent_cyan"]),
    ]

    card_w, card_h = 300, 320
    total_w = len(models) * card_w + (len(models) - 1) * 30
    start_x = (w - total_w) // 2

    for i, (name, company, color) in enumerate(models):
        delay = 0.15 + i * 0.1
        card_p = ease_out_back(min(1, max(0, (progress - delay)) / 0.35))

        if card_p > 0.01:
            cx = start_x + i * (card_w + 30) + card_w // 2
            cy = h // 2 + 60
            y_offset = 50 * (1 - card_p)

            # Card background
            x1 = cx - card_w // 2
            y1 = cy - card_h // 2 + y_offset
            x2 = cx + card_w // 2
            y2 = cy + card_h // 2 + y_offset

            draw_rounded_rect(draw, x1, y1, x2, y2, 16,
                              fill=alpha_color(COLORS["bg_card"], card_p),
                              outline=alpha_color(color, card_p * 0.4), width=2)

            # Model icon circle
            icon_y = y1 + 80
            icon_r = 40 * card_p
            draw_glowing_circle(draw, cx, icon_y, icon_r, alpha_color(color, card_p), 3, 2)

            # Model initial letter in circle
            init_font = get_font(bold=True, size=int(36 * card_p))
            draw_text_centered(draw, name[0], cx, icon_y, init_font, alpha_color(color, card_p))

            # Model name
            name_font = get_font(bold=True, size=int(28 * card_p))
            draw_text_centered(draw, name, cx, y1 + 155, name_font, alpha_color(COLORS["white"], card_p))

            # Company
            comp_font = get_font(bold=False, size=int(18 * card_p))
            draw_text_centered(draw, company, cx, y1 + 195, comp_font, alpha_color(COLORS["gray"], card_p))

            # Animated status bar
            bar_y = y1 + 240
            bar_w = int(200 * card_p * ease_in_out_cubic(min(1, max(0, progress - delay - 0.2) / 0.3)))
            draw_rounded_rect(draw, cx - 100, bar_y, cx - 100 + bar_w, bar_y + 6, 3,
                              fill=alpha_color(color, card_p * 0.8))
            draw_rounded_rect(draw, cx - 100, bar_y, cx + 100, bar_y + 6, 3,
                              outline=alpha_color(COLORS["dark_gray"], card_p * 0.3))

            # "Disponible" text
            status_font = get_font(bold=False, size=int(15 * card_p))
            draw_text_centered(draw, "Disponible", cx, bar_y + 25, status_font,
                               alpha_color(COLORS["accent_green"], card_p))


# === SCENE 3: Routing Intelligent Feature (8-12s) ===
def scene_routing(draw, w, h, t, progress):
    """Show the intelligent routing feature with animated flow."""
    draw_grid_lines(draw, w, h, t, 0.02)
    draw_floating_particles(draw, w, h, t, 8, seed=77)

    # Title
    title_p = ease_out_back(min(1, progress / 0.3))
    font_title = get_font(bold=True, size=48)
    draw_text_centered(draw, "Routing Intelligent", w // 2, 90, font_title,
                       alpha_color(COLORS["white"], title_p))

    sub_p = ease_in_out_cubic(min(1, max(0, progress - 0.1) / 0.25))
    font_sub = get_font(bold=False, size=24)
    draw_text_centered(draw, "Chaque requete est automatiquement dirigee vers le modele optimal",
                       w // 2, 150, font_sub, alpha_color(COLORS["gray"], sub_p))

    # Central hub
    hub_p = ease_out_elastic(min(1, max(0, progress - 0.2) / 0.4))
    hub_x, hub_y = w // 2, h // 2 + 40
    hub_r = 70 * hub_p

    # Hub glow
    if hub_r > 1:
        for ring in range(5):
            rr = hub_r + ring * 15 + 5 * math.sin(t * 3 + ring)
            draw.ellipse([hub_x - rr, hub_y - rr, hub_x + rr, hub_y + rr],
                         outline=alpha_color(COLORS["primary"], 0.1 - ring * 0.015), width=2)

        draw.ellipse([hub_x - hub_r, hub_y - hub_r, hub_x + hub_r, hub_y + hub_r],
                     fill=alpha_color(COLORS["bg_card"], hub_p),
                     outline=alpha_color(COLORS["primary"], hub_p * 0.6), width=3)

        hub_font = get_font(bold=True, size=int(22 * hub_p))
        draw_text_centered(draw, "Atlas", hub_x, hub_y - 10, hub_font, alpha_color(COLORS["white"], hub_p))
        hub_font2 = get_font(bold=True, size=int(18 * hub_p))
        draw_text_centered(draw, "Router", hub_x, hub_y + 15, hub_font2, alpha_color(COLORS["accent_cyan"], hub_p))

    # Model nodes around the hub
    models_pos = [
        ("GPT-4", -280, -120, COLORS["accent_green"]),
        ("Claude", -280, 120, COLORS["accent_orange"]),
        ("Gemini", 280, -120, COLORS["accent_blue"]),
        ("Mistral", 280, 120, COLORS["accent_purple"]),
        ("LLaMA", 0, -220, COLORS["accent_cyan"]),
    ]

    for i, (name, ox, oy, color) in enumerate(models_pos):
        delay = 0.3 + i * 0.08
        node_p = ease_out_back(min(1, max(0, progress - delay) / 0.3))

        if node_p > 0.01:
            nx = hub_x + ox
            ny = hub_y + oy
            nr = 40 * node_p

            # Connection line from hub to node with animated dash
            if node_p > 0.3:
                line_p = ease_in_out_cubic(min(1, (node_p - 0.3) / 0.7))
                end_x = hub_x + ox * line_p
                end_y = hub_y + oy * line_p
                draw.line([(hub_x, hub_y), (end_x, end_y)],
                          fill=alpha_color(color, 0.3 * node_p), width=2)

                # Animated particle along line
                particle_t = (t * 2 + i * 0.5) % 1
                px = lerp(hub_x, nx, particle_t)
                py = lerp(hub_y, ny, particle_t)
                draw_particle(draw, px, py, 4, color, 0.8)

            # Node circle
            draw.ellipse([nx - nr, ny - nr, nx + nr, ny + nr],
                         fill=alpha_color(COLORS["bg_card"], node_p),
                         outline=alpha_color(color, node_p * 0.7), width=2)

            # Node label
            node_font = get_font(bold=True, size=int(16 * node_p))
            draw_text_centered(draw, name, nx, ny, node_font, alpha_color(COLORS["white"], node_p))

    # Request labels on the left
    if progress > 0.5:
        requests = ["Code", "Analyse", "Creative", "Recherche"]
        for i, req in enumerate(requests):
            req_p = ease_out_back(min(1, max(0, progress - 0.5 - i * 0.08) / 0.25))
            rx = 120 - 60 * (1 - req_p)
            ry = 300 + i * 90
            req_font = get_font(bold=False, size=int(20 * req_p))
            draw_rounded_rect(draw, rx - 60, ry - 18, rx + 60, ry + 18, 10,
                              fill=alpha_color(COLORS["bg_card"], req_p),
                              outline=alpha_color(COLORS["accent_blue"], req_p * 0.4), width=1)
            draw_text_centered(draw, req, rx, ry, req_font, alpha_color(COLORS["white"], req_p))

            # Arrow from request to hub
            if req_p > 0.5:
                arrow_p = ease_in_out_cubic((req_p - 0.5) / 0.5)
                ax = lerp(rx + 70, hub_x - hub_r, arrow_p)
                ay = lerp(ry, hub_y, arrow_p)
                draw.line([(rx + 70, ry), (ax, ay)],
                          fill=alpha_color(COLORS["accent_blue"], 0.2 * req_p), width=1)


# === SCENE 4: Model Comparison Feature (12-16s) ===
def scene_comparison(draw, w, h, t, progress):
    """Show model comparison with animated bars."""
    draw_grid_lines(draw, w, h, t, 0.02)
    draw_floating_particles(draw, w, h, t, 8, seed=55)

    # Title
    title_p = ease_out_back(min(1, progress / 0.3))
    font_title = get_font(bold=True, size=48)
    draw_text_centered(draw, "Comparaison de Modeles", w // 2, 90, font_title,
                       alpha_color(COLORS["white"], title_p))

    sub_p = ease_in_out_cubic(min(1, max(0, progress - 0.1) / 0.25))
    font_sub = get_font(bold=False, size=24)
    draw_text_centered(draw, "Comparez les performances en temps reel",
                       w // 2, 150, font_sub, alpha_color(COLORS["gray"], sub_p))

    # Comparison cards side by side
    models_data = [
        ("GPT-4", COLORS["accent_green"], [85, 92, 78, 88]),
        ("Claude", COLORS["accent_orange"], [90, 88, 95, 82]),
        ("Gemini", COLORS["accent_blue"], [82, 85, 80, 90]),
    ]
    categories = ["Precision", "Vitesse", "Creativite", "Raisonnement"]

    card_w = 480
    total = len(models_data) * card_w + (len(models_data) - 1) * 40
    start_x = (w - total) // 2

    for mi, (model_name, color, scores) in enumerate(models_data):
        delay = 0.2 + mi * 0.12
        card_p = ease_out_back(min(1, max(0, progress - delay) / 0.35))

        if card_p > 0.01:
            cx = start_x + mi * (card_w + 40) + card_w // 2
            card_y1 = 210
            card_y2 = h - 80

            # Card
            draw_rounded_rect(draw, cx - card_w // 2, card_y1, cx + card_w // 2, card_y2, 16,
                              fill=alpha_color(COLORS["bg_card"], card_p),
                              outline=alpha_color(color, card_p * 0.3), width=2)

            # Model header
            header_font = get_font(bold=True, size=int(32 * card_p))
            draw_text_centered(draw, model_name, cx, card_y1 + 50, header_font,
                               alpha_color(color, card_p))

            # Score bars
            for si, (cat, score) in enumerate(zip(categories, scores)):
                bar_delay = delay + 0.1 + si * 0.06
                bar_p = ease_out_quart(min(1, max(0, progress - bar_delay) / 0.3))

                by = card_y1 + 110 + si * 120
                bar_x1 = cx - card_w // 2 + 40
                bar_x2 = cx + card_w // 2 - 40
                bar_total_w = bar_x2 - bar_x1

                # Category label
                cat_font = get_font(bold=False, size=int(18 * card_p))
                draw.text((bar_x1, by), cat, fill=alpha_color(COLORS["gray"], card_p * bar_p), font=cat_font)

                # Score text
                score_font = get_font(bold=True, size=int(18 * card_p))
                score_text = f"{int(score * bar_p)}%"
                draw.text((bar_x2 - 50, by), score_text, fill=alpha_color(COLORS["white"], card_p * bar_p),
                          font=score_font)

                # Bar background
                bar_by = by + 30
                draw_rounded_rect(draw, bar_x1, bar_by, bar_x2, bar_by + 10, 5,
                                  fill=alpha_color(COLORS["dark_gray"], card_p * 0.3))

                # Bar fill
                fill_w = int(bar_total_w * (score / 100) * bar_p)
                if fill_w > 4:
                    draw_rounded_rect(draw, bar_x1, bar_by, bar_x1 + fill_w, bar_by + 10, 5,
                                      fill=alpha_color(color, card_p * 0.8))


# === SCENE 5: Pricing Plans (16-20s) ===
def scene_pricing(draw, w, h, t, progress):
    """Animated pricing section."""
    draw_grid_lines(draw, w, h, t, 0.02)
    draw_floating_particles(draw, w, h, t, 8, seed=33)

    # Title
    title_p = ease_out_back(min(1, progress / 0.3))
    font_title = get_font(bold=True, size=48)
    draw_text_centered(draw, "Tarification Simple et Transparente", w // 2, 80, font_title,
                       alpha_color(COLORS["white"], title_p))

    # Plans
    plans = [
        ("Starter", "Gratuit", "0 EUR", ["100 requetes/jour", "3 modeles", "API basique"],
         COLORS["accent_blue"], False),
        ("Pro", "Populaire", "29 EUR/mois", ["Illimite", "Tous les modeles", "API avancee", "Support prioritaire"],
         COLORS["accent_purple"], True),
        ("Enterprise", "Sur mesure", "Custom", ["Volume illimite", "Modeles prives", "SLA garanti", "Support dedie"],
         COLORS["accent_cyan"], False),
    ]

    card_w, card_h = 480, 560
    total = len(plans) * card_w + (len(plans) - 1) * 50
    start_x = (w - total) // 2

    for i, (name, badge, price, features, color, highlighted) in enumerate(plans):
        delay = 0.15 + i * 0.12
        card_p = ease_out_back(min(1, max(0, progress - delay) / 0.35))

        if card_p > 0.01:
            cx = start_x + i * (card_w + 50) + card_w // 2
            y_off = -20 if highlighted else 0
            card_y1 = 160 + y_off
            card_y2 = card_y1 + card_h

            # Card background - highlighted gets brighter border
            border_w = 3 if highlighted else 2
            border_alpha = 0.7 if highlighted else 0.3
            draw_rounded_rect(draw, cx - card_w // 2, card_y1, cx + card_w // 2, card_y2, 20,
                              fill=alpha_color(COLORS["bg_card"], card_p),
                              outline=alpha_color(color, card_p * border_alpha), width=border_w)

            # "Populaire" badge for Pro
            if highlighted and card_p > 0.5:
                badge_font = get_font(bold=True, size=14)
                bx = cx
                by = card_y1 - 2
                draw_rounded_rect(draw, bx - 55, by - 12, bx + 55, by + 12, 8,
                                  fill=alpha_color(color, card_p))
                draw_text_centered(draw, badge, bx, by, badge_font, alpha_color(COLORS["white"], card_p))

            # Plan name
            name_font = get_font(bold=True, size=int(34 * card_p))
            draw_text_centered(draw, name, cx, card_y1 + 60, name_font, alpha_color(COLORS["white"], card_p))

            # Price
            price_font = get_font(bold=True, size=int(44 * card_p))
            draw_text_centered(draw, price, cx, card_y1 + 130, price_font, alpha_color(color, card_p))

            # Separator line
            sep_y = card_y1 + 180
            sep_w = int(card_w * 0.6 * card_p)
            draw.line([(cx - sep_w // 2, sep_y), (cx + sep_w // 2, sep_y)],
                      fill=alpha_color(COLORS["dark_gray"], card_p * 0.3), width=1)

            # Features
            feat_font = get_font(bold=False, size=int(20 * card_p))
            for fi, feat in enumerate(features):
                feat_delay = delay + 0.15 + fi * 0.05
                feat_p = ease_in_out_cubic(min(1, max(0, progress - feat_delay) / 0.25))
                fy = card_y1 + 220 + fi * 50
                # Checkmark
                check_c = alpha_color(COLORS["accent_green"], card_p * feat_p)
                draw_text_centered(draw, "+", cx - card_w // 2 + 60, fy, feat_font, check_c)
                # Feature text
                draw.text((cx - card_w // 2 + 80, fy - 10), feat,
                           fill=alpha_color(COLORS["gray"], card_p * feat_p), font=feat_font)

            # CTA button
            if progress > delay + 0.3:
                btn_p = ease_out_back(min(1, (progress - delay - 0.3) / 0.2))
                btn_y = card_y2 - 70
                btn_w = int(200 * btn_p)
                if btn_w > 10:
                    fill_col = alpha_color(color, card_p * 0.8) if highlighted else None
                    outline_col = alpha_color(color, card_p * 0.6)
                    draw_rounded_rect(draw, cx - btn_w // 2, btn_y - 20, cx + btn_w // 2, btn_y + 20, 12,
                                      fill=fill_col, outline=outline_col, width=2)
                    btn_font = get_font(bold=True, size=int(18 * btn_p))
                    text_col = COLORS["white"] if highlighted else color
                    draw_text_centered(draw, "Commencer", cx, btn_y, btn_font, alpha_color(text_col, card_p))


# === SCENE 6: Outro / CTA (20-24s) ===
def scene_outro(draw, w, h, t, progress):
    """Final call to action with Atlas AI branding."""
    draw_grid_lines(draw, w, h, t, 0.03)
    draw_floating_particles(draw, w, h, t, 25, seed=11)

    # Orbiting particles
    for i in range(12):
        orbit_p = ease_in_out_cubic(min(1, progress / 0.4))
        angle = t * 1.5 + (2 * math.pi * i / 12)
        radius = 250 * orbit_p
        px = w // 2 + radius * math.cos(angle)
        py = h // 2 + radius * math.sin(angle) * 0.4
        size = 4 + 2 * math.sin(t * 3 + i)
        colors = [COLORS["accent_blue"], COLORS["accent_purple"], COLORS["accent_cyan"]]
        draw_particle(draw, px, py, size, colors[i % 3], 0.7)

    # Large decorative rings
    ring_p = ease_out_elastic(min(1, progress / 0.5))
    for ring in range(3):
        r = (200 + ring * 60) * ring_p
        rot = t * 0.3 * (1 + ring * 0.2)
        c = lerp_color(COLORS["accent_blue"], COLORS["accent_purple"], ring / 3)
        draw.ellipse([w // 2 - r, h // 2 - r, w // 2 + r, h // 2 + r],
                     outline=alpha_color(c, 0.1 + 0.05 * math.sin(t * 2 + ring)), width=2)

    # Main text - "Atlas AI"
    if progress > 0.15:
        text_p = ease_out_back(min(1, (progress - 0.15) / 0.35))
        font = get_font(bold=True, size=int(90 * text_p))
        y = h // 2 - 80

        # Glow
        glow = alpha_color(COLORS["primary"], 0.3 * text_p)
        for ox, oy in [(3, 3), (-3, -3), (3, -3), (-3, 3)]:
            draw_text_centered(draw, "Atlas AI", w // 2 + ox, y + oy, font, glow)
        draw_text_centered(draw, "Atlas AI", w // 2, y, font, alpha_color(COLORS["white"], text_p))

    # Tagline
    if progress > 0.4:
        tag_p = ease_in_out_cubic(min(1, (progress - 0.4) / 0.25))
        font = get_font(bold=False, size=30)
        draw_text_centered(draw, "L'IA multi-modele qui travaille pour vous",
                           w // 2, h // 2 + 20, font, alpha_color(COLORS["gray"], tag_p))

    # CTA Button
    if progress > 0.55:
        btn_p = ease_out_back(min(1, (progress - 0.55) / 0.25))
        btn_w = int(350 * btn_p)
        btn_h = int(56 * btn_p)
        btn_y = h // 2 + 90
        if btn_w > 20:
            draw_rounded_rect(draw, w // 2 - btn_w // 2, btn_y - btn_h // 2,
                              w // 2 + btn_w // 2, btn_y + btn_h // 2, 14,
                              fill=alpha_color(COLORS["primary"], btn_p * 0.9),
                              outline=alpha_color(COLORS["accent_cyan"], btn_p * 0.5), width=2)
            btn_font = get_font(bold=True, size=int(24 * btn_p))
            draw_text_centered(draw, "Commencer Gratuitement", w // 2, btn_y, btn_font,
                               alpha_color(COLORS["white"], btn_p))

    # Website URL
    if progress > 0.7:
        url_p = ease_in_out_cubic(min(1, (progress - 0.7) / 0.2))
        font = get_font(bold=False, size=20)
        draw_text_centered(draw, "atlas-ai.fr", w // 2, h // 2 + 160, font,
                           alpha_color(COLORS["accent_blue"], url_p * 0.7))

    # Feature pills at bottom
    if progress > 0.6:
        pills = ["Multi-Model", "API Unifiee", "Routing IA", "Temps Reel"]
        pill_total = len(pills) * 200 + (len(pills) - 1) * 20
        pill_start = (w - pill_total) // 2
        for i, pill in enumerate(pills):
            pill_p = ease_out_back(min(1, max(0, progress - 0.6 - i * 0.05) / 0.2))
            px = pill_start + i * 220 + 100
            py = h - 120
            draw_rounded_rect(draw, px - 90, py - 18, px + 90, py + 18, 10,
                              outline=alpha_color(COLORS["primary"], pill_p * 0.4), width=1)
            pill_font = get_font(bold=False, size=int(17 * pill_p))
            draw_text_centered(draw, pill, px, py, pill_font, alpha_color(COLORS["accent_cyan"], pill_p * 0.8))


# === Main Frame Generator ===
def make_frame(t):
    """Generate a single frame at time t."""
    img = Image.new("RGB", (WIDTH, HEIGHT), COLORS["bg_dark"])
    draw = ImageDraw.Draw(img)

    # Draw gradient background
    draw_gradient_bg(draw, WIDTH, HEIGHT, t)

    # Scene routing (6 scenes, 4s each)
    scene_dur = DURATION / 6
    scene_idx = min(5, int(t / scene_dur))
    scene_t = t - scene_idx * scene_dur
    progress = scene_t / scene_dur

    scenes = [scene_intro, scene_models, scene_routing, scene_comparison, scene_pricing, scene_outro]
    scenes[scene_idx](draw, WIDTH, HEIGHT, t, progress)

    # Cross-fade transitions between scenes (0.5s overlap)
    fade_dur = 0.5
    time_in_scene = t - scene_idx * scene_dur
    time_to_end = (scene_idx + 1) * scene_dur - t

    arr = np.array(img, dtype=np.float64)

    # Fade in at scene start (except first scene uses global fade)
    if scene_idx > 0 and time_in_scene < fade_dur:
        alpha = time_in_scene / fade_dur
        arr = arr * ease_in_out_cubic(alpha)

    # Fade out at scene end (except last scene uses global fade)
    if scene_idx < 5 and time_to_end < fade_dur:
        alpha = time_to_end / fade_dur
        arr = arr * ease_in_out_cubic(alpha)

    # Global fade in/out
    if t < 0.8:
        arr = arr * ease_in_out_cubic(t / 0.8)
    elif t > DURATION - 1.5:
        arr = arr * ease_in_out_cubic((DURATION - t) / 1.5)

    return np.clip(arr, 0, 255).astype(np.uint8)


def main():
    print("=== Atlas AI - Motion Design Video Generator ===")
    print(f"Resolution: {WIDTH}x{HEIGHT}")
    print(f"Duration: {DURATION}s at {FPS} FPS")
    print(f"Total frames: {DURATION * FPS}")
    print(f"Scenes: 6 (Intro, Models, Routing, Comparison, Pricing, Outro)")
    print()

    output_path = "motion_design.mp4"

    print("Creating video clip...")
    clip = VideoClip(make_frame, duration=DURATION)

    print(f"Rendering to {output_path}...")
    clip.write_videofile(
        output_path,
        fps=FPS,
        codec="libx264",
        audio=False,
        preset="medium",
        logger="bar",
    )

    print(f"\nVideo saved to: {output_path}")
    print("Done!")


if __name__ == "__main__":
    main()

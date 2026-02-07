"""
Motion Design Video Generator
Creates a modern motion design video with geometric animations,
smooth transitions, color gradients, and kinetic typography.
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import VideoClip
import math


# === Configuration ===
WIDTH, HEIGHT = 1920, 1080
FPS = 30
DURATION = 12  # seconds

# Color palette (modern motion design)
COLORS = {
    "bg_dark": (15, 15, 30),
    "accent1": (0, 200, 255),     # cyan
    "accent2": (255, 80, 120),    # pink
    "accent3": (120, 80, 255),    # purple
    "accent4": (255, 200, 0),     # gold
    "white": (255, 255, 255),
}


def ease_in_out_cubic(t):
    """Smooth easing function."""
    if t < 0.5:
        return 4 * t * t * t
    return 1 - pow(-2 * t + 2, 3) / 2


def ease_out_elastic(t):
    """Elastic easing for bouncy effects."""
    if t == 0 or t == 1:
        return t
    return pow(2, -10 * t) * math.sin((t * 10 - 0.75) * (2 * math.pi / 3)) + 1


def ease_out_back(t):
    """Overshoot easing."""
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2)


def lerp_color(c1, c2, t):
    """Linear interpolation between two colors."""
    t = max(0, min(1, t))
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def draw_gradient_bg(draw, w, h, t):
    """Draw an animated gradient background."""
    shift = t * 0.3
    for y in range(h):
        ratio = y / h
        r = int(15 + 20 * math.sin(ratio * math.pi + shift))
        g = int(15 + 10 * math.sin(ratio * math.pi + shift + 1))
        b = int(30 + 30 * math.sin(ratio * math.pi + shift + 2))
        draw.line([(0, y), (w, y)], fill=(max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b))))


def draw_particle(draw, x, y, size, color, alpha=1.0):
    """Draw a glowing particle."""
    col = tuple(int(c * alpha) for c in color)
    draw.ellipse([x - size, y - size, x + size, y + size], fill=col)
    # Glow effect
    for i in range(3):
        glow_size = size + (i + 1) * 3
        glow_alpha = alpha * (0.3 - i * 0.08)
        glow_col = tuple(max(0, min(255, int(c * glow_alpha))) for c in color)
        draw.ellipse(
            [x - glow_size, y - glow_size, x + glow_size, y + glow_size],
            outline=glow_col, width=2
        )


def draw_rotating_shape(draw, cx, cy, radius, sides, angle, color, thickness=3):
    """Draw a rotating polygon."""
    points = []
    for i in range(sides):
        a = angle + (2 * math.pi * i / sides)
        px = cx + radius * math.cos(a)
        py = cy + radius * math.sin(a)
        points.append((px, py))
    points.append(points[0])  # close shape
    draw.line(points, fill=color, width=thickness)


def draw_expanding_circle(draw, cx, cy, radius, color, thickness=2):
    """Draw an expanding circle with fade."""
    if radius > 0:
        draw.ellipse(
            [cx - radius, cy - radius, cx + radius, cy + radius],
            outline=color, width=thickness
        )


def scene_intro(draw, w, h, t, progress):
    """Scene 1: Intro with expanding circles and title (0-3s)."""
    # Expanding circles from center
    num_circles = 5
    for i in range(num_circles):
        delay = i * 0.15
        local_t = max(0, progress - delay)
        if local_t > 0:
            ease_t = ease_in_out_cubic(min(1, local_t / 0.6))
            radius = ease_t * (300 + i * 80)
            alpha = max(0, 1 - ease_t * 0.7)
            color = lerp_color(COLORS["accent1"], COLORS["accent3"], i / num_circles)
            color = tuple(int(c * alpha) for c in color)
            draw_expanding_circle(draw, w // 2, h // 2, radius, color, 3)

    # Central rotating hexagon
    hex_progress = ease_out_elastic(min(1, progress / 0.8))
    hex_radius = hex_progress * 120
    draw_rotating_shape(draw, w // 2, h // 2, hex_radius, 6, t * 0.5, COLORS["accent1"], 4)

    # Inner rotating triangle
    tri_progress = ease_out_elastic(min(1, max(0, (progress - 0.2)) / 0.8))
    tri_radius = tri_progress * 60
    draw_rotating_shape(draw, w // 2, h // 2, tri_radius, 3, -t * 0.8, COLORS["accent2"], 3)

    # Title text
    if progress > 0.3:
        text_progress = ease_out_back(min(1, (progress - 0.3) / 0.5))
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(72 * text_progress))
        except (OSError, IOError):
            font = ImageFont.load_default()

        title = "MOTION DESIGN"
        bbox = draw.textbbox((0, 0), title, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        tx = (w - tw) // 2
        ty = h // 2 + 160

        # Text shadow
        shadow_color = tuple(int(c * 0.3) for c in COLORS["accent1"])
        draw.text((tx + 3, ty + 3), title, fill=shadow_color, font=font)
        draw.text((tx, ty), title, fill=COLORS["white"], font=font)


def scene_geometric(draw, w, h, t, progress):
    """Scene 2: Geometric shapes animation (3-6s)."""
    # Floating particles
    np.random.seed(42)
    for i in range(30):
        speed = 0.3 + np.random.random() * 0.7
        px = (np.random.random() * w + t * 100 * speed) % w
        py = (np.random.random() * h + math.sin(t * speed + i) * 50) % h
        size = 2 + np.random.random() * 4
        color_choice = [COLORS["accent1"], COLORS["accent2"], COLORS["accent3"], COLORS["accent4"]]
        color = color_choice[i % 4]
        draw_particle(draw, px, py, size, color, 0.6)

    # Grid of rotating squares
    grid_progress = ease_in_out_cubic(min(1, progress / 0.5))
    cols, rows = 6, 4
    spacing_x = w // (cols + 1)
    spacing_y = h // (rows + 1)

    for row in range(rows):
        for col in range(cols):
            idx = row * cols + col
            delay = idx * 0.02
            local_p = ease_out_elastic(min(1, max(0, (progress - delay)) / 0.6))

            cx = spacing_x * (col + 1)
            cy = spacing_y * (row + 1)
            size = local_p * 30
            angle = t * (0.5 + idx * 0.05) + idx * 0.3

            color = lerp_color(COLORS["accent1"], COLORS["accent2"], (col + row) / (cols + rows))
            draw_rotating_shape(draw, cx, cy, size, 4, angle, color, 2)

    # Central large rotating shape
    center_size = 150 * ease_in_out_cubic(min(1, progress / 0.4))
    draw_rotating_shape(draw, w // 2, h // 2, center_size, 5, t * 0.3, COLORS["accent4"], 4)
    draw_rotating_shape(draw, w // 2, h // 2, center_size * 0.7, 5, -t * 0.5, COLORS["accent3"], 3)


def scene_kinetic_typography(draw, w, h, t, progress):
    """Scene 3: Kinetic typography (6-9s)."""
    words = ["CREATE", "ANIMATE", "INSPIRE", "DESIGN"]

    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 90)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except (OSError, IOError):
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Animated lines behind text
    for i in range(8):
        line_progress = ease_in_out_cubic(min(1, max(0, (progress - i * 0.05)) / 0.4))
        y = 100 + i * 120
        x_start = w * (1 - line_progress)
        color = lerp_color(COLORS["accent1"], COLORS["accent3"], i / 8)
        color = tuple(int(c * 0.3) for c in color)
        draw.line([(x_start, y), (w, y)], fill=color, width=2)

    # Staggered word reveals
    for i, word in enumerate(words):
        delay = i * 0.2
        word_progress = ease_out_back(min(1, max(0, (progress - delay)) / 0.4))

        if word_progress > 0:
            bbox = draw.textbbox((0, 0), word, font=font_large)
            tw = bbox[2] - bbox[0]

            x = (w - tw) // 2 + (1 - word_progress) * 300
            y = 180 + i * 180

            # Color for each word
            word_colors = [COLORS["accent1"], COLORS["accent2"], COLORS["accent3"], COLORS["accent4"]]
            color = word_colors[i]
            alpha = min(1, word_progress * 1.5)
            final_color = tuple(int(c * alpha) for c in color)

            draw.text((x, y), word, fill=final_color, font=font_large)

    # Decorative dots
    for i in range(20):
        dot_progress = min(1, max(0, (progress - 0.3 - i * 0.02)) / 0.3)
        if dot_progress > 0:
            dx = 100 + (i % 5) * 40
            dy = 150 + (i // 5) * 250
            size = dot_progress * 5
            draw.ellipse([dx - size, dy - size, dx + size, dy + size], fill=COLORS["accent1"])


def scene_outro(draw, w, h, t, progress):
    """Scene 4: Outro with convergence effect (9-12s)."""
    # Converging lines
    num_lines = 16
    for i in range(num_lines):
        angle = (2 * math.pi * i / num_lines) + t * 0.2
        line_progress = ease_in_out_cubic(min(1, progress / 0.6))

        outer_dist = 800 * (1 - line_progress * 0.3)
        inner_dist = 50 * line_progress

        x1 = w // 2 + outer_dist * math.cos(angle)
        y1 = h // 2 + outer_dist * math.sin(angle)
        x2 = w // 2 + inner_dist * math.cos(angle + math.pi)
        y2 = h // 2 + inner_dist * math.sin(angle + math.pi)

        color = lerp_color(COLORS["accent1"], COLORS["accent2"], i / num_lines)
        draw.line([(x1, y1), (x2, y2)], fill=color, width=2)

    # Central pulsing circle
    pulse = 0.8 + 0.2 * math.sin(t * 4)
    radius = 80 * ease_out_elastic(min(1, progress / 0.5)) * pulse
    draw_expanding_circle(draw, w // 2, h // 2, radius, COLORS["accent4"], 4)
    draw_expanding_circle(draw, w // 2, h // 2, radius * 0.6, COLORS["accent1"], 3)

    # Orbiting particles
    for i in range(8):
        orbit_angle = t * 2 + (2 * math.pi * i / 8)
        orbit_radius = 200 * ease_in_out_cubic(min(1, progress / 0.4))
        px = w // 2 + orbit_radius * math.cos(orbit_angle)
        py = h // 2 + orbit_radius * math.sin(orbit_angle) * 0.5
        draw_particle(draw, px, py, 6, COLORS["accent3"], 0.8)

    # Final text
    if progress > 0.4:
        text_p = ease_out_back(min(1, (progress - 0.4) / 0.4))
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(60 * text_p))
        except (OSError, IOError):
            font = ImageFont.load_default()

        text = "ALEX AI"
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        tx = (w - tw) // 2
        ty = h // 2 - 30

        # Glow behind text
        glow_color = tuple(int(c * 0.4) for c in COLORS["accent1"])
        for offset in [(2, 2), (-2, -2), (2, -2), (-2, 2)]:
            draw.text((tx + offset[0], ty + offset[1]), text, fill=glow_color, font=font)
        draw.text((tx, ty), text, fill=COLORS["white"], font=font)

        # Subtitle
        if progress > 0.6:
            sub_p = ease_in_out_cubic(min(1, (progress - 0.6) / 0.3))
            try:
                sub_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
            except (OSError, IOError):
                sub_font = ImageFont.load_default()
            subtitle = "Motion Design Studio"
            bbox2 = draw.textbbox((0, 0), subtitle, font=sub_font)
            stw = bbox2[2] - bbox2[0]
            sx = (w - stw) // 2
            sy = ty + 80
            sub_color = tuple(int(c * sub_p) for c in COLORS["accent1"])
            draw.text((sx, sy), subtitle, fill=sub_color, font=sub_font)


def make_frame(t):
    """Generate a single frame at time t."""
    img = Image.new("RGB", (WIDTH, HEIGHT), COLORS["bg_dark"])
    draw = ImageDraw.Draw(img)

    # Draw gradient background
    draw_gradient_bg(draw, WIDTH, HEIGHT, t)

    # Determine which scene to show based on time
    scene_duration = DURATION / 4

    if t < scene_duration:
        # Scene 1: Intro (0-3s)
        progress = t / scene_duration
        scene_intro(draw, WIDTH, HEIGHT, t, progress)
    elif t < scene_duration * 2:
        # Scene 2: Geometric shapes (3-6s)
        progress = (t - scene_duration) / scene_duration
        scene_geometric(draw, WIDTH, HEIGHT, t, progress)
    elif t < scene_duration * 3:
        # Scene 3: Kinetic typography (6-9s)
        progress = (t - scene_duration * 2) / scene_duration
        scene_kinetic_typography(draw, WIDTH, HEIGHT, t, progress)
    else:
        # Scene 4: Outro (9-12s)
        progress = (t - scene_duration * 3) / scene_duration
        scene_outro(draw, WIDTH, HEIGHT, t, progress)

    # Global fade in/out
    if t < 0.5:
        alpha = t / 0.5
        pixels = np.array(img)
        pixels = (pixels * alpha).astype(np.uint8)
        img = Image.fromarray(pixels)
    elif t > DURATION - 1:
        alpha = (DURATION - t) / 1.0
        pixels = np.array(img)
        pixels = (pixels * max(0, alpha)).astype(np.uint8)
        img = Image.fromarray(pixels)

    return np.array(img)


def main():
    print("=== Motion Design Video Generator ===")
    print(f"Resolution: {WIDTH}x{HEIGHT}")
    print(f"Duration: {DURATION}s at {FPS} FPS")
    print(f"Total frames: {DURATION * FPS}")
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

import os
from PIL import Image
import numpy as np
from collections import deque

img_path = r'public/assets/WhatsApp Image 2026-09-16 at 15.35.31.jpeg'
img = Image.open(img_path).convert('RGBA')
data = np.array(img)
height, width = data.shape[:2]

r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

# The illustration elements have non-black color or are part of the drawn artwork:
# - Pink blob: r > 200, g > 150, b > 150
# - Mascot orange: r > 200, g > 100, b < 100
# - Mat orange: r > 200, g > 100, b < 100
# - Speech bubble: pinkish/white
# - Plant: green leaves (g > r, g > b) and pink pot
# - Bottle body: cream/white (r > 200, g > 200, b > 180)
# - Bottle cap & handle: black (r < 40, g < 40, b < 40), located at x: 300..425, y: 560..675
# - Spout: white tip at x: 325..365, y: 550..585

# Let's define the outer background flood-fill with high precision
visited = np.zeros((height, width), dtype=bool)
is_outer_black = np.zeros((height, width), dtype=bool)

# Bottle structure mask:
# Cap is from x: 305 to 415, y: 630 to 675
# Handle is loop from x: 325 to 395, y: 575 to 635
# Spout is at x: 330 to 365, y: 550 to 585
def is_bottle_part(x, y):
    # Cap
    if 305 <= x <= 415 and 630 <= y <= 675:
        return True
    # Handle outer arc
    if 325 <= x <= 395 and 575 <= y <= 635:
        # Check if inside handle hole
        if 345 <= x <= 375 and 595 <= y <= 630:
            return False # Inside hole
        return True
    # Spout
    if 330 <= x <= 365 and 550 <= y <= 585:
        return True
    return False

# Flood fill from image perimeter
queue = deque()
for x in range(width):
    queue.append((x, 0))
    queue.append((x, height - 1))
for y in range(height):
    queue.append((0, y))
    queue.append((width - 1, y))

while queue:
    x, y = queue.popleft()
    if x < 0 or x >= width or y < 0 or y >= height:
        continue
    if visited[y, x]:
        continue
    visited[y, x] = True
    
    # If this pixel is part of the bottle cap/handle/spout, stop
    if is_bottle_part(x, y):
        continue
        
    # Check if pixel is dark background
    if r[y, x] < 30 and g[y, x] < 30 and b[y, x] < 30:
        is_outer_black[y, x] = True
        queue.append((x + 1, y))
        queue.append((x - 1, y))
        queue.append((x, y + 1))
        queue.append((x, y - 1))

# Set alpha to 0 for outer black
data[is_outer_black, 3] = 0

out_img = Image.fromarray(data)
bbox = out_img.getbbox()
cropped = out_img.crop(bbox)

out_path = r'public/assets/stretch-hero.png'
cropped.save(out_path, format='PNG')
print(f"Cleanly saved stretch-hero.png to {out_path} with size {cropped.size}")

import os
from PIL import Image
import numpy as np
from collections import deque

img_path = r'public/assets/WhatsApp Image 2026-09-16 at 15.35.31.jpeg'
img = Image.open(img_path).convert('RGBA')
data = np.array(img)
height, width = data.shape[:2]

r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

def is_bottle_structure(x, y):
    if y < 550:
        return False
    elif 550 <= y < 575:
        return 328 <= x <= 365 # Spout
    elif 575 <= y < 630:
        if 348 <= x <= 375 and 595 <= y <= 625:
            return False # Inside hole
        return 308 <= x <= 395 # Handle
    elif 630 <= y < 665:
        return 298 <= x <= 415 # Cap
    elif 665 <= y < 900:
        return 282 <= x <= 425 # Bottle body
    elif y >= 900:
        return x >= 140 # Mat
    return False

# Flood fill from image perimeter
visited = np.zeros((height, width), dtype=bool)

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
    
    if is_bottle_structure(x, y):
        continue
        
    if r[y, x] > 30 or g[y, x] > 30 or b[y, x] > 30:
        continue
        
    data[y, x, 3] = 0
    
    queue.append((x + 1, y))
    queue.append((x - 1, y))
    queue.append((x, y + 1))
    queue.append((x, y - 1))

# Clear bottom-right black under mat
for y in range(850, height):
    for x in range(width):
        if r[y, x] < 30 and g[y, x] < 30 and b[y, x] < 30:
            data[y, x, 3] = 0

# Clear inside the handle hole
for y in range(595, 626):
    for x in range(348, 376):
        if r[y, x] < 30 and g[y, x] < 30 and b[y, x] < 30:
            data[y, x, 3] = 0

out_img = Image.fromarray(data)
bbox = out_img.getbbox()
cropped = out_img.crop(bbox)

out_path = r'public/assets/stretch-hero.png'
cropped.save(out_path, format='PNG')
print(f"Pristine cutout saved to {out_path}, size: {cropped.size}")

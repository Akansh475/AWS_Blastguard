import os
from PIL import Image, ImageFilter
import numpy as np
from collections import deque

img_path = r'public/assets/WhatsApp Image 2026-09-16 at 15.35.31.jpeg'
img = Image.open(img_path).convert('RGBA')
data = np.array(img)

height, width = data.shape[:2]
r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

# Black background detection:
# In the original jpeg, black background pixels are dark (brightness < 45)
brightness = 0.299 * r + 0.587 * g + 0.114 * b
is_dark = (brightness < 45)

# Flood fill from the outer edges to ONLY remove outer black
visited = np.zeros((height, width), dtype=bool)
is_outer_bg = np.zeros((height, width), dtype=bool)

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
    
    if is_dark[y, x]:
        is_outer_bg[y, x] = True
        queue.append((x + 1, y))
        queue.append((x - 1, y))
        queue.append((x, y + 1))
        queue.append((x, y - 1))

# Set alpha to 0 for outer background
data[is_outer_bg, 3] = 0

# Smooth the edge transition to eliminate dark fringing
# Find boundary pixels of is_outer_bg
kernel_size = 3
mask = Image.fromarray((~is_outer_bg).astype(np.uint8) * 255)
# Smooth mask
mask = mask.filter(ImageFilter.GaussianBlur(radius=1.2))

# Apply smooth mask to alpha
smooth_alpha = np.array(mask)
data[:, :, 3] = smooth_alpha

# Also crop tight to the illustration with a small padding
# Find bounding box
non_empty = np.where(smooth_alpha > 10)
min_y, max_y = np.min(non_empty[0]), np.max(non_empty[0])
min_x, max_x = np.min(non_empty[1]), np.max(non_empty[1])

pad = 20
min_y = max(0, min_y - pad)
max_y = min(height, max_y + pad)
min_x = max(0, min_x - pad)
max_x = min(width, max_x + pad)

cropped_data = data[min_y:max_y, min_x:max_x]
out_img = Image.fromarray(cropped_data)

out_path = r'public/assets/stretch-mascot.png'
out_img.save(out_path, format='PNG')
print(f"Pristine mascot illustration saved to {out_path}, size: {out_img.size}")

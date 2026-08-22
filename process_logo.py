from PIL import Image

def remove_white_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If the pixel is pure white or very close to white
        if r > 240 and g > 240 and b > 240:
            # Calculate transparency falloff
            diff = min(255 - r, 255 - g, 255 - b)
            if diff < 5:
                new_data.append((255, 255, 255, 0))
            else:
                # Partial transparency for smooth antialiasing
                alpha_val = int((diff / 15.0) * 255)
                new_data.append((r, g, b, min(255, alpha_val)))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Auto-crop the transparent borders so the logo and text fill maximum canvas
    bbox = img.getbbox()
    if bbox:
        # Add 10px padding
        w, h = img.size
        crop_box = (
            max(0, bbox[0] - 8),
            max(0, bbox[1] - 8),
            min(w, bbox[2] + 8),
            min(h, bbox[3] + 8)
        )
        img = img.crop(crop_box)
        
    img.save(output_path, "PNG")
    print(f"Done! New size: {img.size}")

if __name__ == "__main__":
    remove_white_background("public/assets/moeys-custom-logo.png", "public/assets/moeys-custom-logo-transparent.png")

import os
import shutil
import subprocess

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
temp_dir = os.path.join(root_dir, "vite_temp_project")

print("1. Creating React TypeScript Vite template in temporary folder...")
subprocess.run(
    ["npx", "-y", "create-vite@latest", "vite_temp_project", "--template", "react-ts", "--no-interactive"],
    cwd=root_dir,
    check=True,
    shell=True
)

print("2. Moving template files to workspace root without overwriting Excel/Plan files...")
for item in os.listdir(temp_dir):
    src_path = os.path.join(temp_dir, item)
    dst_path = os.path.join(root_dir, item)
    
    if os.path.exists(dst_path):
        if os.path.isdir(dst_path):
            for sub in os.listdir(src_path):
                shutil.move(os.path.join(src_path, sub), os.path.join(dst_path, sub))
            os.rmdir(src_path)
        else:
            if item in ["Plan.md", "Jobs-sheet.xlsx"]:
                print(f"Skipping existing file: {item}")
            else:
                os.remove(dst_path)
                shutil.move(src_path, dst_path)
    else:
        shutil.move(src_path, dst_path)

print("3. Removing temporary directory...")
if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)

print("4. Installing project dependencies (npm install)...")
subprocess.run(["npm", "install"], cwd=root_dir, check=True, shell=True)

print("5. Installing specific prototype dependencies...")
subprocess.run(
    ["npm", "install", "xlsx", "@tanstack/react-virtual", "lucide-react"],
    cwd=root_dir,
    check=True,
    shell=True
)

print("6. Installing dev dependencies (@types/node)...")
subprocess.run(
    ["npm", "install", "-D", "@types/node"],
    cwd=root_dir,
    check=True,
    shell=True
)

print("SUCCESS: Vite React TS project initialized and all dependencies installed!")

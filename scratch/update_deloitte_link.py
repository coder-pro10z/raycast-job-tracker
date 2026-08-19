import pandas as pd
import json

file_path = "c:/Users/Praveen/Desktop/Job-Tracker/sheets/Master_Job_Tracker_Verified.xlsx"

# 1. Update the Excel file
print("Updating Excel file...")
df = pd.read_excel(file_path)

# Find Deloitte
deloitte_mask = df['Company Name'].str.contains('Deloitte', case=False, na=False)

if deloitte_mask.any():
    print(f"Found {deloitte_mask.sum()} Deloitte rows.")
    df.loc[deloitte_mask, 'Career Page'] = 'https://southasiacareers.deloitte.com/go/Deloitte-India/718244/'
    df.to_excel(file_path, index=False)
    print("Excel file updated.")
else:
    print("Deloitte not found in Excel.")

# 2. Update the verified links cache if it exists
cache_path = "c:/Users/Praveen/Desktop/Job-Tracker/scratch/verified_links_cache.json"
try:
    with open(cache_path, 'r') as f:
        cache = json.load(f)
    if "Deloitte" in cache:
        cache["Deloitte"]["Career Page"] = 'https://southasiacareers.deloitte.com/go/Deloitte-India/718244/'
    elif "Deloitte " in cache:
        cache["Deloitte "]["Career Page"] = 'https://southasiacareers.deloitte.com/go/Deloitte-India/718244/'
    with open(cache_path, 'w') as f:
        json.dump(cache, f, indent=2)
    print("Cache updated.")
except Exception as e:
    print("Cache not updated:", e)

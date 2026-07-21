import pandas as pd
import json

# 1. Read and filter the DataFrame
df = pd.read_csv('pharmacy.csv')
filtered_df = df[['id', 'name', 'weight', 'expiryDate', 'price']].copy()

month_map = {
    'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
    'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
    'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
}

def reformat_date(date_val):
    if pd.isna(date_val):
        return ""
    
    date_str = str(date_val).strip()
    
    # If it's already in YYYY-MM format, leave it alone
    if len(date_str) == 7 and date_str[:4].isdigit() and date_str[4] == '-':
        return date_str

    parts = date_str.split('-')
    if len(parts) != 2:
        return date_str

    part1, part2 = parts[0].strip(), parts[1].strip()

    # Case 1: First part is month, second part is year (e.g., "Feb-29")
    if part1.upper() in month_map:
        month_num = month_map[part1.upper()]
        year_num = f"20{part2}" if len(part2) == 2 else part2
        return f"{year_num}-{month_num}"

    # Case 2: Second part is month, first part is year (e.g., "27-Dec")
    elif part2.upper() in month_map:
        month_num = month_map[part2.upper()]
        year_num = f"20{part1}" if len(part1) == 2 else part1
        return f"{year_num}-{month_num}"

    return date_str

# Apply the flexible parser
filtered_df['expiryDate'] = filtered_df['expiryDate'].apply(reformat_date)

# 3. Convert rows to dicts and dump as single-line JSON array
records = filtered_df.to_dict(orient='records')
formatted_rows = [json.dumps(row) for row in records]
json_content = "[\n  " + ",\n  ".join(formatted_rows) + "\n]"

# 4. Save to file
with open('pharmacy.json', 'w') as f:
    f.write(json_content)

print("Successfully converted pharmacy.csv to pharmacy.json!")
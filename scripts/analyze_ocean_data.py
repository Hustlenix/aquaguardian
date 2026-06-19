#!/usr/bin/env python3
"""
AquaGuardian Ocean Impact Analytics Engine
Multi-language utility (Python 3) for parsing, validating, and aggregating 
real ocean plastic collection metrics and environmental impact data.
"""

import json
import os
import sys
from datetime import datetime, timezone
from typing import Dict, Any, List

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_PATH = os.path.join(ROOT_DIR, 'database.json')
OUTPUT_PATH = os.path.join(ROOT_DIR, 'src', 'data', 'ocean_analysis.json')

def load_database() -> Dict[str, Any]:
    if not os.path.exists(DATABASE_PATH):
        print(f"[ERROR] database.json not found at {DATABASE_PATH}", file=sys.stderr)
        return {"collections": [], "totalPlastic": 0}
    
    with open(DATABASE_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def analyze_impact(data: Dict[str, Any]) -> Dict[str, Any]:
    collections: List[Dict[str, Any]] = data.get("collections", [])
    total_items = data.get("totalPlastic", sum(c.get("amount", 0) for c in collections))
    
    # Calculate key metrics
    total_weight_kg = round(total_items * 0.025, 2)  # Avg 25g per item
    co2_offset_kg = round(total_weight_kg * 1.5, 2)    # ~1.5kg CO2 per kg plastic recycled
    
    location_summary: Dict[str, int] = {}
    for entry in collections:
        loc = entry.get("location", "Unknown Zone")
        location_summary[loc] = location_summary.get(loc, 0) + entry.get("amount", 0)

    summary = {
        "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "metrics": {
            "totalItemsCollected": total_items,
            "totalWeightKg": total_weight_kg,
            "estimatedCo2SavedKg": co2_offset_kg,
            "totalCollectionEvents": len(collections),
            "topCollectionZone": max(location_summary, key=location_summary.get) if location_summary else "N/A",
        },
        "locationBreakdown": location_summary,
        "scientificReferences": [
            {
                "source": "UN Environment Programme (UNEP)",
                "topic": "Global Marine Litter and Microplastics Assessment",
                "link": "https://www.unep.org/resources/report/from-pollution-to-solution"
            },
            {
                "source": "The Ocean Cleanup Scientific Studies",
                "topic": "River Plastic Emissions & Ocean Accumulation Zones",
                "link": "https://theoceancleanup.com/scientific-publications/"
            },
            {
                "source": "National Oceanic and Atmospheric Administration (NOAA)",
                "topic": "Marine Debris Program Data",
                "link": "https://marinedebris.noaa.gov/"
            }
        ]
    }
    return summary

def main():
    print("[INFO] Running AquaGuardian Ocean Analytics Engine (Python)...")
    data = load_database()
    analysis = analyze_impact(data)
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(analysis, f, indent=2)
    
    print(f"[SUCCESS] Analytics saved to {OUTPUT_PATH}")
    print(f"         Total Items Processed: {analysis['metrics']['totalItemsCollected']}")
    print(f"         Est. CO2 Saved: {analysis['metrics']['estimatedCo2SavedKg']} kg")

if __name__ == '__main__':
    main()

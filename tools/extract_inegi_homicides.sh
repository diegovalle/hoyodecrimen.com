#!/bin/bash

# Define the input file
FILE="INEGI_exporta_1_1_2026_21_18_23.csv"

# Logic:
# 1. NR > 5: Skip the 4 header/metadata lines and the column names line.
# 2. $1 > 2019: Filter for years after 2019.
# 3. $2 != "Total": Skip the rows where the month name is "Total".
# 4. $12: Extract the 'Ciudad de México' column.
# 5. printf: Format the output into a single line.

awk -v FPAT='([^,]*)|("[^"]*")' '
    NR > 5 && $1 >= 2019 && $2 != "Total" {
        val = $12
        # Remove quotes and internal commas (e.g., "1,200" -> 1200)
        gsub(/[",]/, "", val)
        
        if (val != "") {
            # Print a comma before every value except the first one
            printf "%s%s", (first ? "," : ""), val
            first = 1
        }
    }
    END { print "" } # Add a newline at the very end
' "$FILE"

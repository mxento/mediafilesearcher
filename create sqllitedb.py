import sqlite3
import os

# Define the input text file and output database file names
TEXT_FILE_NAME = 'datafile.txt'
DB_FILE_NAME = 'mediadata.db'
TABLE_NAME = 'data' # The table name as requested

def create_and_populate_db():
    """
    Reads data from datafile.txt and populates an SQLite database.
    Each line from datafile.txt is split into size and path.
    """
    if not os.path.exists(TEXT_FILE_NAME):
        print(f"Error: '{TEXT_FILE_NAME}' not found in the current directory.")
        print("Please make sure 'datafile.txt' is in the same folder as this script.")
        return

    # Remove existing db file if it exists to ensure a fresh start
    if os.path.exists(DB_FILE_NAME):
        os.remove(DB_FILE_NAME)
        print(f"Removed existing '{DB_FILE_NAME}' to create a fresh one.")

    conn = None
    try:
        # Connect to SQLite database (creates it if it doesn't exist)
        conn = sqlite3.connect(DB_FILE_NAME)
        cursor = conn.cursor()

        # Create table with 'size' and 'path' columns
        # Path is TEXT, Size is TEXT as it contains units like 'G', 'M', 'K'
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
                size TEXT,
                path TEXT
            )
        ''')
        conn.commit()
        print(f"Table '{TABLE_NAME}' created successfully in '{DB_FILE_NAME}'.")

        # Read data from the text file and insert into the database
        with open(TEXT_FILE_NAME, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        data_to_insert = []
        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Assuming format "SIZE    ./PATH"
            parts = line.split(None, 1) # Split only on the first whitespace
            if len(parts) == 2:
                size, path = parts[0], parts[1]
                data_to_insert.append((size, path))
            else:
                print(f"Skipping malformed line: '{line}'")

        if data_to_insert:
            cursor.executemany(f"INSERT INTO {TABLE_NAME} (size, path) VALUES (?, ?)", data_to_insert)
            conn.commit()
            print(f"Successfully inserted {len(data_to_insert)} records into '{TABLE_NAME}'.")
        else:
            print("No valid data found to insert from 'datafile.txt'.")

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if conn:
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    create_and_populate_db()

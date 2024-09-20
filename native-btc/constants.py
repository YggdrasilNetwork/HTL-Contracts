from dotenv import load_dotenv
import os

# Load variables from .env file
load_dotenv()

# Get the values from the environment variables
token = os.getenv("TOKEN")
a1 = os.getenv("A1")
pb1 = os.getenv("PB1")
pk1 = os.getenv("PK1")
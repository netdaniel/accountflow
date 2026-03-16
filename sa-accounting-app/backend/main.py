from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from tax_engine import calculate_vat201, process_sa_payroll, calculate_vat
from bank_service import mock_bank_data

# Load environment variables
load_dotenv()

# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="South Africa Accounting API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint - API info
@app.get("/")
def root():
    return {
        "service": "South Africa Accounting API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "transactions": "/transactions/",
            "pnl_report": "/reports/pnl",
            "vat201": "/reports/vat201",
            "payroll": "/payroll/calculate",
            "bank_feeds": "/bank/feeds"
        }
    }

# Calculate VAT for South Africa (15%) [cite: 486]
@app.post("/transactions/")
def create_transaction(value: float, desc: str, vat_type: str = "Output"):
    if not supabase:
        return {"error": "Supabase not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables."}
    
    vat = calculate_vat(abs(value), vat_type)
    data = {
        "value": value,
        "amount": abs(value),
        "description": desc,
        "vat_type": vat_type,
        "vat_amount": vat["vat_amount"]
    }
    result = supabase.table("transactions").insert(data).execute()
    return {"message": "Transaction recorded", "vat": vat, "data": result.data}

# Simple Profit and Loss Summary [cite: 368, 458]
@app.get("/reports/pnl")
def get_pnl():
    if not supabase:
        return {"error": "Supabase not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables."}
    
    result = supabase.table("transactions").select("*").execute()
    transactions = result.data or []
    
    income = sum(t.get("value", 0) for t in transactions if t.get("value", 0) > 0)
    expenses = sum(abs(t.get("value", 0)) for t in transactions if t.get("value", 0) < 0)
    
    return {"net_profit": income - expenses, "income": income, "expenses": expenses}

# VAT201 Report for SARS eFiling
@app.get("/reports/vat201")
def get_vat201():
    if not supabase:
        return {"error": "Supabase not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables."}
    
    result = supabase.table("transactions").select("*").execute()
    transactions = result.data or []
    
    vat_report = calculate_vat201(transactions)
    return vat_report

# Get all transactions
@app.get("/transactions/")
def get_transactions():
    if not supabase:
        return {"error": "Supabase not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables."}
    
    result = supabase.table("transactions").select("*").execute()
    return result.data

# Payroll calculation endpoint
@app.post("/payroll/calculate")
def calculate_payroll(gross_salary: float, paye: float, annual_payroll: float = 0):
    """Calculate SA payroll deductions including UIF and SDL"""
    result = process_sa_payroll(gross_salary, paye, annual_payroll)
    return result

# Bank feeds endpoint
@app.get("/bank/feeds")
def get_bank_feeds(bank_name: str = "FNB", use_mock: bool = True):
    """Get bank transaction feeds (mock data for demo)"""
    if use_mock:
        return {"bank": bank_name, "transactions": mock_bank_data(bank_name)}
    return {"bank": bank_name, "transactions": [], "message": "Live API requires authentication"}

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "SA Accounting API"}

# Favicon - prevents 404 errors in browser
@app.get("/favicon.ico")
def favicon():
    return Response(content=b"", media_type="image/x-icon")
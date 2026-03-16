import requests


def fetch_local_bank_data(bank_name: str, api_key: str):
    """
    Fetch bank transaction data from South African banks.
    This would typically use a provider like Stitch or Ozow
    to securely access FNB, Standard Bank, Absa, Capitec, etc.
    """
    endpoints = {
        "FNB": "https://api.stitch.money/fnb/transactions",
        "StandardBank": "https://api.stitch.money/standard-bank/transactions",
        "Absa": "https://api.stitch.money/absa/transactions",
        "Capitec": "https://api.stitch.money/capitec/transactions"
    }
    
    headers = {"Authorization": f"Bearer {api_key}"}
    
    try:
        response = requests.get(endpoints.get(bank_name), headers=headers, timeout=30)
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to fetch data: {response.status_code}", "data": []}
    except requests.exceptions.RequestException as e:
        return {"error": str(e), "data": []}


def mock_bank_data(bank_name: str):
    """Mock bank data for testing without actual API access."""
    return [
        {
            "id": "tx001",
            "date": "2026-03-15",
            "description": "Client Payment - ABC Corp",
            "amount": 15000.00,
            "type": "credit",
            "reference": "INV-001"
        },
        {
            "id": "tx002",
            "date": "2026-03-14",
            "description": "Office Supplies - Makro",
            "amount": -2500.00,
            "type": "debit",
            "reference": "POS-4521"
        },
        {
            "id": "tx003",
            "date": "2026-03-13",
            "description": "Subscription - AWS",
            "amount": -850.50,
            "type": "debit",
            "reference": "AWS-MAR"
        }
    ]

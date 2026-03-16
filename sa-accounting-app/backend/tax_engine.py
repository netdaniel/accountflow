# Constants for South Africa
VAT_RATE = 0.15
UIF_RATE = 0.01  # 1%
SDL_RATE = 0.01  # 1%
UIF_CAP_MONTHLY = 177.12  # Max UIF contribution per month


def calculate_vat201(transactions):
    """Aggregates Output and Input VAT for SARS eFiling."""
    output_vat = sum(t.get('vat_amount', 0) for t in transactions if t.get('vat_type') == 'Output')
    input_vat = sum(t.get('vat_amount', 0) for t in transactions if t.get('vat_type') == 'Input')
    return {
        "output_vat": round(output_vat, 2),
        "input_vat": round(input_vat, 2),
        "net_payable": round(output_vat - input_vat, 2)
    }


def process_sa_payroll(gross_salary: float, paye: float, annual_payroll: float = 0):
    """Calculates statutory deductions for South African employees."""
    # UIF Calculation (capped)
    uif_amount = min(gross_salary * UIF_RATE, UIF_CAP_MONTHLY)
    
    # SDL applies if annual payroll exceeds R500,000
    sdl_amount = gross_salary * SDL_RATE if annual_payroll > 500000 else 0
    
    return {
        "paye": round(paye, 2),
        "uif_employee": round(uif_amount, 2),
        "uif_employer": round(uif_amount, 2),
        "sdl": round(sdl_amount, 2),
        "net_pay": round(gross_salary - paye - uif_amount, 2)
    }


def calculate_vat(amount: float, vat_type: str = 'Output'):
    """Calculate VAT amount for a transaction."""
    vat_amount = amount * VAT_RATE
    return {
        "amount": amount,
        "vat_type": vat_type,
        "vat_amount": round(vat_amount, 2),
        "total_including_vat": round(amount + vat_amount, 2) if vat_type == 'Output' else round(amount, 2)
    }

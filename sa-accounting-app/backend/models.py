from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.ext.declarative import declarative_base
import enum
import datetime

Base = declarative_base()

class AccountType(enum.Enum):
    ASSET = "Asset"
    LIABILITY = "Liability"
    EQUITY = "Equity"
    INCOME = "Income"
    EXPENSE = "Expense"

class ChartOfAccounts(Base):
    __tablename__ = "chart_of_accounts"
    id = Column(Integer, primary_key=True)
    title = Column(String) # e.g., "Cash", "Inventory" [cite: 391]
    description = Column(String)
    category = Column(Enum(AccountType))

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    amount = Column(Float)
    vat_type = Column(String) # 'Output' for Sales, 'Input' for Purchases
    vat_amount = Column(Float, default=0.0)
    description = Column(String)
    is_reconciled = Column(Boolean, default=False)
    value = Column(Float)  # Keep for backward compatibility

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    id_number = Column(String)
    basic_salary = Column(Float)

class PayrollRun(Base):
    __tablename__ = "payroll_runs"
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    gross_pay = Column(Float)
    paye = Column(Float)
    uif_employee = Column(Float) # 1% deduction
    uif_employer = Column(Float) # 1% contribution
    sdl = Column(Float) # 1% contribution
    net_pay = Column(Float)
    pay_period = Column(DateTime, default=datetime.datetime.utcnow)

class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    id = Column(Integer, primary_key=True)
    employee_name = Column(String)
    gross_salary = Column(Float)
    paye = Column(Float)  # Income Tax withheld
    uif_employee = Column(Float)  # 1%
    uif_employer = Column(Float)  # 1%
    sdl = Column(Float)  # 1% (if applicable)
    net_pay = Column(Float)
    pay_period = Column(DateTime, default=datetime.datetime.utcnow)

class BankFeed(Base):
    __tablename__ = "bank_feeds"
    id = Column(Integer, primary_key=True)
    bank_name = Column(String) # FNB, Standard Bank, etc.
    transaction_date = Column(DateTime)
    amount = Column(Float)
    reference = Column(String)
    is_reconciled = Column(Boolean, default=False)
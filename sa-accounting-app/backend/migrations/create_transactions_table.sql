-- Create transactions table for SA Accounting App
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    value FLOAT NOT NULL,
    description TEXT,
    vat_amount FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE transactions IS 'Stores financial transactions with VAT calculations for South Africa';

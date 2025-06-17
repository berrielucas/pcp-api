-- Users of the system
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'operator')) NOT NULL DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Final products to be manufactured
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raw materials used in production
CREATE TABLE raw_materials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    unit TEXT NOT NULL, -- e.g. kg, meter, liter
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory of finished products
CREATE TABLE product_inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity NUMERIC(10,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory of raw materials
CREATE TABLE raw_material_inventory (
    id SERIAL PRIMARY KEY,
    raw_material_id INTEGER REFERENCES raw_materials(id),
    quantity NUMERIC(10,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Production orders
CREATE TABLE production_orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity NUMERIC(10,2) NOT NULL,
    delivery_deadline DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'finished', 'cancelled')) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Materials used in a specific production order
CREATE TABLE order_materials (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES production_orders(id),
    raw_material_id INTEGER REFERENCES raw_materials(id),
    quantity_used NUMERIC(10,2) NOT NULL
);

-- Resources like machines or operators
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('machine', 'operator')) NOT NULL
);

-- Scheduling of resources for a production order
CREATE TABLE production_schedule (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES production_orders(id),
    resource_id INTEGER REFERENCES resources(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);

-- Performance records for a production order
CREATE TABLE production_performance (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES production_orders(id),
    efficiency NUMERIC(5,2),
    productivity NUMERIC(5,2),
    quality NUMERIC(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restock alerts for minimum inventory thresholds
CREATE TABLE restock_alerts (
    id SERIAL PRIMARY KEY,
    item_type TEXT CHECK (item_type IN ('raw_material', 'product')) NOT NULL,
    reference_id INTEGER NOT NULL,
    minimum_quantity NUMERIC(10,2) NOT NULL
);

-- Itens (produtos ou matérias-primas)
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL, -- e.g. kg, meter, liter
    item_type TEXT CHECK (item_type IN ('product', 'raw_material', 'both')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Estoque unificado de itens
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id),
    quantity NUMERIC(10,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'operator', 'manager')) NOT NULL DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Máquinas
CREATE TABLE machines (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ordens de Produção
CREATE TABLE production_orders (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id), -- produto a ser produzido
    quantity NUMERIC(10,2) NOT NULL,
    delivery_deadline DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'finished', 'cancelled')) NOT NULL DEFAULT 'pending',
    manager_id INTEGER REFERENCES users(id), -- responsável pela produção
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matéria-prima usada em uma ordem de produção
CREATE TABLE order_materials (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES production_orders(id),
    item_id INTEGER REFERENCES items(id), -- item usado como matéria-prima
    quantity_used NUMERIC(10,2) NOT NULL
);

-- Programação da produção (associação flexível com máquina ou operador)
CREATE TABLE production_schedule (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES production_orders(id),
    machine_id INTEGER REFERENCES machines(id),
    operator_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);

-- Desempenho da produção
CREATE TABLE production_performance (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES production_orders(id),
    efficiency NUMERIC(5,2),
    productivity NUMERIC(5,2),
    quality NUMERIC(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notificações de reabastecimento
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id), -- destinatário do alerta
    alert_type TEXT CHECK (
        alert_type IN (
            'restock', 
            'order_update', 
            'order_completed', 
            'inventory_low', 
            'general'
        )
    ) NOT NULL,
    reference_id INTEGER, -- pode referenciar uma ordem, item etc., dependendo do tipo
    message TEXT NOT NULL, -- descrição legível do alerta
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

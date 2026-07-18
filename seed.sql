-- Seed Core Administrative Roles
INSERT INTO roles (role_name, description) VALUES 
('admin', 'Full system configuration, security setups, and user provisioning permissions.'),
('treasurer', 'Access restricted to financial transaction ledgers, contributions reporting, and M-Pesa oversight.'),
('minister', 'Parish-wide view of membership distributions, growth reporting, and district activities.'),
('elder', 'Restricted district access to view assigned communicant members and coordinate notifications.');

-- Seed Default Contribution Engines
INSERT INTO contribution_types (type_name, description) VALUES 
('Tithe', 'Regular monthly 10% Christian sanctuary giving.'),
('Thanksgiving', 'Special gratitude contributions.'),
('Building Fund', 'Development allocations for parish infrastructure expansion.'),
('Other', 'Miscellaneous custom donations or member activities.');

-- Seed a Default Admin Account 
-- Note: Replace password hash with a true generated bcrypt value during active module staging
INSERT INTO users (full_name, email, password_hash, role_id) VALUES 
('System Administrator', 'admin@pceadandora.org', '$2b$10$UnRealHashPlaceholderForLocalDevOnly12345', 1);
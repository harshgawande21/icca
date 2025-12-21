-- ICCA Database Schema
-- PostgreSQL Database Schema for Intelligent Client Communication Assistant

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email templates table
CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'approved', 'archived'
    description TEXT,
    subject_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    variables JSONB, -- Store template variables like [client_name], [project_name]
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email communications table
CREATE TABLE email_communications (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    template_id INTEGER REFERENCES email_templates(id),
    sender_id INTEGER REFERENCES users(id),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'pending', 'failed'
    tone VARCHAR(50), -- 'professional', 'polite', 'urgent'
    sent_at TIMESTAMP,
    scheduled_at TIMESTAMP,
    notes TEXT,
    metadata JSONB, -- Store additional data like missing_details, suggestions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email analytics table
CREATE TABLE email_analytics (
    id SERIAL PRIMARY KEY,
    communication_id INTEGER REFERENCES email_communications(id),
    event_type VARCHAR(50) NOT NULL, -- 'sent', 'opened', 'clicked', 'replied'
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Template categories lookup
CREATE TABLE template_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_email_communications_client_id ON email_communications(client_id);
CREATE INDEX idx_email_communications_sender_id ON email_communications(sender_id);
CREATE INDEX idx_email_communications_status ON email_communications(status);
CREATE INDEX idx_email_communications_sent_at ON email_communications(sent_at);
CREATE INDEX idx_email_templates_category ON email_templates(category);
CREATE INDEX idx_email_templates_status ON email_templates(status);
CREATE INDEX idx_clients_email ON clients(email);

-- Insert default template categories
INSERT INTO template_categories (name, description, color) VALUES
('Follow-up', 'Client follow-up and check-in emails', '#3b82f6'),
('Pricing', 'Cost clarification and pricing emails', '#10b981'),
('Updates', 'Project and status update emails', '#8b5cf6'),
('Reminders', 'Service and deadline reminder emails', '#f59e0b'),
('Meetings', 'Meeting requests and scheduling', '#06b6d4'),
('Urgent', 'Urgent communications and alerts', '#ef4444');

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@icca.com', '$2a$12$yjzyXjMCoAZMBZFOeN5QZe7eRbFXp36dDPS7ZDcOdZjh5jqX.41uq', 'ICCA', 'Admin', 'admin');

-- Insert default email templates
INSERT INTO email_templates (name, category, status, description, subject_template, body_template, variables, created_by) VALUES
('Client Follow-up', 'Follow-up', 'approved', 'Standard follow-up email for client communications', 
'Follow-up: {{project_name}} Status Update', 
'Hi {{client_name}},

I hope this email finds you well. I wanted to follow up on our recent discussion regarding {{project_name}}.

{{custom_message}}

Please let me know if you have any questions or need additional information.

Best regards,
{{sender_name}}',
'["client_name", "project_name", "custom_message", "sender_name"]', 1),

('Cost Clarification', 'Pricing', 'approved', 'Template for clarifying costs and pricing details',
'Cost Clarification: {{service_name}}',
'Dear {{client_name}},

Thank you for your interest in our services. I wanted to provide clarification on the pricing structure for {{service_name}}.

Pricing Details:
{{pricing_details}}

Total Investment: {{total_amount}}

I''m happy to discuss this further at your convenience.

Best regards,
{{sender_name}}',
'["client_name", "service_name", "pricing_details", "total_amount", "sender_name"]', 1),

('Status Update', 'Updates', 'approved', 'Weekly or monthly project status update template',
'Project Status Update - {{period}}',
'Hi {{client_name}},

Here''s the status update for {{project_name}}:

Completed:
{{completed_tasks}}

In Progress:
{{in_progress_tasks}}

Upcoming:
{{upcoming_tasks}}

Next milestone: {{next_milestone}}

Best regards,
{{sender_name}}',
'["client_name", "project_name", "period", "completed_tasks", "in_progress_tasks", "upcoming_tasks", "next_milestone", "sender_name"]', 1),

('Service Reminder', 'Reminders', 'approved', 'Reminder for upcoming service renewals or deadlines',
'Reminder: {{service_name}} Renewal Due',
'Dear {{client_name}},

This is a friendly reminder that your {{service_name}} is due for renewal on {{renewal_date}}.

To ensure uninterrupted service, please:
1. Review the attached renewal terms
2. Confirm your renewal by {{deadline}}

Please let me know if you have any questions.

Best regards,
{{sender_name}}',
'["client_name", "service_name", "renewal_date", "deadline", "sender_name"]', 1),

('Meeting Request', 'Meetings', 'approved', 'Professional meeting request template',
'Meeting Request: {{topic}}',
'Hi {{client_name}},

I would like to schedule a meeting to discuss {{topic}}.

Proposed times:
- {{option_1}}
- {{option_2}}
- {{option_3}}

The meeting will take approximately {{duration}} minutes.

Please let me know which time works best for you.

Best regards,
{{sender_name}}',
'["client_name", "topic", "option_1", "option_2", "option_3", "duration", "sender_name"]', 1),

('Urgent Issue Alert', 'Urgent', 'approved', 'Template for urgent client communications',
'URGENT: {{issue_description}}',
'Dear {{client_name}},

I need to bring to your immediate attention an urgent matter regarding {{issue}}.

Situation:
{{brief_description}}

Immediate action required:
{{action_items}}

I am available to discuss this at your earliest convenience.

Best regards,
{{sender_name}}',
'["client_name", "issue_description", "issue", "brief_description", "action_items", "sender_name"]', 1);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_communications_updated_at BEFORE UPDATE ON email_communications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
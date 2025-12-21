# 🗄️ Neon Database Setup for ICCA

## 🎯 **Your Database Connection**

✅ **Database URL**: `postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

---

## 🚀 **Step 1: Setup Database Schema (5 minutes)**

### **Option A: Using Neon Web Console (Easiest)**

1. **Go to**: https://console.neon.tech
2. **Login** to your account
3. **Select** your project
4. **Click**: "SQL Editor" in the sidebar
5. **Copy and paste** the complete schema below
6. **Click**: "Run" to execute

### **Complete Database Schema**
```sql
-- ICCA Database Schema for Neon PostgreSQL

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
    status VARCHAR(50) DEFAULT 'draft',
    description TEXT,
    subject_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    variables JSONB,
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
    status VARCHAR(50) DEFAULT 'draft',
    tone VARCHAR(50),
    sent_at TIMESTAMP,
    scheduled_at TIMESTAMP,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email analytics table
CREATE TABLE email_analytics (
    id SERIAL PRIMARY KEY,
    communication_id INTEGER REFERENCES email_communications(id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Template categories lookup
CREATE TABLE template_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
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
('Urgent', 'Urgent communications and alerts', '#ef4444'),
('Proposals', 'Business proposals and quotes', '#8b5cf6'),
('Onboarding', 'Client onboarding and welcome emails', '#06b6d4'),
('Support', 'Customer support and help emails', '#f59e0b'),
('Marketing', 'Marketing and promotional emails', '#ec4899'),
('Invoicing', 'Invoice and payment related emails', '#10b981'),
('Feedback', 'Feedback requests and surveys', '#6366f1'),
('Announcements', 'Company announcements and updates', '#84cc16'),
('Apologies', 'Apology and issue resolution emails', '#ef4444');

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

('Project Proposal', 'Proposals', 'approved', 'Professional project proposal template',
'Proposal: {{project_name}} - {{company_name}}',
'Dear {{client_name}},

Thank you for considering {{company_name}} for your {{project_type}} project. We are excited to present our proposal for {{project_name}}.

**Project Overview:**
{{project_overview}}

**Scope of Work:**
{{scope_of_work}}

**Timeline:**
- Project Start: {{start_date}}
- Estimated Completion: {{end_date}}

**Investment:**
{{pricing_breakdown}}
**Total Project Cost: {{total_cost}}**

We look forward to partnering with you on this exciting project.

Best regards,
{{sender_name}}',
'["client_name", "company_name", "project_type", "project_name", "project_overview", "scope_of_work", "start_date", "end_date", "pricing_breakdown", "total_cost", "sender_name"]', 1);

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
```

### **Verify Schema Creation**
After running the schema, you should see:
- ✅ **6 tables created**
- ✅ **14 categories inserted**
- ✅ **1 admin user created**
- ✅ **3+ email templates inserted**

---

## 🚀 **Step 2: Deploy Backend with Database**

### **Option A: Railway (Recommended)**

1. **Go to**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select**: Your ICCA repository
4. **Set root directory**: `server`
5. **Add environment variables**:
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://neondb_owner:npg_7gOSZ0desNAz@ep-dawn-lab-adocbyur-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=icca-secure-jwt-secret-2024-change-this
   CORS_ORIGINS=https://quiet-beijinho-a5ff63.netlify.app
   ```
6. **Deploy** and wait for completion
7. **Copy** your Railway backend URL

### **Option B: Render**

1. **Go to**: https://render.com
2. **New Web Service** from GitHub
3. **Configure**:
   ```
   Name: icca-backend
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```
4. **Add same environment variables** as above
5. **Deploy**

---

## 🔧 **Step 3: Update Netlify**

1. **Go to**: https://app.netlify.com/sites/quiet-beijinho-a5ff63/settings/deploys
2. **Environment variables** → Add new variable:
   ```bash
   Key: VITE_API_URL
   Value: https://your-backend-url.railway.app/api
   ```
   (Replace with your actual backend URL)
3. **Save** and **trigger deploy**

---

## 🧪 **Step 4: Test Everything**

### **Test Backend Health**
Visit: `https://your-backend-url/health`
Should return:
```json
{"status":"OK","timestamp":"...","service":"ICCA Backend API"}
```

### **Test Database Connection**
Visit: `https://your-backend-url/api/templates`
Should return list of templates.

### **Test Frontend**
1. **Go to**: https://quiet-beijinho-a5ff63.netlify.app/login
2. **Try login**:
   - Email: `admin@icca.com`
   - Password: `admin123`
3. **Should work** ✅

---

## 📋 **Troubleshooting**

### **If Schema Execution Fails**
- **Check**: You're in the correct database project
- **Try**: Running sections of the schema separately
- **Verify**: No syntax errors in the SQL

### **If Backend Still Fails Health Check**
- **Check**: DATABASE_URL is exactly as provided
- **Verify**: All environment variables are set
- **Look at**: Deployment logs for specific errors

### **If Login Still Doesn't Work**
- **Check**: VITE_API_URL points to correct backend
- **Verify**: CORS_ORIGINS matches your Netlify URL exactly
- **Test**: Backend endpoints directly

---

## 🎯 **Expected Result**

After completing all steps:
- ✅ **Database**: 6 tables with sample data
- ✅ **Backend**: Healthy and responding
- ✅ **Frontend**: Can login and access templates
- ✅ **Full app**: Working end-to-end

**Your ICCA app should be fully functional!** 🎉

---

## 🆘 **Need Help?**

If you encounter any issues:
1. **Share**: Specific error messages from deployment logs
2. **Check**: Each step was completed correctly
3. **Verify**: URLs and environment variables are correct

**Let me know how it goes!** 🚀
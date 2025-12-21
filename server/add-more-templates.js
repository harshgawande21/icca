const { query } = require('./database/connection');

async function addMoreTemplates() {
  console.log('📧 Adding more email templates to ICCA...');
  
  try {
    // First, add more categories
    console.log('📋 Adding new template categories...');
    
    const newCategories = [
      { name: 'Proposals', description: 'Business proposals and quotes', color: '#8b5cf6' },
      { name: 'Onboarding', description: 'Client onboarding and welcome emails', color: '#06b6d4' },
      { name: 'Support', description: 'Customer support and help emails', color: '#f59e0b' },
      { name: 'Marketing', description: 'Marketing and promotional emails', color: '#ec4899' },
      { name: 'Invoicing', description: 'Invoice and payment related emails', color: '#10b981' },
      { name: 'Feedback', description: 'Feedback requests and surveys', color: '#6366f1' },
      { name: 'Announcements', description: 'Company announcements and updates', color: '#84cc16' },
      { name: 'Apologies', description: 'Apology and issue resolution emails', color: '#ef4444' }
    ];

    for (const category of newCategories) {
      try {
        await query(`
          INSERT INTO template_categories (name, description, color) 
          VALUES ($1, $2, $3)
          ON CONFLICT (name) DO NOTHING
        `, [category.name, category.description, category.color]);
        console.log(`✅ Added category: ${category.name}`);
      } catch (err) {
        console.log(`ℹ️  Category ${category.name} already exists`);
      }
    }

    // Now add the new templates
    console.log('');
    console.log('📝 Adding new email templates...');

    const newTemplates = [
      // Proposals Category
      {
        name: 'Project Proposal',
        category: 'Proposals',
        status: 'approved',
        description: 'Professional project proposal template',
        subject_template: 'Proposal: {{project_name}} - {{company_name}}',
        body_template: `Dear {{client_name}},

Thank you for considering {{company_name}} for your {{project_type}} project. We are excited to present our proposal for {{project_name}}.

**Project Overview:**
{{project_overview}}

**Scope of Work:**
{{scope_of_work}}

**Timeline:**
- Project Start: {{start_date}}
- Estimated Completion: {{end_date}}
- Total Duration: {{duration}}

**Investment:**
{{pricing_breakdown}}
**Total Project Cost: {{total_cost}}**

**Next Steps:**
1. Review the attached detailed proposal
2. Schedule a discussion call if needed
3. Sign the agreement to begin

We look forward to partnering with you on this exciting project.

Best regards,
{{sender_name}}
{{company_name}}`,
        variables: '["client_name", "company_name", "project_type", "project_name", "project_overview", "scope_of_work", "start_date", "end_date", "duration", "pricing_breakdown", "total_cost", "sender_name"]'
      },

      {
        name: 'Quote Request Response',
        category: 'Proposals',
        status: 'approved',
        description: 'Response to quote requests with pricing',
        subject_template: 'Quote for {{service_name}} - {{company_name}}',
        body_template: `Hi {{client_name}},

Thank you for your interest in our {{service_name}} services. Based on your requirements, here's our detailed quote:

**Service Details:**
{{service_description}}

**Pricing Structure:**
{{pricing_details}}

**What's Included:**
{{inclusions}}

**Timeline:** {{delivery_timeline}}
**Quote Valid Until:** {{quote_expiry}}

**To proceed:**
1. Reply to confirm your interest
2. We'll send the service agreement
3. Project begins upon signed agreement

Feel free to reach out with any questions.

Best regards,
{{sender_name}}`,
        variables: '["client_name", "service_name", "company_name", "service_description", "pricing_details", "inclusions", "delivery_timeline", "quote_expiry", "sender_name"]'
      },

      // Onboarding Category
      {
        name: 'Welcome New Client',
        category: 'Onboarding',
        status: 'approved',
        description: 'Welcome email for new clients',
        subject_template: 'Welcome to {{company_name}}, {{client_name}}!',
        body_template: `Dear {{client_name}},

Welcome to {{company_name}}! We're thrilled to have you as our client and look forward to delivering exceptional {{service_type}} services.

**Your Account Details:**
- Account Manager: {{account_manager}}
- Project ID: {{project_id}}
- Start Date: {{start_date}}

**What Happens Next:**
1. {{step_1}}
2. {{step_2}}
3. {{step_3}}

**Important Resources:**
- Client Portal: {{portal_link}}
- Support Email: {{support_email}}
- Emergency Contact: {{emergency_contact}}

**Your Success is Our Priority**
Our team is committed to ensuring your project's success. Don't hesitate to reach out with any questions or concerns.

Welcome aboard!

{{sender_name}}
{{title}}
{{company_name}}`,
        variables: '["client_name", "company_name", "service_type", "account_manager", "project_id", "start_date", "step_1", "step_2", "step_3", "portal_link", "support_email", "emergency_contact", "sender_name", "title"]'
      },

      {
        name: 'Onboarding Checklist',
        category: 'Onboarding',
        status: 'approved',
        description: 'Client onboarding checklist and next steps',
        subject_template: 'Your Onboarding Checklist - {{project_name}}',
        body_template: `Hi {{client_name}},

To ensure a smooth start to your {{project_name}} project, please complete the following onboarding checklist:

**Required Actions:**
☐ {{action_1}}
☐ {{action_2}}
☐ {{action_3}}
☐ {{action_4}}

**Documents Needed:**
☐ {{document_1}}
☐ {{document_2}}
☐ {{document_3}}

**Access Setup:**
☐ {{access_1}}
☐ {{access_2}}

**Deadline:** Please complete by {{deadline_date}}

**Need Help?**
If you have questions about any of these items, please don't hesitate to contact me at {{contact_info}}.

Looking forward to getting started!

{{sender_name}}`,
        variables: '["client_name", "project_name", "action_1", "action_2", "action_3", "action_4", "document_1", "document_2", "document_3", "access_1", "access_2", "deadline_date", "contact_info", "sender_name"]'
      },

      // Support Category
      {
        name: 'Support Ticket Response',
        category: 'Support',
        status: 'approved',
        description: 'Response to customer support requests',
        subject_template: 'Re: Support Request #{{ticket_number}} - {{issue_type}}',
        body_template: `Hi {{client_name}},

Thank you for contacting our support team regarding {{issue_description}}.

**Ticket Details:**
- Ticket #: {{ticket_number}}
- Priority: {{priority_level}}
- Assigned to: {{support_agent}}

**Our Response:**
{{response_details}}

**Resolution Steps:**
{{resolution_steps}}

**Status:** {{current_status}}
**Expected Resolution:** {{resolution_timeline}}

We'll keep you updated on our progress. If you have any additional information or questions, please reply to this email.

Thank you for your patience.

Best regards,
{{support_agent}}
{{company_name}} Support Team`,
        variables: '["client_name", "issue_description", "ticket_number", "priority_level", "support_agent", "response_details", "resolution_steps", "current_status", "resolution_timeline", "company_name"]'
      },

      {
        name: 'Issue Resolution',
        category: 'Support',
        status: 'approved',
        description: 'Notification that an issue has been resolved',
        subject_template: 'Resolved: {{issue_title}} - Ticket #{{ticket_number}}',
        body_template: `Hi {{client_name}},

Great news! We've successfully resolved the issue you reported regarding {{issue_description}}.

**Resolution Summary:**
{{resolution_summary}}

**What We Fixed:**
{{fix_details}}

**Testing Completed:**
{{testing_details}}

**Prevention Measures:**
{{prevention_measures}}

The issue is now fully resolved and everything should be working normally. Please test on your end and let us know if you experience any further problems.

**Ticket #{{ticket_number}} Status:** RESOLVED
**Resolution Time:** {{resolution_time}}

Thank you for your patience while we worked on this issue.

Best regards,
{{sender_name}}
{{company_name}} Support Team`,
        variables: '["client_name", "issue_title", "ticket_number", "issue_description", "resolution_summary", "fix_details", "testing_details", "prevention_measures", "resolution_time", "sender_name", "company_name"]'
      },

      // Marketing Category
      {
        name: 'Newsletter Template',
        category: 'Marketing',
        status: 'approved',
        description: 'Monthly newsletter template',
        subject_template: '{{company_name}} Newsletter - {{month}} {{year}}',
        body_template: `Hi {{client_name}},

Welcome to the {{month}} edition of the {{company_name}} newsletter!

**This Month's Highlights:**
{{highlight_1}}
{{highlight_2}}
{{highlight_3}}

**Industry News:**
{{industry_news}}

**New Services:**
{{new_services}}

**Client Spotlight:**
{{client_spotlight}}

**Upcoming Events:**
{{upcoming_events}}

**Special Offer:**
{{special_offer}}

**Resources:**
{{resources}}

Thank you for being a valued part of our community!

Best regards,
{{sender_name}}
{{company_name}} Team

P.S. {{postscript}}`,
        variables: '["client_name", "company_name", "month", "year", "highlight_1", "highlight_2", "highlight_3", "industry_news", "new_services", "client_spotlight", "upcoming_events", "special_offer", "resources", "sender_name", "postscript"]'
      },

      {
        name: 'Product Launch',
        category: 'Marketing',
        status: 'approved',
        description: 'New product or service launch announcement',
        subject_template: 'Introducing {{product_name}} - {{launch_tagline}}',
        body_template: `Hi {{client_name}},

We're excited to announce the launch of {{product_name}}!

**What is {{product_name}}?**
{{product_description}}

**Key Benefits:**
• {{benefit_1}}
• {{benefit_2}}
• {{benefit_3}}
• {{benefit_4}}

**Perfect For:**
{{target_audience}}

**Launch Special:**
{{launch_offer}}
*Valid until {{offer_expiry}}*

**Get Started:**
{{call_to_action}}

**Learn More:**
Visit {{product_url}} for detailed information, demos, and pricing.

We can't wait for you to experience {{product_name}}!

Best regards,
{{sender_name}}
{{company_name}} Team`,
        variables: '["client_name", "product_name", "launch_tagline", "product_description", "benefit_1", "benefit_2", "benefit_3", "benefit_4", "target_audience", "launch_offer", "offer_expiry", "call_to_action", "product_url", "sender_name", "company_name"]'
      },

      // Invoicing Category
      {
        name: 'Invoice Notification',
        category: 'Invoicing',
        status: 'approved',
        description: 'Invoice sent notification with payment details',
        subject_template: 'Invoice #{{invoice_number}} - {{company_name}}',
        body_template: `Dear {{client_name}},

Thank you for your business! Your invoice is ready for payment.

**Invoice Details:**
- Invoice #: {{invoice_number}}
- Invoice Date: {{invoice_date}}
- Due Date: {{due_date}}
- Amount Due: {{amount_due}}

**Services Provided:**
{{services_description}}

**Payment Methods:**
{{payment_methods}}

**Payment Instructions:**
{{payment_instructions}}

**Questions?**
If you have any questions about this invoice, please contact our billing department at {{billing_contact}}.

**Late Payment Policy:**
{{late_payment_policy}}

Thank you for your prompt payment.

Best regards,
{{sender_name}}
{{company_name}} Billing Department`,
        variables: '["client_name", "invoice_number", "invoice_date", "due_date", "amount_due", "services_description", "payment_methods", "payment_instructions", "billing_contact", "late_payment_policy", "sender_name", "company_name"]'
      },

      {
        name: 'Payment Confirmation',
        category: 'Invoicing',
        status: 'approved',
        description: 'Payment received confirmation',
        subject_template: 'Payment Received - Invoice #{{invoice_number}}',
        body_template: `Dear {{client_name}},

Thank you! We've successfully received your payment.

**Payment Details:**
- Invoice #: {{invoice_number}}
- Payment Amount: {{payment_amount}}
- Payment Date: {{payment_date}}
- Payment Method: {{payment_method}}
- Transaction ID: {{transaction_id}}

**Account Status:** {{account_status}}

Your account is now up to date. A receipt has been attached to this email for your records.

**Next Invoice:** {{next_invoice_date}}

Thank you for your business and prompt payment!

Best regards,
{{sender_name}}
{{company_name}} Billing Department`,
        variables: '["client_name", "invoice_number", "payment_amount", "payment_date", "payment_method", "transaction_id", "account_status", "next_invoice_date", "sender_name", "company_name"]'
      },

      // Feedback Category
      {
        name: 'Feedback Request',
        category: 'Feedback',
        status: 'approved',
        description: 'Request for client feedback and reviews',
        subject_template: 'Your Feedback Matters - {{project_name}}',
        body_template: `Hi {{client_name}},

We hope you're thrilled with the {{project_name}} project we recently completed for you!

**Your Opinion Matters**
As we continuously strive to improve our services, we'd love to hear about your experience working with {{company_name}}.

**Quick Survey (2 minutes):**
{{survey_link}}

**What We'd Love to Know:**
• How satisfied are you with the final results?
• How was your experience with our team?
• What did we do well?
• How can we improve?
• Would you recommend us to others?

**Leave a Review:**
If you're happy with our work, we'd be grateful if you could leave a review:
• Google: {{google_review_link}}
• LinkedIn: {{linkedin_review_link}}

**Thank You Gift:**
As a token of our appreciation, we're offering {{thank_you_gift}} for completing our survey.

Thank you for choosing {{company_name}}!

Best regards,
{{sender_name}}`,
        variables: '["client_name", "project_name", "company_name", "survey_link", "google_review_link", "linkedin_review_link", "thank_you_gift", "sender_name"]'
      },

      {
        name: 'Survey Follow-up',
        category: 'Feedback',
        status: 'approved',
        description: 'Follow-up on feedback survey responses',
        subject_template: 'Thank You for Your Feedback - {{client_name}}',
        body_template: `Dear {{client_name}},

Thank you so much for taking the time to provide feedback on your recent experience with {{company_name}}!

**Your Feedback Summary:**
{{feedback_summary}}

**Our Response:**
{{response_to_feedback}}

**Actions We're Taking:**
{{improvement_actions}}

**Your Satisfaction Score:** {{satisfaction_score}}/10

{{#if_positive_feedback}}
We're delighted that you had a positive experience! Your kind words mean the world to our team.
{{/if_positive_feedback}}

{{#if_improvement_needed}}
We take your concerns seriously and are committed to addressing them. Here's what we're doing:
{{improvement_plan}}
{{/if_improvement_needed}}

**Stay Connected:**
• Follow us: {{social_media_links}}
• Newsletter: {{newsletter_signup}}
• Referral Program: {{referral_program}}

Thank you for helping us improve!

Warm regards,
{{sender_name}}
{{company_name}} Team`,
        variables: '["client_name", "company_name", "feedback_summary", "response_to_feedback", "improvement_actions", "satisfaction_score", "improvement_plan", "social_media_links", "newsletter_signup", "referral_program", "sender_name"]'
      },

      // Announcements Category
      {
        name: 'Company Update',
        category: 'Announcements',
        status: 'approved',
        description: 'General company announcements and updates',
        subject_template: 'Important Update from {{company_name}}',
        body_template: `Dear {{client_name}},

We wanted to share some important updates from {{company_name}}.

**{{announcement_title}}**

{{announcement_details}}

**What This Means for You:**
{{client_impact}}

**Key Changes:**
• {{change_1}}
• {{change_2}}
• {{change_3}}

**Timeline:**
{{implementation_timeline}}

**Your Action Required:**
{{required_actions}}

**Questions?**
Our team is here to help with any questions or concerns. Contact us at {{contact_info}}.

**Thank You**
We appreciate your continued trust in {{company_name}} and look forward to serving you better.

Best regards,
{{sender_name}}
{{title}}
{{company_name}}`,
        variables: '["client_name", "company_name", "announcement_title", "announcement_details", "client_impact", "change_1", "change_2", "change_3", "implementation_timeline", "required_actions", "contact_info", "sender_name", "title"]'
      },

      {
        name: 'Holiday Greetings',
        category: 'Announcements',
        status: 'approved',
        description: 'Holiday wishes and office closure notifications',
        subject_template: '{{holiday_name}} Greetings from {{company_name}}',
        body_template: `Dear {{client_name}},

As {{holiday_name}} approaches, we want to take a moment to express our heartfelt gratitude for your continued partnership with {{company_name}}.

**{{holiday_message}}**

**Office Schedule:**
Our offices will be closed from {{closure_start}} to {{closure_end}}.

**During Our Closure:**
• Emergency Support: {{emergency_contact}}
• Email Response: We'll respond to emails starting {{return_date}}
• Regular Operations Resume: {{return_date}}

**Looking Ahead:**
{{future_plans}}

**Our Gratitude:**
This year has been incredible thanks to amazing clients like you. Your trust and partnership mean everything to us.

**Holiday Wishes:**
{{personal_wishes}}

Warmest regards,
{{sender_name}} and the entire {{company_name}} team

P.S. {{holiday_ps}}`,
        variables: '["client_name", "holiday_name", "company_name", "holiday_message", "closure_start", "closure_end", "emergency_contact", "return_date", "future_plans", "personal_wishes", "sender_name", "holiday_ps"]'
      },

      // Apologies Category
      {
        name: 'Service Disruption Apology',
        category: 'Apologies',
        status: 'approved',
        description: 'Apology for service disruptions or issues',
        subject_template: 'Our Sincere Apologies - {{issue_type}}',
        body_template: `Dear {{client_name}},

We sincerely apologize for the {{issue_type}} that affected your {{service_name}} service on {{incident_date}}.

**What Happened:**
{{incident_description}}

**Impact on Your Service:**
{{service_impact}}

**Our Response:**
{{response_actions}}

**Resolution:**
{{resolution_details}}

**Prevention Measures:**
To prevent similar issues in the future, we have implemented:
• {{prevention_1}}
• {{prevention_2}}
• {{prevention_3}}

**Compensation:**
As an apology for this inconvenience, we are providing:
{{compensation_details}}

**Our Commitment:**
We take full responsibility for this incident and are committed to providing you with the reliable service you deserve.

**Contact Us:**
If you have any concerns or questions, please contact me directly at {{direct_contact}}.

Again, we sincerely apologize for any inconvenience caused.

Best regards,
{{sender_name}}
{{title}}
{{company_name}}`,
        variables: '["client_name", "issue_type", "service_name", "incident_date", "incident_description", "service_impact", "response_actions", "resolution_details", "prevention_1", "prevention_2", "prevention_3", "compensation_details", "direct_contact", "sender_name", "title", "company_name"]'
      },

      {
        name: 'Missed Deadline Apology',
        category: 'Apologies',
        status: 'approved',
        description: 'Apology for missed deadlines or delays',
        subject_template: 'Apology for Delay - {{project_name}}',
        body_template: `Dear {{client_name}},

I am writing to personally apologize for the delay in delivering {{project_name}}, which was originally scheduled for {{original_deadline}}.

**Reason for Delay:**
{{delay_reason}}

**Current Status:**
{{current_status}}

**New Timeline:**
• Revised Completion Date: {{new_deadline}}
• Key Milestones: {{milestones}}

**What We're Doing:**
To expedite completion and prevent future delays:
{{corrective_actions}}

**Additional Resources:**
We have allocated additional resources to ensure quality delivery:
{{additional_resources}}

**Your Project Remains Our Priority:**
{{priority_assurance}}

**Compensation:**
To make up for this inconvenience:
{{compensation_offer}}

I take full responsibility for this delay and am personally overseeing the project to ensure timely completion.

Please don't hesitate to contact me directly at {{direct_phone}} or {{direct_email}}.

Sincerely,
{{sender_name}}
{{title}}
{{company_name}}`,
        variables: '["client_name", "project_name", "original_deadline", "delay_reason", "current_status", "new_deadline", "milestones", "corrective_actions", "additional_resources", "priority_assurance", "compensation_offer", "direct_phone", "direct_email", "sender_name", "title", "company_name"]'
      }
    ];

    // Insert all templates
    let successCount = 0;
    for (const template of newTemplates) {
      try {
        await query(`
          INSERT INTO email_templates (name, category, status, description, subject_template, body_template, variables, created_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 1)
        `, [
          template.name,
          template.category,
          template.status,
          template.description,
          template.subject_template,
          template.body_template,
          template.variables
        ]);
        console.log(`✅ Added template: ${template.name}`);
        successCount++;
      } catch (err) {
        console.log(`❌ Failed to add template ${template.name}:`, err.message);
      }
    }

    console.log('');
    console.log('🎉 Template Addition Complete!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ New Templates Added: ${successCount}`);
    console.log(`   📋 New Categories Added: ${newCategories.length}`);
    
    // Get total count
    const totalResult = await query('SELECT COUNT(*) as total FROM email_templates');
    const categoryResult = await query('SELECT COUNT(*) as total FROM template_categories');
    
    console.log(`   📧 Total Templates: ${totalResult.rows[0].total}`);
    console.log(`   🏷️  Total Categories: ${categoryResult.rows[0].total}`);
    console.log('');
    console.log('🌐 View your new templates at: http://localhost:5173/templates');

  } catch (error) {
    console.error('❌ Failed to add templates:', error.message);
  }
  
  process.exit(0);
}

addMoreTemplates();
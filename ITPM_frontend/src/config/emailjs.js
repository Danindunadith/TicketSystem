// EmailJS Configuration
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_jrj10f4',
  TEMPLATE_ID: 'template_l0ctqxs',
  PUBLIC_KEY: 'KHn7-uw2zB2TcNn3K'
};

export const testEmailJSConfig = () => {
  const issues = [];
  
  if (EMAILJS_CONFIG.SERVICE_ID === 'service_your_service_id') {
    issues.push('SERVICE_ID needs to be updated with your actual EmailJS service ID');
  }
  
  if (EMAILJS_CONFIG.TEMPLATE_ID === 'template_your_template_id') {
    issues.push('TEMPLATE_ID needs to be updated with your actual EmailJS template ID');
  }
  
  if (EMAILJS_CONFIG.PUBLIC_KEY === 'your_public_key') {
    issues.push('PUBLIC_KEY needs to be updated with your actual EmailJS public key');
  }
  
  return {
    isConfigured: issues.length === 0,
    issues: issues
  };
};

export const sendTicketConfirmationEmail = async (ticketData) => {
  try {
    const emailjs = await import('@emailjs/browser');
    
    const configTest = testEmailJSConfig();
    if (!configTest.isConfigured) {
      throw new Error(`EmailJS not configured: ${configTest.issues.join(', ')}`);
    }

    const templateParams = {
      to_email: ticketData.email,
      to_name: ticketData.name,
      ticket_id: ticketData.ticketId,
      subject: ticketData.subject,
      department: ticketData.department,
      priority: ticketData.priority,
      date: ticketData.date,
      statement: ticketData.statement,
      ai_category: ticketData.aiPredictedCategory || 'Not specified',
      automated_response: ticketData.automatedResponse || 'No automated response available',
      reply_to: 'support@yourcompany.com'
    };

    const result = await emailjs.default.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Email sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

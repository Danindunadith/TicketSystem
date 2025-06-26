// Email Configuration Test
import { EMAILJS_CONFIG, testEmailJSConfig, sendTicketConfirmationEmail } from './config/emailjs.js';

// Test function to validate email setup
async function testEmailSetup() {
  console.log('🔍 Testing EmailJS Configuration...');
  
  // Test 1: Configuration validation
  const configTest = testEmailJSConfig();
  console.log('📋 Configuration Test:', configTest);
  
  if (!configTest.isConfigured) {
    console.error('❌ EmailJS Configuration Issues:', configTest.issues);
    return false;
  }
  
  console.log('✅ EmailJS Configuration Valid');
  console.log('📧 Config Details:', {
    SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
    TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID,
    PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 5) + '...' // Hide full key
  });
  
  // Test 2: Send test email
  console.log('📨 Testing email sending...');
  
  const testTicketData = {
    email: 'test@example.com', // Replace with your test email
    name: 'Test User',
    ticketId: 'TEST-001',
    subject: 'Email Configuration Test',
    department: 'IT',
    priority: 'Medium',
    date: new Date().toISOString().split('T')[0],
    statement: 'This is a test email to verify EmailJS configuration.',
    aiPredictedCategory: 'system test',
    automatedResponse: 'This is an automated test response.'
  };
  
  try {
    const emailResult = await sendTicketConfirmationEmail(testTicketData);
    
    if (emailResult.success) {
      console.log('✅ Test email sent successfully!', emailResult.result);
      return true;
    } else {
      console.error('❌ Test email failed:', emailResult.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Email test error:', error);
    return false;
  }
}

// Export for use in console
window.testEmailSetup = testEmailSetup;

console.log('📧 Email test function loaded. Run testEmailSetup() to test email configuration.');

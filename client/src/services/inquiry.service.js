const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919999900000';

export async function submitContactMessage(contactData) {
  try {
    const existing = JSON.parse(localStorage.getItem('sj_contact_messages') || '[]');
    const record = {
      ...contactData,
      id: 'msg-' + Date.now(),
      submittedAt: new Date().toISOString(),
    };
    existing.push(record);
    localStorage.setItem('sj_contact_messages', JSON.stringify(existing));
  } catch (err) {
    console.warn('Could not store contact message locally', err);
  }

  // Artificial brief delay for realistic smooth UI state
  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    success: true,
    message: 'Thank you! Your message has been received. Our candidate support team will contact you shortly.',
  };
}

export function generateWhatsAppInquiryUrl(type = 'candidate', data = {}) {
  let text = 'Hi SecurityJob Team, I am looking for a security job and need assistance with my application.';
  if (data.candidateCode) {
    text = `Hi SecurityJob Team,\nI have registered on SecurityJob.in. My Candidate ID is: ${data.candidateCode}.\nPlease check my application status.`;
  } else if (data.role) {
    text = `Hi SecurityJob Team,\nI am looking for a job as ${data.role} in ${data.city || 'India'}.\nPlease assist me with current openings.`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

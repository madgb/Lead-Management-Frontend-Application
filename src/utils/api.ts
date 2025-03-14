export async function createLead(formData: FormData) {
    const response = await fetch('/api/leads', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Failed to submit lead form');
    }
  
    return response.json();
}

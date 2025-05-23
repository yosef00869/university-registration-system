document.getElementById('registerBtn').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  if (!name || !email || !password || !role) {
    alert('Please fill in all fields.');
    return;
  }

  console.log('Sending register request:', { name, email, password, role });

  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    let responseData;
    try {
      responseData = await res.json();
    } catch (error) {
      responseData = { message: await res.text() };
    }

    console.log('Response status:', res.status, 'Response:', responseData);

    if (!res.ok) {
      alert('Registration failed: ' + (responseData.message || 'Unknown error'));
      return;
    }

    if (responseData.message === 'User registered successfully') {
      alert('Registration successful! Please login.');
      window.location.href = 'index.html';
    } else {
      alert('Registration failed: ' + (responseData.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Error connecting to the server: ' + error.message);
  }
});
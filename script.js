document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('Sending login request:', { email, password });

  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const responseText = await res.text();
  console.log('Response status:', res.status, 'Response text:', responseText);

  if (!res.ok) {
    alert('Login failed: ' + responseText);
    return;
  }

  const data = await JSON.parse(responseText);
  if (data.token) {
    localStorage.setItem('token', data.token);
    alert('Login successful!');
    window.location.href = 'courses.html';
  } else {
    alert('Login failed: ' + data.message || 'Unknown error');
  }
});
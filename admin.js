document.getElementById('addCourseBtn').addEventListener('click', async () => {
  const name = document.getElementById('courseName').value;
  const schedule = document.getElementById('schedule').value;
  const credits = parseInt(document.getElementById('credits').value);
  const maxStudents = parseInt(document.getElementById('maxStudents').value);

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first!');
    window.location.href = 'index.html';
    return;
  }

  const res = await fetch('http://localhost:5000/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, schedule, credits, maxStudents }),
  });

  if (!res.ok) {
    const text = await res.text();
    alert('Failed to add course: ' + text);
    return;
  }

  const data = await res.json();
  if (res.status === 201) {
    alert('Course added successfully!');
    document.getElementById('courseName').value = '';
    document.getElementById('schedule').value = '';
    document.getElementById('credits').value = '';
    document.getElementById('maxStudents').value = '';
  } else {
    alert('Failed to add course: ' + data.message);
  }
});
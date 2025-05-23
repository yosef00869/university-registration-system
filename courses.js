document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first!');
    window.location.href = 'index.html';
    return;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const studentId = payload.id;

  const res = await fetch('http://localhost:5000/api/courses', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Fetch courses error:', text);
    alert('Failed to fetch courses: ' + text);
    return;
  }

  const courses = await res.json();
  const courseList = document.getElementById('courseList');

  if (courses.length === 0) {
    courseList.innerHTML = '<p class="text-center text-white text-xl">No courses available.</p>';
  } else {
    courses.forEach(course => {
      const courseDiv = document.createElement('div');
      courseDiv.className = 'bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300';
      courseDiv.innerHTML = `
        <h3 class="text-xl font-semibold text-gray-800 mb-2">${course.name || 'Unnamed Course'}</h3>
        <p class="text-gray-600 mb-1">Credits: ${course.credits || 'N/A'}</p>
        <p class="text-gray-600 mb-1">Schedule: ${course.schedule || 'N/A'}</p>
        <button onclick="registerCourse('${course._id}', '${studentId}')" class="w-full p-2 mb-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all">Register</button>
        <button onclick="viewProfile('${studentId}')" class="w-full p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all">View My Profile</button>
      `;
      courseList.appendChild(courseDiv);
    });
  }
});

async function registerCourse(courseId, studentId) {
  const token = localStorage.getItem('token');
  console.log('Registering course with:', { studentId, courseId });
  const res = await fetch('http://localhost:5000/api/register-course', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ studentId, courseId }),
  });

  const responseText = await res.text();
  console.log('Response status:', res.status, 'Response text:', responseText);

  if (!res.ok) {
    alert('Failed to register course: ' + responseText);
    return;
  }

  const data = await JSON.parse(responseText);
  if (res.status === 200) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg animate-bounce';
    notification.textContent = 'Course registered successfully!';
    document.body.appendChild(notification);
    // نأخر الـ Reload لحد ما الـ Notification تختفي
    setTimeout(() => {
      notification.remove();
      window.location.reload(); // الـ Reload هيحصل بعد ما الـ Notification تختفي
    }, 5000); // مدة 5 ثواني
  } else {
    alert('Failed to register course: ' + data.message);
  }
}

async function viewProfile(studentId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8000/api/student/${studentId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    alert('Failed to fetch profile: ' + text);
    return;
  }

  const student = await res.json();
  alert(`Name: ${student.name}\nRegistered Courses: ${student.registeredCourses.length}\nTotal Credits: ${student.totalCredits}`);
}